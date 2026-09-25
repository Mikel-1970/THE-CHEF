import { AlertTriangle, Check, ChevronLeft, ChevronRight, Clock3, Home, Leaf, Mic, MicOff, Play, Save, Sparkles, Trash2, Wrench, X } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { ChefLoadingOverlay } from '../components/ChefLoadingOverlay';
import { TechniqueThumbnail } from '../components/TechniqueThumbnail';
import { PrimaryButton } from '../components/PrimaryButton';
import { TopBar } from '../components/TopBar';
import { useAiDictation } from '../hooks/useAiDictation';
import { getTechniqueLibrary, removeTechnique, saveTechnique } from '../services/techniqueCatalog';
import { generateTechnique, type Technique } from '../services/techniqueGateway';
import '../techniques.css';
import '../voice-input.css';

const suggestions = ['Aceite de perejil', 'Caviar de tomate', 'Verduras marinadas', 'Cocción a baja temperatura', 'Esferificación básica', 'Fondo oscuro'];
type TechniquePanel = 'ingredients' | 'prep' | 'recommendations' | 'critical' | null;

export function TechniquesPage() {
  const [params,setParams] = useSearchParams();
  const location=useLocation(),navigate=useNavigate();
  const filter=params.get('q')||'',category=params.get('category')||'Todas',level=params.get('level')||'Todos';
  const updateFilter=(key:string,value:string)=>{const next=new URLSearchParams(params);next.set(key,value);setParams(next,{replace:true,state:location.state});};
  const setFilter=(value:string)=>updateFilter('q',value),setCategory=(value:string)=>updateFilter('category',value),setLevel=(value:string)=>updateFilter('level',value);
  const [draft, setDraft] = useState('');
  const [current, setCurrent] = useState<Technique>();
  const [saved, setSaved] = useState<Technique[]>(() => getTechniqueLibrary());
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string>();
  const [validated, setValidated] = useState(false);
  const [panel, setPanel] = useState<TechniquePanel>(null);
  const [guided, setGuided] = useState<Technique>();
  const [guidedStep, setGuidedStep] = useState(0);
  const [completedTechnique, setCompletedTechnique] = useState<string>();
  const voice = useAiDictation(transcript => { setDraft(existing => appendSentence(existing, transcript)); setValidated(false); });

  useEffect(() => {
    const openId = params.get('open');
    if (!openId) {setCurrent(undefined);return;}
    const technique = getTechniqueLibrary().find(item => item.id === openId);
    setCurrent(technique);
  }, [params]);

  const submit = async () => {
    const request = draft.trim();
    if (!request || isGenerating || voice.isListening || voice.isTranscribing) return;
    setIsGenerating(true); setError(undefined); setCompletedTechnique(undefined);
    try {
      const technique = await generateTechnique(request);
      saveTechnique(technique); setSaved(getTechniqueLibrary()); selectTechnique(technique); setDraft(''); setPanel(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se ha podido generar la técnica.');
    } finally { setIsGenerating(false); }
  };

  const selectTechnique = (technique: Technique) => { const next=new URLSearchParams(params);next.set('open',technique.id);setParams(next,{state:location.state});setCurrent(technique); setPanel(null); setCompletedTechnique(undefined); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const closeCard=()=>{const next=new URLSearchParams(params);next.delete('open');setParams(next,{replace:true});setCurrent(undefined);setPanel(null);};
  const returnTo=typeof location.state?.returnTo==='string'&&/^\/(receta|cocinar)\//.test(location.state.returnTo)?location.state.returnTo:undefined;
  const back=()=>{if(guided){setGuided(undefined);return;}if(panel){setPanel(null);return;}if(current){if(returnTo)navigate(returnTo,{replace:true});else closeCard();return;}navigate('/');};
  const startTechnique = (technique: Technique) => { setCompletedTechnique(undefined); setGuided(technique); setGuidedStep(0); };
  const finishTechnique = (technique: Technique) => { setGuided(undefined); setGuidedStep(0); setCurrent(technique); setCompletedTechnique(technique.id); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const visibleTechniques=saved.filter(t=>
    (category==='Todas'||t.category===category)&&
    (level==='Todos'||t.difficulty===level)&&
    [t.title,t.category,...t.uses,...(t.aliases||[]),...(t.keywords||[])].join(' ').toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'').includes(filter.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,''))
  );

  return (
    <AppShell onBack={back}>
      <ChefLoadingOverlay active={isGenerating} title="Preparando la técnica" messages={['Afinando la técnica…']} />
      <TopBar eyebrow="BASE CULINARIA" title="Técnicas" />
      <div className="page-content nav-safe techniques-page">
        <nav className="culinary-tabs" aria-label="Técnicas y tips"><Link aria-current="page" className="active" replace to="/tecnicas">Técnicas</Link><Link replace to="/consejos">Tips</Link></nav>
        {!current&&<section className="editorial-card olive-intro"><span className="eyebrow">BIBLIOTECA DE TÉCNICAS</span><h2>{saved.length} técnicas para cocinar y aprender.</h2><p>Preparación, cortes, cocciones, salsas, panadería, pastelería y alta cocina. La misma ficha se reutiliza en recetas y en Elaboración.</p></section>}

        {current && completedTechnique === current.id && <section className="editorial-card technique-completed-card"><Check size={26} /><div><span className="eyebrow">TÉCNICA TERMINADA</span><h2>{current.title}</h2><p>Has completado todos los pasos. Puedes consultar de nuevo la ficha, repetir la técnica o seguir navegando desde el menú del avatar.</p></div></section>}

        {!current&&<details><summary>Consultar al Chef una técnica adicional</summary><section className="form-section">
          <div className="section-label"><span>¿Qué quieres aprender o preparar?</span></div>
          <div className="technique-input-box"><textarea rows={4} value={draft} onChange={event => { setDraft(event.target.value); setValidated(false); }} placeholder="Ej. ¿Cómo hago un aceite verde de perejil?" /><div className="voice-action-stack"><button type="button" className="clear-input-button" onClick={() => { voice.stop(); setDraft(''); setValidated(false); }} disabled={!draft.trim() && !voice.isListening} aria-label="Borrar"><X size={18} /></button><button type="button" className={`voice-button ${voice.isListening ? 'listening' : ''}`} onClick={voice.toggle} disabled={!voice.isSupported || voice.isTranscribing || isGenerating} aria-label={voice.isListening ? 'Detener dictado' : 'Dictar técnica'}>{voice.isListening ? <MicOff size={19} /> : <Mic size={19} />}</button><button type="button" className={`voice-confirm-button ${validated ? 'confirmed' : ''}`} onClick={() => setValidated(true)} disabled={!draft.trim() || voice.isListening || voice.isTranscribing || isGenerating} aria-label="Validar técnica"><Check size={19} /></button></div></div>
          {voice.isListening && <div className="voice-status listening"><Mic size={14} /> Escuchando…</div>}{voice.isTranscribing && <div className="voice-status listening"><Sparkles size={14} /> Interpretando el dictado…</div>}{voice.error && <div className="voice-status error">{voice.error}</div>}{validated && <div className="voice-status confirmed"><Check size={14} /> Texto validado.</div>}{error && <div className="voice-status error">{error}</div>}
          <div className="suggestion-row">{suggestions.map(item => <button type="button" key={item} onClick={() => { setDraft(item); setValidated(false); }}>{item}</button>)}</div>
          <div className="technique-generate-action"><PrimaryButton onClick={() => void submit()} disabled={!draft.trim() || voice.isListening || voice.isTranscribing || isGenerating}>{isGenerating ? 'Preparando técnica…' : 'Generar técnica'}</PrimaryButton></div>
        </section>

        </details>}{current && <div className="technique-return-actions"><button className="secondary-button" onClick={back}>{returnTo?.startsWith('/cocinar/')?'Volver a elaboración':returnTo?'Volver a la receta':'Volver a la biblioteca'}</button>{returnTo&&<button className="secondary-button" onClick={closeCard}>Ver biblioteca</button>}</div>}{current && <TechniqueCard technique={current} onPanel={setPanel} onStart={() => startTechnique(current)} />}

        {!current&&<section className="library-section techniques-library">
          <div className="section-heading-row"><div><span className="eyebrow">BIBLIOTECA MAESTRA</span><h2>{saved.length ? `${saved.length} técnicas disponibles` : 'Todavía vacío'}</h2></div></div>
          <input aria-label="Buscar técnica o uso" placeholder="Buscar técnica, alias o uso: saltear, wok, salsas…" value={filter} onChange={e=>setFilter(e.target.value)}/>
          <div className="technique-filter-row">
            <select aria-label="Categoría de técnica" value={category} onChange={e=>setCategory(e.target.value)}><option>Todas</option>{Array.from(new Set(saved.map(t=>t.category))).map(name=><option key={name}>{name}</option>)}</select>
            <select aria-label="Nivel de técnica" value={level} onChange={e=>setLevel(e.target.value)}><option>Todos</option><option>Fácil</option><option>Media</option><option>Avanzada</option></select>
          </div>
          <div className="technique-photo-grid">
            {visibleTechniques.map(technique=><article className="technique-photo-card" key={technique.id}>
              <button type="button" className="technique-photo-open" onClick={()=>selectTechnique(technique)} aria-label={`Abrir técnica ${technique.title}`}>
                <TechniqueThumbnail technique={technique}/>
                <div className="technique-photo-caption">
                  <span>{technique.category}</span>
                  <strong>{technique.title}</strong>
                  <small>{technique.difficulty} · {technique.timeLabel??`${technique.timeMinutes} min`}</small>
                </div>
              </button>
              {!technique.builtin&&<button type="button" className="technique-photo-delete" onClick={()=>{removeTechnique(technique.id);setSaved(getTechniqueLibrary())}} aria-label={`Eliminar ${technique.title}`}><Trash2 size={17}/></button>}
            </article>)}
            {!visibleTechniques.length&&<div className="empty-card technique-empty">No hay técnicas que coincidan con estos filtros.</div>}
          </div>
        </section>}
      </div>

      {current && panel && <TechniqueSheet technique={current} panel={panel} onClose={() => setPanel(null)} />}
      {guided && <TechniqueGuide technique={guided} step={guidedStep} onStep={setGuidedStep} onClose={() => setGuided(undefined)} onFinish={() => finishTechnique(guided)} />}
    </AppShell>
  );
}

function TechniqueCard({ technique, onPanel, onStart }: { technique: Technique; onPanel: (panel: TechniquePanel) => void; onStart: () => void }) {
  return <section className="technique-card"><div className="technique-detail-photo"><TechniqueThumbnail technique={technique} eager/></div><div className="technique-title-row"><div><span className="eyebrow">{technique.category.toUpperCase()}</span><h2>{technique.title}</h2><p>{technique.description}</p></div><Save size={20} /></div><div className="technique-meta"><span><Clock3 size={15} /> {technique.timeLabel??`${technique.timeMinutes} min`}</span><span>{technique.difficulty}</span>{technique.timerRecommended&&<span>Temporizador opcional</span>}{technique.requiresValidatedRecipe&&<span>Parámetros de receta</span>}</div>{technique.chefTip&&<aside className="technique-chef-tip"><strong>Tip Chef</strong><span>{technique.chefTip}</span></aside>}<section className="recipe-action-grid" aria-label="Información de la técnica"><button type="button" onClick={() => onPanel('ingredients')}><Sparkles size={22} /><strong>Qué necesitas</strong><span>Producto y material</span></button><button type="button" onClick={() => onPanel('prep')}><Wrench size={22} /><strong>Mise en place</strong><span>Utensilios y preparación</span></button><button type="button" onClick={() => onPanel('recommendations')}><Leaf size={22} /><strong>Recomendaciones</strong><span>Uso y conservación</span></button><button type="button" onClick={() => onPanel('critical')}><AlertTriangle size={22} /><strong>Puntos críticos</strong><span>Claves para acertar</span></button></section>{technique.temperatureGuide&&<section className="temperature-guide"><h3>Tiempo y temperatura</h3><p>{technique.temperatureGuide.conditions}</p><table><thead><tr><th>Producto</th><th>Baño</th><th>Tiempo</th></tr></thead><tbody>{technique.temperatureGuide.rows.map(row=><tr key={row.product}><td>{row.product}</td><td>{row.temperatureC} °C</td><td>{row.minutes} min</td></tr>)}</tbody></table></section>}{technique.sources&&<div className="technique-sources">{technique.sources.map(s=><p key={s.url}><a href={s.url} target="_blank" rel="noreferrer">{s.label}</a></p>)}</div>}<PrimaryButton onClick={onStart}><Play size={18} /> Empezar técnica</PrimaryButton></section>;
}

function TechniqueSheet({ technique, panel, onClose }: { technique: Technique; panel: Exclude<TechniquePanel, null>; onClose: () => void }) {
  const prepItems = technique.miseEnPlace?.length ? technique.miseEnPlace : (technique.equipment.length ? ['Prepara: ' + technique.equipment.join(' · ') + '.'] : ['Organiza el puesto de trabajo antes de empezar.']);
  const ingredientContent = <><div className="panel-intro"><p>En una técnica las cantidades dependen de la receta concreta. Aquí se muestra la base de trabajo necesaria para aplicar el método.</p></div><div className="ingredient-section"><h3>Base de trabajo</h3>{technique.ingredients.map((item,index)=><div className="recipe-ingredient" key={item.name+'-'+index}><div className="recipe-ingredient-main"><span>{item.name}{item.optional?<small className="ingredient-optional"> Opcional</small>:null}</span></div>{item.quantity!==undefined&&<strong>{formatNumber(item.quantity)} {item.unit??''}</strong>}</div>)}</div></>;
  const prepContent = <ol className="expanded-list">{prepItems.map((item,index)=><li key={item+'-'+index}><strong>{index+1}.</strong> {item}</li>)}</ol>;
  const recommendations = [
    technique.whenToUse ? 'Cuándo usarla: ' + technique.whenToUse : '',
    technique.whenNotToUse ? 'Cuándo no usarla: ' + technique.whenNotToUse : '',
    technique.storage ? 'Seguridad / conservación: ' + technique.storage : '',
    ...(technique.uses || [])
  ].filter(Boolean);
  const recommendationContent = <div className="panel-advice">{recommendations.map((item,index)=><p key={item+'-'+index}><Leaf size={17}/><span>{item}</span></p>)}</div>;
  const criticalContent = <div className="technique-critical-groups">
    <div className="panel-advice warning">{technique.criticalPoints.map((item,index)=><p key={'critical-'+index}><AlertTriangle size={17}/><span>{item}</span></p>)}</div>
    {!!technique.successSignals?.length&&<section><h3>Señales de éxito</h3><ol className="expanded-list">{technique.successSignals.map((item,index)=><li key={'success-'+index}><strong>✓</strong> {item}</li>)}</ol></section>}
    {!!technique.frequentErrors?.length&&<section><h3>Errores frecuentes</h3><ol className="expanded-list">{technique.frequentErrors.map((item,index)=><li key={'error-'+index}><strong>•</strong> {item}</li>)}</ol></section>}
    {!!technique.corrections?.length&&<section><h3>Cómo corregir</h3><ol className="expanded-list">{technique.corrections.map((item,index)=><li key={'fix-'+index}><strong>{index+1}.</strong> {item}</li>)}</ol></section>}
    {technique.requiresValidatedRecipe&&<div className="panel-intro"><p><strong>Control obligatorio:</strong> tiempo, temperatura, concentración o conservación deben venir de la receta o procedimiento concreto.</p></div>}
  </div>;
  const config: Record<Exclude<TechniquePanel, null>, { title: string; eyebrow: string; content: ReactNode }> = {
    ingredients: { title: 'Qué necesitas', eyebrow: 'BASE DE TRABAJO', content: ingredientContent },
    prep: { title: 'Mise en place', eyebrow: 'PREPARACIÓN PREVIA', content: prepContent },
    recommendations: { title: 'Recomendaciones', eyebrow: 'USO Y CONSERVACIÓN', content: recommendationContent },
    critical: { title: 'Puntos críticos', eyebrow: 'PARA QUE SALGA BIEN', content: criticalContent }
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
