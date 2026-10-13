import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const OPENAI_API_URL = "https://api.openai.com/v1/responses";
const SUGGEST_MODEL = "gpt-5.6-luna";
const RECIPE_MODEL = "gpt-5.6-terra";
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY")?.trim();
const ALLOWED_PUBLIC_KEYS = new Set([
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ydG1lcHluemN6ZmRkZGR2b2hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzODI0MTEsImV4cCI6MjEwMzk1ODQxMX0.tk_MBFTR-DTFBIlX51raW5Ow-S5DgVZ58L_2yF20dWY",
  "sb_publishable_b08-tfZCh2pEBGK0lBH-1g_oB3RwvV8"
]);

const proposalSchema = {
  type: "object",
  properties: {
    title: { type: "string" }, subtitle: { type: "string" }, emoji: { type: "string" }, minutes: { type: "number" },
    difficulty: { type: "string", enum: ["Fácil", "Media", "Avanzada"] },
    usedIngredients: { type: "array", items: { type: "string" } },
    missingIngredients: { type: "array", items: { type: "string" } },
    reason: { type: "string" }
  },
  required: ["title", "subtitle", "emoji", "minutes", "difficulty", "usedIngredients", "missingIngredients", "reason"],
  additionalProperties: false
};

const proposalsOutputSchema = {
  type: "object",
  properties: { proposals: { type: "array", minItems: 1, maxItems: 1, items: proposalSchema } },
  required: ["proposals"],
  additionalProperties: false
};

const recipeSchema = {
  type: "object",
  properties: {
    id: { type: "string" }, title: { type: "string" }, description: { type: "string" }, emoji: { type: "string" },
    baseServings: { type: "number" }, prepMinutes: { type: "number" }, cookMinutes: { type: "number" },
    difficulty: { type: "string", enum: ["Fácil","Media","Avanzada"] },
    mealType: { type: "string", enum: ["Desayuno","Brunch","Comida","Merienda","Cena"] },
    style: { type: "string" }, cuisine: { type: "string" },
    ingredients: { type: "array", minItems: 3, items: { type: "object", properties: {
      name: { type: "string" }, quantity: { type: "number" }, unit: { type: "string" }, section: { type: ["string","null"] },
      scalingMode: { type: "string", enum: ["linear","discrete","culinary","fixed"] }, optional: { type: ["boolean","null"] }
    }, required: ["name","quantity","unit","section","scalingMode","optional"], additionalProperties: false } },
    miseEnPlace: { type: "array", items: { type: "string" } },
    steps: { type: "array", minItems: 2, items: { type: "object", properties: {
      number: { type: "number" }, instruction: { type: "string" }, minutes: { type: ["number","null"] }, temperatureC: { type: ["number","null"] }, cue: { type: ["string","null"] }
    }, required: ["number","instruction","minutes","temperatureC","cue"], additionalProperties: false } },
    criticalPoints: { type: "array", items: { type: "string" } }, substitutions: { type: "array", items: { type: "string" } }, storage: { type: "string" },
    nutritionPerServing: { type: "object", properties: { kcal: { type: "number" }, proteinG: { type: "number" }, carbsG: { type: "number" }, fatG: { type: "number" } }, required: ["kcal","proteinG","carbsG","fatG"], additionalProperties: false },
    source: { type: "object", properties: { kind: { type: "string", enum: ["ai"] }, label: { type: "string" }, retrievedAt: { type: "string" }, adapted: { type: "boolean" } }, required: ["kind","label","retrievedAt","adapted"], additionalProperties: false }
  },
  required: ["id","title","description","emoji","baseServings","prepMinutes","cookMinutes","difficulty","mealType","style","cuisine","ingredients","miseEnPlace","steps","criticalPoints","substitutions","storage","nutritionPerServing","source"],
  additionalProperties: false
};

const recipeOutputSchema = { type: "object", properties: { recipes: { type: "array", minItems: 1, maxItems: 1, items: recipeSchema } }, required: ["recipes"], additionalProperties: false };

