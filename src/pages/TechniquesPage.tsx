import { Check, ChevronLeft, ChevronRight, Clock3, Flame, Mic, MicOff, Play, Save, Sparkles, Trash2, Wrench, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { ChefLoadingOverlay } from '../components/ChefLoadingOverlay';
import { PrimaryButton } from '../components/PrimaryButton';
import { TopBar } from '../components/TopBar';
import { useAiDictation } from '../hooks/useAiDictation';
import { getSavedTechniques, removeTechnique, saveTechnique } from '../services/techniqueCatalog';
import { generateTechnique, type Technique } from '../services/techniqueGateway';
import '../techniques.css';
import '../voice-input.css';

const suggestions = [
  'Aceite de perejil',
  'Caviar de tomate',
  'Verduras marinadas',
  'Cocción a baja temperatura',
  'Esferificación básica',
  'Fondo oscuro'
];

export function TechniquesPage() {
  const [params] = useSearchParams();
  const [draft, setDraft] = useState('');
  const [current, setCurrent] = useState<Technique>();
  const [saved, setSaved] = useState<Technique[]>(() => getSavedTechniques());
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string>();
  const [validated, setValidated] = useState(false);
  const [guided, setGuided] = useState<Technique>();
  const [guidedStep, setGuidedStep] = useState(0);
  const voice = useAiDictation(transcript => { setDraft(existing => appendSentence(existing, transcript)); setValidated(false); });

  useEffect(() => {
    const openId = params.get('open');
    if (!openId) return;
    const technique = getSavedTechniques().find(item => item.id === openId);
    if (technique) setCurrent(technique);
  }, [params]);

  const submit = async () => {
    const request = draft.trim();
    if (!request || isGenerating || voice.isListening || voice.isTranscribing) return;
    setIsGenerating(true);
    setError(undefined);
    try {
      const technique = await generateTechnique(request);
      setCurrent(technique);
      setSaved(saveTechnique(technique));
      setDraft('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se ha podido generar la técnica.');
    } finally {
      setIsGenerating(false);
    }
  };

  const selectTechnique = (technique: Technique) => {
    setCurrent(technique);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startTechnique = (technique: Technique) => { setGuided(technique); setGuidedStep(0); };

  return (
    <AppShell>
      <ChefLoadingOverlay active={isGenerating} title="Preparando la técnica" messages={['¡Oído cocina!', 'Afinando la técnica…', 'Calculando tiempos y puntos…', 'Preparando una ficha reutilizable…']} />
      <TopBar eyebrow="BASE CULINARIA" title="Técnicas" />
      <div className="page-content nav-safe techniques-page">
        <section className="editorial-card olive-intro">
          <span className="eyebrow">PREGUNTA AL CHEF</span>
          <h2>Preparaciones que podrás reutilizar.</h2>
          <p>Aceites, marinados, confitados, salsas, fondos, esferificaciones, cocciones a baja temperatura y otras elaboraciones intermedias.</p>
        </section>

        <section className="form-section">
          <div className="section-label"><span>¿Qué quieres aprender o preparar?</span></div>
          <div className="technique-input-box">
            <textarea rows={4} value={draft} onChange={event => { setDraft(event.target.value); setValidated(false); }} placeholder="Ej. ¿Cómo hago un aceite verde de perejil que pueda guardar y usar en otras recetas?" />
            <div className="voice-action-stack">
              <button type="button" className="clear-input-button" onClick={() => { voice.stop(); setDraft(''); setValidated(false); }} disabled={!draft.trim() && !voice.isListening} aria-label="Borrar"><X size={18} /></button>
              <button type="button" className={`voice-button ${voice.isListening ? 'listening' : ''}`} onClick={voice.toggle} disabled={!voice.isSupported || voice.isTranscribing || isGenerating} aria-label={voice.isListening ? 'Detener dictado' : 'Dictar técnica'}>{voice.isListening ? <MicOff size={19} /> : <Mic size={19} />}</button>
              <button type="button" className={`voice-confirm-button ${validated ? 'confirmed' : ''}`} onClick={() => setValidated(true)} disabled={!draft.trim() || voice.isListening || voice.isTranscribing || isGenerating} aria-label="Validar técnica"><Check size={19} /></button>
            </div>
          </div>
          {voice.isListening && <div className="voice-status listening"><Mic size={14} /> Escuchando… toca de nuevo cuando termines.</div>}
          {voice.isTranscribing && <div className="voice-status listening"><Sparkles size={14} /> Interpretando el dictado…</div>}
          {voice.error && <div className="voice-status error">{voice.error}</div>}
          {validated && <div className="voice-status confirmed"><Check size={14} /> Texto validado. Puedes generar la técnica cuando quieras.</div>}
          {error && <div className="voice-status error">{error}</div>}
          <div className="suggestion-row">{suggestions.map(item => <button type="button" key={item} onClick={() => { setDraft(item); setValidated(false); }}>{item}</button>)}</div>
          <div className="technique-generate-action"><PrimaryButton onClick={() => void submit()} disabled={!draft.trim() || voice.isListening || voice.isTranscribing || isGenerating}>{isGenerating ? 'Preparando técnica…' : 'Generar técnica'}</PrimaryButton></div>
        </section>

        {current && <TechniqueCard technique={current} saved onStart={() => startTechnique(current)} />}

        <section className="library-section techniques-library">
          <div className="section-heading-row"><div><span className="eyebrow">TU REPOSITORIO</span><h2>{saved.length ? `${saved.length} técnicas guardadas` : 'Todavía vacío'}</h2></div></div>
          <div className="library-list">
            {saved.map(technique => (
              <div className="library-card technique-library-card" key={technique.id}>
                <button type="button" className="technique-open" onClick={() => selectTechnique(technique)}>
                  <span className="library-emoji">🧪</span>
                  <div><strong>{technique.title}</strong><small><Clock3 size={13} /> {technique.timeMinutes} min · {technique.category} · {technique.difficulty}</small></div>
                </button>
                <button type="button" className="icon-button" onClick={() => { const next = removeTechnique(technique.id); setSaved(next); if (current?.id === technique.id) setCurrent(undefined); }} aria-label={`Eliminar ${technique.title}`}><Trash2 size={17} /></button>
              </div>
            ))}
            {!saved.length && <div className="empty-card">Pide al Chef una técnica y se guardará aquí automáticamente para reutilizarla.</div>}
          </div>
        </section>
      </div>
      {guided && <TechniqueGuide technique={guided} step={guidedStep} onStep={setGuidedStep} onClose={() => setGuided(undefined)} />}
    </AppShell>
  );
}

function TechniqueCard({ technique, saved, onStart }: { technique: Technique; saved?: boolean; onStart?: () => void }) {
  return (
    <section className="technique-card">
      <div className="technique-title-row"><div><span className="eyebrow">{technique.category.toUpperCase()}</span><h2>{technique.title}</h2><p>{technique.description}</p></div>{saved && <Save size={20} />}</div>
      <div className="technique-meta"><span><Clock3 size={15} /> {technique.timeMinutes} min</span><span><Flame size={15} /> {technique.difficulty}</span></div>
      {!!technique.equipment.length && <div className="technique-section"><h3><Wrench size={17} /> Utensilios</h3><p>{technique.equipment.join(' · ')}</p></div>}
      {!!technique.ingredients.length && <div className="technique-section"><h3>Ingredientes</h3><div className="technique-ingredients">{technique.ingredients.map((item, index) => <div key={`${item.name}-${index}`}><span>{item.name}{item.optional ? ' · opcional' : ''}</span><strong>{item.quantity !== undefined ? `${formatNumber(item.quantity)} ${item.unit ?? ''}`.trim() : item.unit ?? ''}</strong></div>)}</div></div>}
      <div className="technique-section"><h3>Elaboración</h3><ol className="expanded-list">{technique.steps.map(step => <li key={step.number}><strong>{step.number}.</strong> {step.instruction}{step.minutes ? ` · ${step.minutes} min` : ''}{step.temperatureC !== undefined ? ` · ${step.temperatureC} °C` : ''}{step.cue ? <small>{step.cue}</small> : null}</li>)}</ol></div>
      {!!technique.criticalPoints.length && <div className="technique-section"><h3>Puntos críticos</h3>{technique.criticalPoints.map((point, index) => <p key={`${point}-${index}`}>• {point}</p>)}</div>}
      <div className="technique-section"><h3>Conservación</h3><p>{technique.storage}</p></div>
      {!!technique.uses.length && <div className="technique-section"><h3>Cómo reutilizarla</h3><p>{technique.uses.join(' · ')}</p></div>}
      {onStart && <PrimaryButton onClick={onStart}><Play size={18} /> Empezar técnica</PrimaryButton>}
    </section>
  );
}

function TechniqueGuide({ technique, step, onStep, onClose }: { technique: Technique; step: number; onStep: (value: number) => void; onClose: () => void }) {
  const current = technique.steps[step];
  return <div className="technique-guide" role="dialog" aria-modal="true" aria-label={`Elaboración de ${technique.title}`}><header><button type="button" onClick={onClose} aria-label="Cerrar técnica"><X size={21} /></button><div><span>PASO A PASO</span><strong>{technique.title}</strong></div><span /></header><main><div className="technique-guide-progress"><span style={{ width: `${((step + 1) / technique.steps.length) * 100}%` }} /></div><small>PASO {step + 1} DE {technique.steps.length}</small><div className="technique-guide-number">{String(step + 1).padStart(2, '0')}</div><p>{current.instruction}</p>{(current.minutes || current.temperatureC) && <div className="technique-guide-facts">{current.minutes && <span><Clock3 size={17} /> {current.minutes} min</span>}{current.temperatureC && <span><Flame size={17} /> {current.temperatureC} °C</span>}</div>}{current.cue && <aside><strong>Fíjate en esto</strong>{current.cue}</aside>}</main><footer><button type="button" disabled={step === 0} onClick={() => onStep(Math.max(0, step - 1))}><ChevronLeft size={20} /> Anterior</button>{step < technique.steps.length - 1 ? <button type="button" className="primary" onClick={() => onStep(step + 1)}>Siguiente <ChevronRight size={20} /></button> : <button type="button" className="primary" onClick={onClose}><Check size={20} /> Terminar</button>}</footer></div>;
}

function appendSentence(current: string, transcript: string) {
  const base = current.trimEnd();
  const clean = transcript.trim();
  return base ? `${base}${/[.!?…]$/.test(base) ? ' ' : '. '}${clean}` : clean;
}

function formatNumber(value: number) {
  return Number.isInteger(value) ? String(value) : value.toLocaleString('es-ES', { maximumFractionDigits: 1 });
}
