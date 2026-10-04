import {CUISINE_REQUIRED,prepareDesireRequest} from '../utils/chefChoice';
import {CuisineSelect} from '../components/CuisineSelect';
import { Check, Mic, MicOff, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext';
import { AppShell } from '../components/AppShell';
import { ChefLoadingOverlay } from '../components/ChefLoadingOverlay';
import { PrimaryButton } from '../components/PrimaryButton';
import { AlmPageHeader } from '../components/AlmPageHeader';
import type { CookingRequest } from '../domain/types';
import { useAiDictation } from '../hooks/useAiDictation';
import { interpretDesireText } from '../services/requestInterpreter';
import '../voice-input.css';
import '../visual-controls.css';


export function DesirePage() {
 const [generationPhase,setGenerationPhase]=useState('Preparando…');
 const navigate=useNavigate(); const {settings}=useApp();
 const [text,setText]=useState(''), [confirmed,setConfirmed]=useState(false);
 const [cuisine,setCuisine]=useState<string>();
 const [needsCuisine,setNeedsCuisine]=useState(false);
 const [busy,setBusy]=useState(false), [error,setError]=useState('');
 const ignoreVoice=useRef(false);
 const voice=useAiDictation(value=>{if(ignoreVoice.current){ignoreVoice.current=false;return}setText(value.trim());setConfirmed(false);setError('');setNeedsCuisine(false);setCuisine(undefined)});
 const search=async()=>{
  if(busy||voice.isListening||voice.isTranscribing||(!confirmed&&Boolean(text.trim())))return;
  const parsed=interpretDesireText(text);
  const request:CookingRequest={mode:'desire',generationMode:'catalog',desireText:text.trim(),servings:parsed.servings??settings.defaultServings,maxMinutes:parsed.maxMinutes,cuisine:parsed.cuisine??cuisine,difficulty:parsed.difficulty,pantryPolicy:'ignore'};
  try{prepareDesireRequest(request)}catch(e){setError(e instanceof Error?e.message:CUISINE_REQUIRED);setNeedsCuisine(true);return;}
  setBusy(true);setError('');
  try{navigate('/mis-recetas',{state:{recipeSearchRequest:request,requestedDish:text.trim()}})}
  catch(e){setError(e instanceof Error?e.message:'No se ha podido preparar la receta.')}
  finally{setBusy(false)}
 };
 return <AppShell><ChefLoadingOverlay progress={generationPhase} active={busy} title="Abriendo Mis recetas" messages={['Buscando opciones parecidas en tu recetario…']}/>
  <AlmPageHeader eyebrow="INSPÍRAME" title="¿Qué quieres cocinar?" subtitle="Cuéntanos qué te apetece y te propondremos recetas de tu recetario." accent="Ideas, ingredientes, inspiración"/>
  <div className="page-content desire-visual">
   <p className="visual-hint">Dinos qué te apetece. Buscaremos opciones parecidas en Mis recetas y podrás pedir una nueva con IA si no encuentras lo que quieres.</p>
   <div className={`visual-request ${confirmed?'confirmed':''}`}>
    <textarea aria-label="Tu petición" rows={4} placeholder="Escribe qué te apetece…" value={text} disabled={voice.isListening||voice.isTranscribing} onChange={e=>{setText(e.target.value);setConfirmed(false);setError('');setNeedsCuisine(false);setCuisine(undefined)}}/>
    <div className="visual-voice-actions">
     <button type="button" aria-label="Borrar petición" onClick={()=>{if(voice.isListening){ignoreVoice.current=true;voice.stop()}setText('');setConfirmed(false)}} disabled={voice.isTranscribing}><X size={20}/></button>
     <button type="button" className={voice.isListening?'recording':''} aria-label={voice.isListening?'Parar micrófono':'Iniciar micrófono'} aria-pressed={voice.isListening} disabled={!voice.isSupported||voice.isTranscribing} onClick={()=>{ignoreVoice.current=false;setConfirmed(false);voice.toggle()}}>{voice.isListening?<MicOff size={22}/>:<Mic size={22}/>}</button>
     <button type="button" className="confirm-request" aria-label="Confirmar petición" aria-pressed={confirmed} disabled={!text.trim()||voice.isListening||voice.isTranscribing} onClick={()=>setConfirmed(true)}><Check size={23}/></button>
    </div>
   </div>
   <div className="visual-status" role="status">{voice.isListening?'Escuchando… pulsa el micrófono para parar.':voice.isTranscribing?'Transcribiendo…':confirmed?'Petición confirmada.':''}</div>
   {voice.error&&<p role="alert" className="voice-status error">{voice.error}</p>}
   {!voice.isSupported&&<p className="voice-status">El dictado no está disponible en este navegador. Puedes escribir.</p>}
   {needsCuisine&&<CuisineSelect value={cuisine} onChange={value=>{setCuisine(value);setError('')}}/>}
   {error&&<p role="alert" className="voice-status error">{error}</p>}
   <div className="visual-generate"><PrimaryButton onClick={()=>void search()} disabled={(!confirmed&&Boolean(text.trim()))||busy||voice.isListening||voice.isTranscribing}>{busy?'Abriendo…':'Buscar receta'}</PrimaryButton></div>
  </div>
 </AppShell>
}