const suggestionPrompt = `Eres el motor de recomendaciones culinarias de The Chef. Devuelve exactamente 1 propuesta creativa y breves en español. NO desarrolles recetas completas. Cada propuesta debe incluir solo nombre, descripción de una frase, tiempo total realista, dificultad, ingredientes principales que aprovecharía, ingredientes importantes que faltarían y una razón breve de por qué encaja. Respeta comensales, tiempo máximo, dificultad, estilo, cocina e ingredientes disponibles. En modo pantry prioriza los ingredientes marcados como priority. No inventes cantidades disponibles del usuario. Antes de decir que falta algo, considera sustituciones culinarias razonables. Sé muy conciso: evita explicaciones largas y no repitas el contexto del usuario.`;
const recipePrompt = `Eres el motor de recetas de The Chef. Desarrolla exactamente 1 receta completa en español a partir de la propuesta elegida y del contexto original. Debe ser fiable, reproducible y gastronómicamente coherente. Respeta comensales, tiempo, dificultad, estilo, cocina e ingredientes disponibles. En modo pantry prioriza ingredientes marcados como priority y no inventes cantidades disponibles. Usa cantidades métricas útiles y tiempos/temperaturas realistas. Pasos numerados y cronológicos con señales de punto cuando aporten valor. Incluye mise en place, puntos críticos, sustituciones, conservación y nutrición aproximada. Evita ingredientes no utilizados. source.kind="ai", source.label="OpenAI · The Chef", source.adapted=true. Si no se especifica mealType usa "Comida".`;
const revisionPrompt = `Eres el motor de revisión de recetas de The Chef. Recibirás una receta completa ya existente, una instrucción libre del usuario y, cuando proceda, el número de comensales actual. Devuelve exactamente 1 receta completa revisada en español.

Aplica fielmente los cambios solicitados y conserva el resto de la receta siempre que siga siendo coherente. No cambies silenciosamente ingredientes, técnicas, estilo, cocina o estructura que el usuario no haya pedido modificar, salvo los ajustes estrictamente necesarios para que la receta funcione.

Si el usuario sustituye una guarnición, salsa, técnica o elaboración, elimina de ingredientes, mise en place y pasos todo lo que ya no se use e incorpora lo nuevo de forma completa. Recalcula cantidades, tiempos, temperaturas, orden de pasos, puntos críticos, sustituciones, conservación y nutrición cuando el cambio lo requiera. Si se aporta servings, úsalo como baseServings y adapta las cantidades con criterio culinario, no con una multiplicación ciega para sal, grasas, líquidos, especias, huevos, espesantes o fermentos. Mantén el título reconocible, pero actualízalo si el cambio altera claramente el plato.

La receta final debe ser fiable, reproducible y gastronómicamente coherente. Usa cantidades métricas útiles y señales de punto cuando aporten valor. No dejes ingredientes sin utilizar ni pasos de la versión anterior que ya no correspondan. source.kind="ai", source.label="OpenAI · The Chef · revisión", source.adapted=true.`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "METHOD_NOT_ALLOWED" }, 405);

  const suppliedKey = req.headers.get("apikey")?.trim();
  if (!suppliedKey || !ALLOWED_PUBLIC_KEYS.has(suppliedKey)) return json({ error: "SUPABASE_AUTH_ERROR", errorCode: "invalid_supabase_api_key", errorMessage: "La clave pública enviada por la app no corresponde a THE-CHEF." }, 401);

  const url = new URL(req.url);
  const operation = url.pathname.endsWith("/suggest")
    ? "suggest"
    : url.pathname.endsWith("/generate")
      ? "generate"
      : url.pathname.endsWith("/revise")
        ? "revise"
        : url.pathname.endsWith("/recommend")
          ? "recommend"
          : url.pathname.endsWith("/search")
            ? "search"
            : "unknown";
  if (operation === "unknown") return json({ error: "UNKNOWN_OPERATION" }, 404);

  let payload: Record<string, unknown>;
  try {
    const parsed = await req.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error();
    payload = parsed as Record<string, unknown>;
  } catch {
    return json({ error: "INVALID_JSON" }, 400);
  }
  if (!OPENAI_API_KEY) return json({ error: "OPENAI_NOT_CONFIGURED", errorCode: "missing_api_key", errorMessage: "Falta OPENAI_API_KEY en Supabase." }, 503);

  try {
    if (operation === "suggest") {
      const userContext = { task: "suggest_recipes", request: payload.request ?? {} };
      const parsed = await generateStructuredWithRetry(suggestionPrompt, userContext, proposalsOutputSchema, "the_chef_proposals", [1800, 2600], SUGGEST_MODEL);
      const proposals = Array.isArray(parsed?.proposals) ? parsed.proposals : [];
      if (proposals.length !== 1) throw new StructuredOutputError("proposal_count", `Se esperaba 1 propuesta y llegaron ${proposals.length}.`);
      const prefix = Date.now().toString(36);
      return json({ proposals: proposals.map((proposal: Record<string, unknown>, i: number) => ({ id: `ai-proposal-${prefix}-${i+1}`, recipeId: `ai-proposal-${prefix}-${i+1}`, ...proposal })), meta: { provider: "openai", model: SUGGEST_MODEL, operation, status: "ok" } });
    }

    if (operation === "generate") {
      const userContext = { task: "generate_selected_recipe", request: payload.request ?? {}, proposal: payload.proposal ?? {} };
      const parsed = await generateStructuredWithRetry(recipePrompt, userContext, recipeOutputSchema, "the_chef_recipe", [6000, 8000], RECIPE_MODEL);
      const recipes = Array.isArray(parsed?.recipes) ? parsed.recipes : [];
      return json({ recipes: normalizeRecipes(recipes), meta: { provider: "openai", model: RECIPE_MODEL, operation, status: "ok" } });
    }

    if (operation === "revise") {
      const instruction = typeof payload.instruction === "string" ? payload.instruction.trim() : "";
      const recipe = payload.recipe;
      if (!instruction) return json({ error: "INVALID_REVISION_INSTRUCTION", errorCode: "missing_revision_instruction", errorMessage: "Indica qué quieres cambiar en la receta." }, 400);
      if (!recipe || typeof recipe !== "object" || Array.isArray(recipe)) return json({ error: "INVALID_RECIPE", errorCode: "missing_recipe", errorMessage: "No se ha recibido la receta que hay que revisar." }, 400);
      const userContext = {
        task: "revise_existing_recipe",
        instruction,
        servings: typeof payload.servings === "number" && Number.isFinite(payload.servings) && payload.servings > 0 ? payload.servings : null,
        recipe
      };
      const parsed = await generateStructuredWithRetry(revisionPrompt, userContext, recipeOutputSchema, "the_chef_recipe_revision", [6000, 8000], RECIPE_MODEL);
      const recipes = Array.isArray(parsed?.recipes) ? parsed.recipes : [];
      return json({ recipes: normalizeRecipes(recipes), meta: { provider: "openai", model: RECIPE_MODEL, operation, status: "ok" } });
    }

    const userContext = operation === "recommend" ? { task: "recommend_recipes", request: payload.request ?? {} } : { task: "search_recipes", filters: payload.filters ?? {} };
    const parsed = await generateStructuredWithRetry(recipePrompt, userContext, recipeOutputSchema, "the_chef_recipe", [6000, 8000], RECIPE_MODEL);
    const recipes = Array.isArray(parsed?.recipes) ? parsed.recipes : [];
    return json({ recipes: normalizeRecipes(recipes), meta: { provider: "openai", model: RECIPE_MODEL, operation, status: "ok" } });
  } catch (error) {
    if (error instanceof ProviderError) {
      console.error("OpenAI error", error.status, error.type, error.code, error.message);
      const safeStatus = [400,401,403,404,409,429].includes(error.status) ? error.status : 502;
      return json({ error: "OPENAI_ERROR", openaiStatus: error.status, errorType: error.type, errorCode: error.code, errorMessage: error.message.slice(0,320) }, safeStatus);
    }
    if (error instanceof StructuredOutputError) {
      console.error("Structured output error", error.stage, error.message);
      return json({ error: "STRUCTURED_OUTPUT_ERROR", errorCode: `structured_${error.stage}`, errorMessage: error.message.slice(0,240) }, 502);
    }
    console.error("Recipe generation failed", error);
    return json({ error: "GENERATION_FAILED", errorCode: "generation_failed", errorMessage: String(error).slice(0,240) }, 502);
  }
});

