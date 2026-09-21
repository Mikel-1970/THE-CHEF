import { CookingOptions, useCookingOptions, cookingRequestOptions } from '../components/CookingOptions';
import { Check, Mic, MicOff, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext';
import { AppShell } from '../components/AppShell';
import { ChefLoadingOverlay } from '../components/ChefLoadingOverlay';
import { PrimaryButton } from '../components/PrimaryButton';
import { TopBar } from '../components/TopBar';
import type { CookingRequest } from '../domain/types';
import { useAiDictation } from '../hooks/useAiDictation';
import { getHybridProposals } from '../services/hybridRecommendationEngine';
import { interpretDesireText } from '../services/requestInterpreter';
import '../voice-input.css';
import '../visual-controls.css';


export function DesirePage() {
 const navigate=useNavigate(); const {settings,setSearch}=useApp();
 const [text,setText]=useState(''), [confirmed,setConfirmed]=useState(false);
 const options=useCookingOptions(settings);
 const [busy,setBusy]=useState(false), [error,setError]=useState('');
 const ignoreVoice=useRef(false);
 const voice=useAiDictation(value=>{if(ignoreVoice.current){ignoreVoice.current=false;return}setText(value.trim());setConfirmed(false)});
 const search=async()=>{
  if(busy||voice.isListening||voice.isTranscribing||!confirmed||!text.trim())return;
  const parsed=interpretDesireText(text);
  const request:CookingRequest={mode:'desire',desireText:text.trim(),...cookingRequestOptions(options.value),servings:options.touched.has('servings')?options.value.servings:parsed.servings??options.value.servings,maxMinutes:options.touched.has('maxMinutes')?options.value.maxMinutes:parsed.maxMinutes??options.value.maxMinutes,style:options.value.style??parsed.style,cuisine:options.value.cuisine??parsed.cuisine,difficulty:options.value.difficulty??parsed.difficulty,aiPreference:settings.aiPreference,pantryPolicy:'ignore'};
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
   <CookingOptions value={options.value} onChange={options.change}/>
   {error&&<p role="alert" className="voice-status error">{error}</p>}
   <div className="visual-generate"><PrimaryButton onClick={()=>void search()} disabled={!confirmed||busy||voice.isListening||voice.isTranscribing}>{busy?'Preparando…':'Generar propuesta'}</PrimaryButton></div>
  </div>
 </AppShell>
}
