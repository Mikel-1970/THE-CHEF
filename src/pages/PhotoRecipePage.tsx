import { Camera, Check, ImagePlus, Mic, MicOff, Plus, Sparkles, UsersRound, X } from 'lucide-react';
import { ChangeEvent, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { ChefLoadingOverlay } from '../components/ChefLoadingOverlay';
import { NumberStepper } from '../components/NumberStepper';
import { PrimaryButton } from '../components/PrimaryButton';
import { TopBar } from '../components/TopBar';
import { useApp } from '../AppContext';
import type { CookingRequest, Proposal, Recipe } from '../domain/types';
import { useAiDictation } from '../hooks/useAiDictation';
import { generateAiRecipe } from '../services/aiProposalGateway';
import { getHybridProposals } from '../services/hybridRecommendationEngine';
import { evaluateDishPhoto, saveRecipeThumbnail } from '../services/mediaGateway';
import { getRecipeById, registerExternalRecipes, rememberActiveRecipe, rememberLibraryRecipe } from '../services/recipeCatalog';
import '../voice-input.css';

type PhotoStage = 'select' | 'identified' | 'ingredients';

export function PhotoRecipePage() {
  const navigate = useNavigate();
  const { settings } = useApp();
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [selectedFile, setSelectedFile] = useState<File>();
  const [sourceImageData, setSourceImageData] = useState<string>();
  const [stage, setStage] = useState<PhotoStage>('select');
  const [proposal, setProposal] = useState<Proposal>();
  const [visualSummary, setVisualSummary] = useState('');
  const [working, setWorking] = useState<'analyse' | 'generate'>();
  const [error, setError] = useState<string>();
  const [correction, setCorrection] = useState('');
  const [correctionOpen, setCorrectionOpen] = useState(false);
  const [personalization, setPersonalization] = useState('');
  const [servings, setServings] = useState(settings.defaultServings || 2);
  const [confirmedIngredients, setConfirmedIngredients] = useState<Set<string>>(new Set());
  const [extraIngredient, setExtraIngredient] = useState('');
  const correctionVoice = useAiDictation(transcript => setCorrection(current => appendSentence(current, transcript)));
  const personalizationVoice = useAiDictation(transcript => setPersonalization(current => appendSentence(current, transcript)));

  const identifiedIngredients = useMemo(() => proposal ? Array.from(new Set([...proposal.usedIngredients, ...proposal.missingIngredients])).filter(Boolean) : [], [proposal]);

  const selectPhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setSourceImageData(undefined);
    setProposal(undefined);
    setVisualSummary('');
    setCorrection('');
    setCorrectionOpen(false);
    setPersonalization('');
    setStage('select');
    setError(undefined);
  };

  const analyse = async (userCorrection?: string) => {
    if (!selectedFile || working) return;
    setWorking('analyse');
    setError(undefined);
    try {
      const visual = sourceImageData && visualSummary
        ? { previewUrl: sourceImageData, evaluation: { summary: visualSummary, strengths: [], score: 0, verdict: 'bien' as const, improvements: [] } }
        : await evaluateDishPhoto(visualIdentificationRecipe, selectedFile);
      setSourceImageData(visual.previewUrl);
      setVisualSummary(visual.evaluation.summary);
      const correctionText = userCorrection?.trim();
      const request: CookingRequest = {
        mode: 'desire',
        servings,
        maxMinutes: 120,
        pantryBasics: settings.pantryBasics,
        desireText: correctionText
          ? `Quiero reproducir exactamente un plato de una fotografía. Mi corrección es: ${correctionText}. La imagen sugiere además: ${visual.evaluation.summary}. Devuelve una identificación plausible y concreta del plato.`
          : `Quiero reproducir exactamente el plato de una fotografía. A simple vista se aprecia: ${visual.evaluation.summary}. Identifica el plato de la forma más concreta y plausible posible y evita propuestas alternativas distintas.`
      };
      const result = await getHybridProposals(request);
      const first = result.proposals[0];
      if (!first) throw new Error('No he podido identificar una receta plausible en la foto.');
      setProposal(first);
      const ingredients = Array.from(new Set([...first.usedIngredients, ...first.missingIngredients])).filter(Boolean);
      setConfirmedIngredients(new Set(ingredients));
      setCorrection('');
      setCorrectionOpen(false);
      setStage('identified');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se ha podido analizar el plato.');
    } finally {
      setWorking(undefined);
    }
  };

  const addIngredient = () => {
    const clean = extraIngredient.trim();
    if (!clean) return;
    setConfirmedIngredients(current => new Set([...current, clean]));
    setExtraIngredient('');
  };

  const generateRecipe = async () => {
    if (!proposal || working) return;
    setWorking('generate');
    setError(undefined);
    try {
      const ingredientList = Array.from(confirmedIngredients);
      const personalizationText = personalization.trim() ? ` Personalización solicitada: ${personalization.trim()}.` : '';
      const request: CookingRequest = {
        mode: 'desire',
        servings,
        maxMinutes: 120,
        pantryBasics: settings.pantryBasics,
        desireText: `Reproduce el plato de la fotografía identificado como “${proposal.title}”. La referencia visual es: ${visualSummary}. Ingredientes confirmados por el usuario: ${ingredientList.join(', ')}.${personalizationText} Genera una sola receta completa, fiel a ese plato y adaptada a ${servings} comensales.`
      };
      let recipe: Recipe | undefined;
      if (proposal.recipeId.startsWith('ai-proposal-')) {
        const adjusted: Proposal = { ...proposal, usedIngredients: ingredientList, missingIngredients: [] };
        recipe = await generateAiRecipe(request, adjusted);
      } else {
        recipe = getRecipeById(proposal.recipeId);
      }
      if (!recipe) throw new Error('No se ha podido crear la receta final.');
      const [registered] = registerExternalRecipes([recipe]);
      const stored = registered ?? recipe;
      rememberActiveRecipe(stored);
      rememberLibraryRecipe(stored);
      if (sourceImageData) {
        try { sessionStorage.setItem(`chef:source-photo:${stored.id}`, sourceImageData); } catch { /* sin persistencia visual */ }
        await saveRecipeThumbnail(stored.id, sourceImageData).catch(() => undefined);
      }
      navigate(`/receta/${stored.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se ha podido generar la receta.');
    } finally {
      setWorking(undefined);
    }
  };

  return (
    <AppShell hideBack hideProfile>
      <ChefLoadingOverlay active={working === 'analyse'} title="Analizando el plato" messages={['Identificando el plato…', 'Leyendo ingredientes visibles…', 'Comprobando la interpretación…']} />
      <ChefLoadingOverlay active={working === 'generate'} title="Preparando tu receta" messages={['Ajustando cantidades…', 'Ordenando la elaboración…', 'Afinando puntos críticos…']} />
      <TopBar eyebrow="MIRA, CONFIRMA Y COCINA" title="Receta desde una foto" />
      <div className="page-content nav-safe">
        <section className="editorial-card olive-intro"><span className="eyebrow">ENSÉÑAME EL PLATO</span><h2>Descubre cómo prepararlo.</h2><p>El Chef primero identificará el plato, después confirmarás los ingredientes y solo entonces generará una receta completa.</p></section>
        <section className="photo-recipe-upload">{previewUrl ? <img src={previewUrl} alt="Plato elegido para identificar" /> : <div><Camera size={44} /><strong>Añade la foto del plato</strong><span>Procura que tenga buena luz y se vea el plato completo.</span></div>}</section>
        <div className="photo-recipe-actions"><label className="photo-recipe-button"><Camera size={20} />Hacer una foto<input type="file" accept="image/*" capture="environment" onChange={selectPhoto} /></label><label className="photo-recipe-button secondary"><ImagePlus size={20} />Elegir de la galería<input type="file" accept="image/*" onChange={selectPhoto} /></label></div>

        {previewUrl && stage === 'select' && <div className="sticky-action"><PrimaryButton onClick={() => void analyse()} disabled={Boolean(working)}>{working ? 'Analizando…' : 'Analizar el plato'}</PrimaryButton></div>}

        {proposal && stage === 'identified' && <section className="editorial-card photo-identification-card">
          <span className="eyebrow">PASO 1 · IDENTIFICACIÓN</span>
          <h2>Creo que es: {proposal.title}</h2>
          <p>{shortText(proposal.subtitle || visualSummary)}</p>
          <strong>¿Es este el plato que quieres reproducir?</strong>
          <div className="photo-answer-actions"><button className="secondary-button" type="button" onClick={() => setStage('ingredients')}><Check size={18} /> Sí, correcto</button><button className="secondary-button" type="button" onClick={() => setCorrectionOpen(true)}><X size={18} /> No, corregir</button></div>
          {correctionOpen && <div className="photo-correction-box"><textarea value={correction} onChange={event => setCorrection(event.target.value)} placeholder="Ej. Es una ensalada de feta y sandía con pistachos." autoFocus /><div className="recipe-revision-toolbar"><button type="button" className="revision-clear-button" onClick={() => { correctionVoice.stop(); setCorrection(''); }}><X size={19} /></button><button type="button" className={`voice-button ${correctionVoice.isListening ? 'listening' : ''}`} onClick={correctionVoice.toggle} disabled={!correctionVoice.isSupported || correctionVoice.isTranscribing}>{correctionVoice.isListening ? <MicOff size={19} /> : <Mic size={19} />}</button><button type="button" className="revision-confirm-button" onClick={() => void analyse(correction)} disabled={!correction.trim() || correctionVoice.isListening || correctionVoice.isTranscribing}><Check size={20} /></button></div>{correctionVoice.isListening && <div className="voice-status listening"><Mic size={14} /> Escuchando tu corrección…</div>}{correctionVoice.isTranscribing && <div className="voice-status listening"><Sparkles size={14} /> Interpretando…</div>}</div>}
        </section>}

        {proposal && stage === 'ingredients' && <section className="editorial-card photo-identification-card">
          <span className="eyebrow">PASO 2 · CONFIRMA</span>
          <h2>Ingredientes que identifico</h2>
          <p>Desmarca lo que no corresponda y añade cualquier ingrediente importante que falte.</p>
          <div className="photo-ingredient-confirmation">{identifiedIngredients.map(name => { const checked = confirmedIngredients.has(name); return <button type="button" className="photo-ingredient-row" key={name} onClick={() => setConfirmedIngredients(current => { const next = new Set(current); if (next.has(name)) next.delete(name); else next.add(name); return next; })}><strong>{name}</strong><span>{checked ? '✓' : '—'}</span></button>; })}</div>
          <div className="ingredient-input"><input value={extraIngredient} onChange={event => setExtraIngredient(event.target.value)} placeholder="Añadir ingrediente…" onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); addIngredient(); } }} /><button type="button" className="voice-confirm-button" onClick={addIngredient} disabled={!extraIngredient.trim()}><Plus size={18} /></button></div>
          <div className="photo-correction-box">
            <strong>Personalización opcional</strong>
            <textarea value={personalization} onChange={event => setPersonalization(event.target.value)} placeholder="Ej. sin cebolla, añade limón y tomillo, quiero una versión más ligera…" />
            <div className="recipe-revision-toolbar"><button type="button" className="revision-clear-button" onClick={() => { personalizationVoice.stop(); setPersonalization(''); }}><X size={19} /></button><button type="button" className={`voice-button ${personalizationVoice.isListening ? 'listening' : ''}`} onClick={personalizationVoice.toggle} disabled={!personalizationVoice.isSupported || personalizationVoice.isTranscribing}>{personalizationVoice.isListening ? <MicOff size={19} /> : <Mic size={19} />}</button><button type="button" className="revision-confirm-button" disabled={!personalization.trim() || personalizationVoice.isListening || personalizationVoice.isTranscribing}><Check size={20} /></button></div>
            {personalizationVoice.isListening && <div className="voice-status listening"><Mic size={14} /> Escuchando personalización…</div>}{personalizationVoice.isTranscribing && <div className="voice-status listening"><Sparkles size={14} /> Interpretando…</div>}
          </div>
          <div className="control-row"><div className="control-title"><UsersRound size={19} /><div><strong>Comensales</strong><small>Para la receta final</small></div></div><NumberStepper value={servings} onChange={setServings} /></div>
          <PrimaryButton onClick={() => void generateRecipe()} disabled={!confirmedIngredients.size || Boolean(working)}>{working === 'generate' ? 'Generando receta…' : 'Generar receta'}</PrimaryButton>
        </section>}

        {error && <div className="voice-status error">{error}</div>}
      </div>
    </AppShell>
  );
}

const visualIdentificationRecipe: Recipe = {
  id: 'visual-identification', title: 'Identificación visual de un plato', description: 'Analiza exclusivamente lo observable en la fotografía e identifica el tipo de plato, ingredientes aparentes, técnica probable, textura, cocción y presentación.', emoji: '🔎', baseServings: 2, prepMinutes: 0, cookMinutes: 0, difficulty: 'Media', mealType: 'Comida', style: 'Análisis visual', cuisine: 'Por identificar', ingredients: [], miseEnPlace: [], steps: [], criticalPoints: ['Identificar solo lo visualmente razonable'], substitutions: [], storage: '', nutritionPerServing: { kcal: 0, proteinG: 0, carbsG: 0, fatG: 0 }
};

function shortText(value: string) { const clean = value.trim(); return clean.length > 220 ? `${clean.slice(0, 217)}…` : clean; }
function appendSentence(current: string, transcript: string) { const base = current.trimEnd(); const clean = transcript.trim(); return base ? `${base}${/[.!?…]$/.test(base) ? ' ' : '. '}${clean}` : clean; }