async function generateStructuredWithRetry(prompt: string, userContext: unknown, schema: unknown, name: string, tokenBudgets: number[], model: string) {
  let lastError: unknown;
  for (let attempt = 0; attempt < tokenBudgets.length; attempt++) {
    try {
      const raw = await callOpenAI(prompt, userContext, schema, name, tokenBudgets[attempt], model);
      if (raw?.status === "incomplete") throw new StructuredOutputError("incomplete", describeResponseState(raw));
      const outputText = extractOutputText(raw);
      if (!outputText) throw new StructuredOutputError("empty", describeResponseState(raw));
      try {
        return JSON.parse(outputText);
      } catch {
        const recovered = extractJsonObject(outputText);
        if (recovered) { try { return JSON.parse(recovered); } catch { /* retry invalid or truncated JSON */ } }
        throw new StructuredOutputError("json_parse", "La respuesta estructurada no contenía JSON válido.");
      }
    } catch (error) {
      lastError = error;
      if (error instanceof ProviderError) throw error;
      if (attempt + 1 < tokenBudgets.length) {
        console.warn("Retry structured generation", attempt + 1, error instanceof Error ? error.message : String(error));
        continue;
      }
    }
  }
  throw lastError ?? new StructuredOutputError("unknown", "No se pudo interpretar la respuesta estructurada.");
}

