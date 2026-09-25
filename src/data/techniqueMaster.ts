import master from './theChefTechniquesMaster.json' with { type: 'json' };
import type { Technique } from '../services/techniqueGateway';
import { buildTechniqueEditorial } from './techniqueEditorialV2';

type RawTechnique = {
  id: string;
  legacy_id?: string | null;
  nombre: string;
  alias?: string[];
  familia: string;
  subfamilia?: string;
  nivel: 'Básico' | 'Intermedio' | 'Avanzado';
  definicion_corta: string;
  definicion_completa?: string;
  objetivo_culinario?: string;
  cuando_usarla?: string;
  cuando_no_usarla?: string;
  ingredientes_habituales?: string[];
  elaboraciones_frecuentes?: string[];
  tecnicas_relacionadas?: string[];
  utensilios?: string[];
  temperatura_orientativa?: string;
  tiempo_orientativo?: string;
  punto_clave?: string;
  senales_de_exito?: string[];
  pasos_base?: string[];
  errores_frecuentes?: string[];
  como_corregir?: string[];
  seguridad_e_higiene?: string[];
  requiere_receta_validada?: boolean;
  temporizador_recomendado?: boolean;
  titulo_temporizador?: string;
  tip_chef?: string;
  truco_profesional?: string;
  palabras_clave?: string[];
  resumen_app?: string;
  microcopy_modo_cocina?: string;
  image_prompt?: string;
};

const raw = master.tecnicas as RawTechnique[];

const difficulty = (value: RawTechnique['nivel']): Technique['difficulty'] =>
  value === 'Avanzado' ? 'Avanzada' : value === 'Intermedio' ? 'Media' : 'Fácil';

const relatedNameToId = new Map(raw.map(item => [normalize(item.nombre), item.id]));

export const techniqueMaster: Technique[] = raw.map(item => {
  const editorial = buildTechniqueEditorial({
    title: item.nombre,
    family: item.familia,
    definition: item.definicion_corta,
    objective: item.objetivo_culinario,
    pointKey: item.punto_clave,
    equipment: item.utensilios || [],
    commonIngredients: item.ingredientes_habituales || [],
    requiresValidatedRecipe: Boolean(item.requiere_receta_validada)
  });
  return ({
  id: item.id,
  title: item.nombre,
  description: item.resumen_app || item.definicion_corta,
  category: item.familia,
  family: item.familia,
  subfamily: item.subfamilia,
  timeMinutes: 0,
  timeLabel: item.tiempo_orientativo || 'Según producto y método',
  difficulty: difficulty(item.nivel),
  equipment: item.utensilios || [],
  miseEnPlace: editorial.miseEnPlace,
  ingredients: editorial.ingredients.map(name => ({ name })),
  steps: editorial.steps.map((instruction, index) => ({
    number: index + 1,
    instruction,
    cue: index === (item.pasos_base?.length || 0) - 1 ? item.senales_de_exito?.[0] : undefined
  })),
  criticalPoints: [item.punto_clave, ...(item.seguridad_e_higiene || [])].filter((value): value is string => Boolean(value)),
  storage: (item.seguridad_e_higiene || []).join(' '),
  uses: [...(item.elaboraciones_frecuentes || [])].filter(Boolean),
  createdAt: '2026-09-23T00:00:00Z',
  builtin: true,
  aliases: item.alias || [],
  keywords: item.palabras_clave || [],
  shortDefinition: item.definicion_corta,
  fullDefinition: item.definicion_completa,
  objective: item.objetivo_culinario,
  whenToUse: editorial.whenToUse,
  whenNotToUse: editorial.whenNotToUse,
  successSignals: item.senales_de_exito || [],
  frequentErrors: item.errores_frecuentes || [],
  corrections: item.como_corregir || [],
  safety: item.seguridad_e_higiene || [],
  timerRecommended: Boolean(item.temporizador_recomendado),
  timerTitle: item.titulo_temporizador || item.nombre,
  requiresValidatedRecipe: Boolean(item.requiere_receta_validada),
  chefTip: editorial.chefTip,
  professionalTip: item.truco_profesional,
  relatedTechniqueIds: (item.tecnicas_relacionadas || []).map(name => relatedNameToId.get(normalize(name))).filter((value): value is string => Boolean(value)),
  legacyId: item.legacy_id || undefined,
  imagePrompt: item.image_prompt
  });
});

export const techniqueMasterById = new Map(techniqueMaster.map(item => [item.id, item]));

function normalize(value: string) {
  return value.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}
