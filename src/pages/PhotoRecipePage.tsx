import { Camera, Clock3, ImagePlus, UsersRound } from 'lucide-react';
import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { ChefLoadingOverlay } from '../components/ChefLoadingOverlay';
import { Chip } from '../components/Chip';
import { NumberStepper } from '../components/NumberStepper';
import { PrimaryButton } from '../components/PrimaryButton';
import { TopBar } from '../components/TopBar';
import { useApp } from '../AppContext';
import type { CookingRequest, Difficulty, Recipe } from '../domain/types';
import { getHybridProposals } from '../services/hybridRecommendationEngine';
import { evaluateDishPhoto } from '../services/mediaGateway';

const difficulties: Difficulty[] = ['Fácil', 'Media', 'Avanzada'];

export function PhotoRecipePage() {
  const navigate = useNavigate();
  const { settings, setSearch } = useApp();
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [selectedFile, setSelectedFile] = useState<File>();
  const [servings, setServings] = useState(2);
  const [maxMinutes, setMaxMinutes] = useState(60);
  const [difficulty, setDifficulty] = useState<Difficulty>('Media');
  const [analysing, setAnalysing] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => () => { if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  const selectPhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError(undefined);
  };

  const analyse = async () => {
    if (!selectedFile || analysing) return;
    setAnalysing(true); setError(undefined);
    try {
      const visual = await evaluateDishPhoto(visualIdentificationRecipe, selectedFile);
      const request: CookingRequest = {
        mode: 'desire',
        servings,
        maxMinutes,
        difficulty,
        pantryBasics: settings.pantryBasics,
        desireText: `Quiero reproducir el plato de una fotografía. Análisis visual: ${visual.evaluation.summary}. Ten en cuenta también estas pistas visuales: ${visual.evaluation.strengths.join('; ')}. Propón recetas plausibles y coherentes con lo que se ve, sin inventar ingredientes exóticos si no son necesarios.`
      };
      const result = await getHybridProposals(request);
      setSearch(request, result.proposals.slice(0, 3));
      navigate('/propuestas');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se ha podido analizar el plato.');
    } finally { setAnalysing(false); }
  };

  return (
    <AppShell>
      <ChefLoadingOverlay active={analysing} title="Analizando el plato" messages={['Reconstruyendo la receta a partir de la foto…']} />
      <TopBar eyebrow="MIRA, CONFIRMA Y COCINA" title="Receta desde una foto" />
      <div className="page-content nav-safe">
        <section className="editorial-card olive-intro"><span className="eyebrow">ENSÉÑAME EL PLATO</span><h2>Descubre cómo prepararlo.</h2><p>Haz una foto o elige una imagen. El Chef analizará el plato y propondrá recetas plausibles para reproducirlo.</p></section>
        <section className="photo-recipe-upload">{previewUrl ? <img src={previewUrl} alt="Plato elegido para identificar" /> : <div><Camera size={44} /><strong>Añade la foto del plato</strong><span>Procura que tenga buena luz y se vea el plato completo.</span></div>}</section>
        <div className="photo-recipe-actions"><label className="photo-recipe-button"><Camera size={20} />Hacer una foto<input type="file" accept="image/*" capture="environment" onChange={selectPhoto} /></label><label className="photo-recipe-button secondary"><ImagePlus size={20} />Elegir de la galería<input type="file" accept="image/*" onChange={selectPhoto} /></label></div>
        {previewUrl && <><section className="control-card"><div className="control-row"><div className="control-title"><UsersRound size={19} /><div><strong>Somos</strong><small>Comensales</small></div></div><NumberStepper value={servings} onChange={setServings} /></div><div className="divider" /><div className="control-row"><div className="control-title"><Clock3 size={19} /><div><strong>Tiempo máximo</strong><small>Para preparar la receta</small></div></div><NumberStepper value={maxMinutes} min={15} max={180} step={5} suffix="min" editable onChange={setMaxMinutes} /></div><div className="divider" /><div className="advanced-group"><strong>Dificultad máxima</strong><div className="chip-row">{difficulties.map(value => <Chip key={value} selected={difficulty === value} onClick={() => setDifficulty(value)}>{value}</Chip>)}</div></div></section><div className="sticky-action"><PrimaryButton onClick={() => void analyse()} disabled={analysing}>{analysing ? 'Analizando el plato…' : 'Analizar el plato'}</PrimaryButton></div>{error && <div className="voice-status error">{error}</div>}</>}
      </div>
    </AppShell>
  );
}

const visualIdentificationRecipe: Recipe = {
  id: 'visual-identification',
  title: 'Plato desconocido: identifica visualmente qué preparación puede ser',
  description: 'Analiza exclusivamente lo observable en la fotografía e identifica el tipo de plato, ingredientes aparentes, técnica probable, textura, cocción y presentación.',
  emoji: '🔎',
  baseServings: 2,
  prepMinutes: 0,
  cookMinutes: 0,
  difficulty: 'Media',
  mealType: 'Comida',
  style: 'Análisis visual',
  cuisine: 'Por identificar',
  ingredients: [],
  miseEnPlace: [],
  steps: [],
  criticalPoints: ['Identificar solo lo visualmente razonable'],
  substitutions: [],
  storage: '',
  nutritionPerServing: { kcal: 0, proteinG: 0, carbsG: 0, fatG: 0 }
};