async function callOpenAI(prompt: string, userContext: unknown, schema: unknown, name: string, maxOutputTokens: number, model: string) {
  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: { "Authorization": `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      reasoning: { effort: "none" },
      input: [{ role: "developer", content: prompt }, { role: "user", content: JSON.stringify(userContext) }],
      text: { format: { type: "json_schema", name, strict: true, schema } },
      max_output_tokens: maxOutputTokens
    })
  });
  const raw = await response.json().catch(() => ({}));
  if (!response.ok) {
    const err = raw?.error ?? {};
    throw new ProviderError(response.status, typeof err?.type === "string" ? err.type : undefined, typeof err?.code === "string" ? err.code : undefined, typeof err?.message === "string" ? err.message : "Error del proveedor de IA");
  }
  return raw;
}

class ProviderError extends Error { constructor(public status: number, public type?: string, public code?: string, message = "Error del proveedor de IA") { super(message); } }
class StructuredOutputError extends Error { constructor(public stage: string, message: string) { super(message); } }

function describeResponseState(raw: any): string {
  if (raw?.status === "incomplete") return `Respuesta incompleta${raw?.incomplete_details?.reason ? `: ${raw.incomplete_details.reason}` : "."}`;
  if (Array.isArray(raw?.output)) {
    for (const item of raw.output) for (const content of item?.content ?? []) if (content?.type === "refusal" && typeof content?.refusal === "string") return `La IA rechazó la salida: ${content.refusal.slice(0,120)}`;
  }
  return "La IA respondió sin texto estructurado utilizable.";
}

function extractJsonObject(text: string): string | undefined {
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  return first >= 0 && last > first ? text.slice(first, last + 1) : undefined;
}
function normalizeRecipes(recipes: Record<string, unknown>[]) {
  const now = new Date().toISOString(); const prefix = Date.now().toString(36);
  return recipes.map((recipe, i) => ({ ...recipe, id: `ai-${prefix}-${i+1}-${slug(String(recipe.title ?? "receta"))}`, source: { kind: "ai", label: String((recipe as any)?.source?.label || "OpenAI · The Chef"), retrievedAt: now, adapted: true } }));
}
function extractOutputText(raw: any): string {
  if (typeof raw?.output_text === "string" && raw.output_text.trim()) return raw.output_text.trim();
  if (!Array.isArray(raw?.output)) return "";
  for (const item of raw.output) for (const content of item?.content ?? []) if (content?.type === "output_text" && typeof content?.text === "string") return content.text.trim();
  return "";
}
function slug(v: string): string { return v.toLocaleLowerCase("es").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,42) || "receta"; }
function json(body: unknown, status = 200) { return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } }); }

