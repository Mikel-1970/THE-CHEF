import { Check, ChevronDown, ChevronUp, Clock3, Mic, MicOff, UsersRound, X, Palette, Globe2, ShieldCheck, Gauge } from 'lucide-react';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext';
import { AppShell } from '../components/AppShell';
import { ChefLoadingOverlay } from '../components/ChefLoadingOverlay';
import { CuisineSelect } from '../components/CuisineSelect';
import { NumberStepper } from '../components/NumberStepper';
import { PrimaryButton } from '../components/PrimaryButton';
import { TopBar } from '../components/TopBar';
import { RECIPE_STYLES } from '../data/cookingOptions';
import type { CookingRequest, Difficulty } from '../domain/types';
import { useAiDictation } from '../hooks/useAiDictation';
import { getHybridProposals } from '../services/hybridRecommendationEngine';
import { interpretDesireText } from '../services/requestInterpreter';
import type { SpiceLevel } from '../services/storage';
import '../voice-input.css';
import '../visual-controls.css';

const exclusions = ['Sin gluten','Sin lácteos','Sin huevo','Sin frutos secos','Sin pescado','Sin marisco','Vegetariana','Vegana'];
export function DesirePage() {
 const navigate=useNavigate(); const {settings,setSearch}=useApp();
 const [text,setText]=useState(''), [confirmed,setConfirmed]=useState(false);
 const [servings,setServings]=useState(settings.defaultServings), [servingsTouched,setServingsTouched]=useState(false);
 const [maxMinutes,setMaxMinutes]=useState(60), [timeTouched,setTimeTouched]=useState(false);
 const [optionsOpen,setOptionsOpen]=useState(false), [style,setStyle]=useState<string>(), [cuisine,setCuisine]=useState<string>();
 const [difficulty,setDifficulty]=useState<Difficulty|undefined>(settings.defaultDifficulty), [spiceLevel,setSpiceLevel]=useState<SpiceLevel>(settings.spiceLevel);
 const [restrictions,setRestrictions]=useState<string[]>([]), [customRestriction,setCustomRestriction]=useState('');
 const [busy,setBusy]=useState(false), [error,setError]=useState('');
 const ignoreVoice=useRef(false);
 const voice=useAiDictation(value=>{if(ignoreVoice.current){ignoreVoice.current=false;return}setText(value.trim());setConfirmed(false)});
 const search=async()=>{
  if(busy||voice.isListening||voice.isTranscribing||!confirmed||!text.trim())return;
  const parsed=interpretDesireText(text);
  const request:CookingRequest={mode:'desire',desireText:text.trim(),servings:servingsTouched?servings:parsed.servings??servings,maxMinutes:timeTouched?maxMinutes:parsed.maxMinutes??maxMinutes,style:style??parsed.style,cuisine:cuisine??parsed.cuisine,difficulty:difficulty??parsed.difficulty,spiceLevel,restrictions:[...restrictions,...customRestriction.split(/[,;]+/).map(x=>x.trim()).filter(Boolean)],aiPreference:settings.aiPreference,pantryPolicy:'ignore'};
  setBusy(true);setError('');
  try{const result=await getHybridProposals(request);setSearch(request,result.proposals.slice(0,1));navigate('/propuestas')}
  catch(e){setError(e instanceof Error?e.message:'No se ha podido preparar la propuesta.')}
  finally{setBusy(false)}
 };
 return <AppShell><ChefLoadingOverlay active={busy} title="Preparando tu propuesta" messages={['Buscando el plato que mejor encaja…']}/>
  <TopBar title="¿Qué quieres que te prepare?"/>
  <div className="page-content desire-visual">
   <p className="visual-hint">Con una frase basta.</p>
   <div className={`visual-request ${confirmed?'confirmed':''}`}>
    <textarea aria-label="Tu petición" rows={4} placeholder="Escribe qué te apetece…" value={text} disabled={voice.isListening||voice.isTranscribing} onChange={e=>{setText(e.target.value);setConfirmed(false)}}/>
    <div className="visual-voice-actions">
     <button type="button" aria-label="Borrar petición" onClick={()=>{if(voice.isListening){ignoreVoice.current=true;voice.stop()}setText('');setConfirmed(false)}} disabled={voice.isTranscribing}><X size={20}/></button>
     <button type="button" className={voice.isListening?'recording':''} aria-label={voice.isListening?'Parar micrófono':'Iniciar micrófono'} aria-pressed={voice.isListening} disabled={!voice.isSupported||voice.isTranscribing} onClick={()=>{ignoreVoice.current=false;setConfirmed(false);voice.toggle()}}>{voice.isListening?<MicOff size={22}/>:<Mic size={22}/>}</button>
     <button type="button" className="confirm-request" aria-label="Confirmar petición" aria-pressed={confirmed} disabled={!text.trim()||voice.isListening||voice.isTranscribing} onClick={()=>setConfirmed(true)}><Check size={23}/></button>
    </div>
   </div>
   <div className="visual-status" role="status">{voice.isListening?'Escuchando… pulsa el micrófono para parar.':voice.isTranscribing?'Transcribiendo…':confirmed?'Petición confirmada.':''}</div>
   {voice.error&&<p role="alert" className="voice-status error">{voice.error}</p>}
   {!voice.isSupported&&<p className="voice-status">El dictado no está disponible en este navegador. Puedes escribir.</p>}
   <button type="button" className="advanced-toggle" aria-expanded={optionsOpen} onClick={()=>setOptionsOpen(v=>!v)}><span>Personalizar</span>{optionsOpen?<ChevronUp size={20}/>:<ChevronDown size={20}/>}</button>
   {optionsOpen&&<section className="visual-options" aria-label="Personalizar receta">
    <div className="visual-option"><div className="visual-option-title"><UsersRound/><strong>Comensales</strong></div><NumberStepper value={servings} onChange={v=>{setServingsTouched(true);setServings(v)}}/></div>
    <div className="visual-option"><div className="visual-option-title"><Clock3/><strong>Tiempo máximo</strong></div><NumberStepper value={maxMinutes} min={15} max={120} step={5} suffix="min" editable onChange={v=>{setTimeTouched(true);setMaxMinutes(v)}}/></div>
    <label className="visual-option"><span className="visual-option-title"><Palette/><strong>Estilo</strong></span><select aria-label="Estilo" value={style??''} onChange={e=>setStyle(e.target.value||undefined)}><option value="">Indiferente</option>{RECIPE_STYLES.filter(v=>v!=='Indiferente').map(v=><option key={v}>{v}</option>)}</select></label>
    <div className="visual-option"><div className="visual-option-title"><Globe2/><strong>Tipo de cocina</strong></div><CuisineSelect value={cuisine} onChange={setCuisine}/></div>
    <div className="visual-option"><div className="visual-option-title"><ShieldCheck/><strong>Restricciones / exclusiones</strong></div><details className="visual-multiselect"><summary><span>{[...restrictions,...(customRestriction?['Otra exclusión']:[])].join(' · ')||'Seleccionar'}</span><ChevronDown/></summary><div>{exclusions.map(value=><label key={value}><input type="checkbox" checked={restrictions.includes(value)} onChange={e=>setRestrictions(current=>e.target.checked?[...current,value]:current.filter(v=>v!==value))}/>{value}</label>)}<label className="custom-exclusion">Otra exclusión<input aria-label="Otra exclusión" value={customRestriction} onChange={e=>setCustomRestriction(e.target.value)} placeholder="Ej. cebolla, ajo…"/></label></div></details></div>
    <label className="visual-option"><span className="visual-option-title"><Gauge/><strong>Dificultad máxima</strong></span><select aria-label="Dificultad máxima" value={difficulty??''} onChange={e=>setDifficulty(e.target.value as Difficulty||undefined)}><option value="">Indiferente</option>{['Fácil','Media','Avanzada'].map(v=><option key={v}>{v}</option>)}</select></label>
    <label className="visual-option"><span className="visual-option-title"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17 7c1-3 0-5-2-5M15 7c-3 0-5 3-6 6s-3 5-6 7c7 1 15-3 16-9 0-2-2-4-4-4Z"/><path d="m12 9 3 1 3-1"/></svg><strong>Picante</strong></span><select aria-label="Picante" value={spiceLevel} onChange={e=>setSpiceLevel(e.target.value as SpiceLevel)}>{['Nada','Suave','Medio','Alto'].map(v=><option key={v}>{v}</option>)}</select></label>
   </section>}
   {error&&<p role="alert" className="voice-status error">{error}</p>}
   <div className="visual-generate"><PrimaryButton onClick={()=>void search()} disabled={!confirmed||busy||voice.isListening||voice.isTranscribing}>{busy?'Preparando…':'Generar propuesta'}</PrimaryButton></div>
  </div>
 </AppShell>
}
