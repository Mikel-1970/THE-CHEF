import { AlertTriangle, Check, ChevronLeft, ChevronRight, Clock3, Leaf, Mic, MicOff, Play, Save, Sparkles, Trash2, Wrench, X } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { ChefLoadingOverlay } from '../components/ChefLoadingOverlay';
import { PrimaryButton } from '../components/PrimaryButton';
import { TopBar } from '../components/TopBar';
import { useAiDictation } from '../hooks/useAiDictation';
import { getSavedTechniques, removeTechnique, saveTechnique } from '../services/techniqueCatalog';
import { generateTechnique, type Technique } from '../services/techniqueGateway';
import '../techniques.css';
import '../voice-input.css';

const suggestions = ['Aceite de perejil', 'Caviar de tomate', 'Verduras marinadas', 'Cocción a baja temperatura', 'Esferificación básica', 'Fondo oscuro'];
type TechniquePanel = 'ingredients' | 'prep' | 'recommendations' | 'critical' | null;

export function TechniquesPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [draft, setDraft] = useState('');
  const [current, setCurrent] = useState<Technique>();
  const [saved, setSaved] = useState<Technique[]>(() => getSavedTechniques());
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string>();
  const [validated, setValidated] = useState(false);
  const [panel, setPanel] = useState<TechniquePanel>(null);
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
    setIsGenerating(true); setError(undefined);
    try {
      const technique = await generateTechnique(request);
      setCurrent(technique); setSaved(saveTechnique(technique)); setDraft(''); setPanel(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se ha podido generar la técnica.');
    } finally { setIsGenerating(false); }
  };

  const selectTechnique = (technique: Technique) => { setCurrent(technique); setPanel(null); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const startTechnique = (technique: Technique) => { setGuided(technique); setGuidedStep(0); };

  return (
    <AppShell hideBack hideProfile>
      <ChefLoadingOverlay active={isGenerating} title="Preparando la técnica" messages={['Afinando la técnica…']} />
      <TopBar eyebrow="BASE CULINARIA" title="Técnicas" />
      <div className="page-content nav-safe techniques-page">
        <section className="editorial-card olive-intro"><span className="eyebrow">PREGUNTA AL CHEF</span><h2>Preparaciones que podrás reutilizar.</h2><p>Aceites, marinados, confitados, salsas, fondos, esferificaciones y otras técnicas de cocina.</p></section>

        <section className="form-section">
          <div className="section-label"><span>¿Qué quieres aprender o preparar?</span></div>
          <div className="technique-input-box"><textarea rows={4} value={draft} onChange={event => { setDraft(event.target.value); setValidated(false); }} placeholder="Ej. ¿Cómo hago un aceite verde de perejil?" /><div className="voice-action-stack"><button type="button" className="clear-input-button" onClick={() => { voice.stop(); setDraft(''); setValidated(false); }} disabled={!draft.trim() && !voice.isListening} aria-label="Borrar"><X size={18} /></button><button type="button" className={`voice-button ${voice.isListening ? 'listening' : ''}`} onClick={voice.toggle} disabled={!voice.isSupported || voice.isTranscribing || isGenerating} aria-label={voice.isListening ? 'Detener dictado' : 'Dictar técnica'}>{voice.isListening ? <MicOff size={19} /> : <Mic size={19} />}</button><button type="button" className={`voice-confirm-button ${validated ? 'confirmed' : ''}`} onClick={() => setValidated(true)} disabled={!draft.trim() || voice.isListening || voice.isTranscribing || isGenerating} aria-label="Validar técnica"><Check size={19} /></button></div></div>
          {voice.isListening && <div className="voice-status listening"><Mic size={14} /> Escuchando…</div>}{voice.isTranscribing && <div className="voice-status listening"><Sparkles size={14} /> Interpretando el dictado…</div>}{voice.error && <div className="voice-status error">{voice.error}</div>}{validated && <div className="voice-status confirmed"><Check size={14} /> Texto validado.</div>}{error && <div className="voice-status error">{error}</div>}
          <div className="suggestion-row">{suggestions.map(item => <button type="button" key={item} onClick={() => { setDraft(item); setValidated(false); }}>{item}</button>)}</div>
          <div className="technique-generate-action"><PrimaryButton onClick={() => void submit()} disabled={!draft.trim() || voice.isListening || voice.isTranscribing || isGenerating}>{isGenerating ? 'Preparando técnica…' : 'Generar técnica'}</PrimaryButton></div>
        </section>

        {current && <TechniqueCard technique={current} onPanel={setPanel} onStart={() => startTechnique(current)} />}

        <section className="library-section techniques-library"><div className="section-heading-row"><div><span className="eyebrow">TU REPOSITORIO</span><h2>{saved.length ? `${saved.length} técnicas guardadas` : 'Todavía vacío'}</h2></div></div><div className="library-list">{saved.map(technique => <div className="library-card technique-library-card" key={technique.id}><button type="button" className="technique-open" onClick={() => selectTechnique(technique)}><span className="library-emoji">🧪</span><div><strong>{technique.title}</strong><small><Clock3 size={13} /> {technique.timeMinutes} min · {technique.category}</small></div></button><button type="button" className="icon-button" onClick={() => { const next = removeTechnique(technique.id); setSaved(next); if (current?.id === technique.id) setCurrent(undefined); }} aria-label={`Eliminar ${technique.title}`}><Trash2 size={17} /></button></div>)}{!saved.length && <div className="empty-card">Pide al Chef una técnica y se guardará aquí automáticamente.</div>}</div></section>
      </div>

      {current && panel && <TechniqueSheet technique={current} panel={panel} onClose={() => setPanel(null)} />}
      {guided && <TechniqueGuide technique={guided} step={guidedStep} onStep={setGuidedStep} onClose={() => setGuided(undefined)} onFinish={() => { setGuided(undefined); navigate('/'); }} />}
    </AppShell>
  );
}

function TechniqueCard({ technique, onPanel, onStart }: { technique: Technique; onPanel: (panel: TechniquePanel) => void; onStart: () => void }) {
  return <section className="technique-card"><div className="technique-title-row"><div><span className="eyebrow">{technique.category.toUpperCase()}</span><h2>{technique.title}</h2><p>{technique.description}</p></div><Save size={20} /></div><div className="technique-meta"><span><Clock3 size={15} /> {technique.timeMinutes} min</span><span>{technique.difficulty}</span></div><section className="recipe-action-grid" aria-label="Información de la técnica"><button type="button" onClick={() => onPanel('ingredients')}><Sparkles size={22} /><strong>Ingredientes</strong><span>Lo que necesitas</span></button><button type="button" onClick={() => onPanel('prep')}><Wrench size={22} /><strong>Mise en place</strong><span>Utensilios y preparación</span></button><button type="button" onClick={() => onPanel('recommendations')}><Leaf size={22} /><strong>Recomendaciones</strong><span>Uso y conservación</span></button><button type="button" onClick={() => onPanel('critical')}><AlertTriangle size={22} /><strong>Puntos críticos</strong><span>Claves para acertar</span></button></section><PrimaryButton onClick={onStart}><Play size={18} /> Empezar técnica</PrimaryButton></section>;
}

function TechniqueSheet({ technique, panel, onClose }: { technique: Technique; panel: Exclude<TechniquePanel, null>; onClose: () => void }) {
  const config: Record<Exclude<TechniquePanel, null>, { title: string; eyebrow: string; content: ReactNode }> = {
    ingredients: { title: 'Ingredientes', eyebrow: 'LO QUE NECESITAS', content: <div className="technique-ingredients">{technique.ingredients.map((item, index) => <div key={`${item.name}-${index}`}><span>{item.name}{item.optional ? ' · opcional' : ''}</span><strong>{item.quantity !== undefined ? `${formatNumber(item.quantity)} ${item.unit ?? ''}`.trim() : item.unit ?? ''}</strong></div>)}</div> },
    prep: { title: 'Mise en place', eyebrow: 'PREPARACIÓN PREVIA', content: <div className="technique-section"><p>{technique.equipment.length ? technique.equipment.join(' · ') : 'Sin utensilios especiales.'}</p></div> },
    recommendations: { title: 'Recomendaciones', eyebrow: 'USO Y CONSERVACIÓN', content: <div className="technique-section"><p><strong>Conservación:</strong> {technique.storage}</p>{technique.uses.map((item, index) => <p key={`${item}-${index}`}>• {item}</p>)}</div> },
    critical: { title: 'Puntos críticos', eyebrow: 'PARA QUE SALGA BIEN', content: <div className="technique-section">{technique.criticalPoints.map((item, index) => <p key={`${item}-${index}`}>• {item}</p>)}</div> }
  };
  const current = config[panel];
  return <div className="recipe-panel-backdrop" role="presentation" onClick={onClose}><section className="recipe-panel-sheet" role="dialog" aria-modal="true" aria-label={current.title} onClick={event => event.stopPropagation()}><header className="recipe-panel-header"><div><span className="eyebrow">{current.eyebrow}</span><h2>{current.title}</h2></div><button type="button" onClick={onClose} aria-label="Cerrar"><X size={22} /></button></header><div className="recipe-panel-body">{current.content}<div className="recipe-panel-end-spacer" /></div></section></div>;
}

function TechniqueGuide({ technique, step, onStep, onClose, onFinish }: { technique: Technique; step: number; onStep: (value: number) => void; onClose: () => void; onFinish: () => void }) {
  const current = technique.steps[step];
  return <div className="technique-guide" role="dialog" aria-modal="true" aria-label={`Elaboración de ${technique.title}`}><header><button type="button" onClick={onClose} aria-label="Cerrar técnica"><X size={21} /></button><div><span>PASO A PASO</span><strong>{technique.title}</strong></div><span /></header><main><div className="technique-guide-progress"><span style={{ width: `${((step + 1) / technique.steps.length) * 100}%` }} /></div><small>PASO {step + 1} DE {technique.steps.length}</small><div className="technique-guide-number">{String(step + 1).padStart(2, '0')}</div><p>{current.instruction}</p>{(current.minutes || current.temperatureC) && <div className="technique-guide-facts">{current.minutes && <span><Clock3 size={17} /> {current.minutes} min</span>}{current.temperatureC && <span>{current.temperatureC} °C</span>}</div>}{current.cue && <aside><strong>Fíjate en esto</strong>{current.cue}</aside>}</main><footer className="technique-guide-footer-safe"><button type="button" disabled={step === 0} onClick={() => onStep(Math.max(0, step - 1))}><ChevronLeft size={20} /> Anterior</button>{step < technique.steps.length - 1 ? <button type="button" className="primary" onClick={() => onStep(step + 1)}>Siguiente <ChevronRight size={20} /></button> : <button type="button" className="primary" onClick={onFinish}><Check size={20} /> Terminar</button>}</footer></div>;
}

function appendSentence(current: string, transcript: string) { const base = current.trimEnd(); const clean = transcript.trim(); return base ? `${base}${/[.!?…]$/.test(base) ? ' ' : '. '}${clean}` : clean; }
function formatNumber(value: number) { return Number.isInteger(value) ? String(value) : value.toLocaleString('es-ES', { maximumFractionDigits: 1 }); }
