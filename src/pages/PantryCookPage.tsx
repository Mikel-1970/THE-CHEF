import { Camera, Check, ImagePlus, Mic, MicOff, PackageOpen, Refrigerator, Star, X } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext';
import { AppShell } from '../components/AppShell';
import { ChefLoadingOverlay } from '../components/ChefLoadingOverlay';
import { cookingRequestOptions, useCookingOptions } from '../components/CookingOptions';
import { PrimaryButton } from '../components/PrimaryButton';
import { TopBar } from '../components/TopBar';
import type { CookingRequest, IngredientInput, StockLocation } from '../domain/types';
import { useAiDictation } from '../hooks/useAiDictation';
import { getHybridProposals } from '../services/hybridRecommendationEngine';
import { identifyPantryPhoto } from '../services/pantryPhotoGateway';
import { parseIngredientInput } from '../utils/ingredientInput';
import { inferStockLocation } from '../utils/stockLocation';
import '../voice-input.css';
import '../pantry-cook.css';
const normalize=(s:string)=>s.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
const locationOf=(item:IngredientInput)=>item.location==='fridge'?'fridge':'pantry';

export function PantryCookPage() {
 const navigate=useNavigate();const {settings,currentRequest,updateSettings,setSearch}=useApp();
 const previous=currentRequest?.mode==='pantry'?currentRequest:undefined;
 const options=useCookingOptions(settings,previous);
 const pantry=settings.pantryStock??[];
 const [selected,setSelected]=useState<Set<string>>(()=>new Set((previous?.pantryIngredients??[]).filter(i=>i.priority).map(i=>normalize(i.name))));
 const [source,setSource]=useState<'all'|StockLocation>('all');
 const [draft,setDraft]=useState('');const [photo,setPhoto]=useState<string>();
 const [candidates,setCandidates]=useState<{name:string;checked:boolean}[]>([]);
 const [photoLocation,setPhotoLocation]=useState<StockLocation|'auto'>('auto');
 const [analysing,setAnalysing]=useState(false),[searching,setSearching]=useState(false),[error,setError]=useState('');
 const photoRun=useRef(0),ignoreVoice=useRef(false);
 useEffect(()=>()=>{photoRun.current++},[]);
 const voice=useAiDictation(t=>{if(ignoreVoice.current){ignoreVoice.current=false;return}setDraft(c=>c.trim()?`${c}, ${t}`:t)});
 const selectedItems=pantry.filter(i=>selected.has(normalize(i.name)));
 const visible=pantry.filter(i=>source==='all'||locationOf(i)===source);
 const toggle=(name:string)=>{const key=normalize(name);setSelected(current=>{const next=new Set(current);if(next.has(key))next.delete(key);else next.add(key);return next})};
 const addItems=(items:IngredientInput[])=>{
  const stock=[...pantry];for(const item of items){if(!item.name.trim())continue;const index=stock.findIndex(i=>normalize(i.name)===normalize(item.name));if(index<0)stock.push(item);else if(item.quantity!==undefined)stock[index]={...stock[index],quantity:item.quantity,unit:item.unit??stock[index].unit};}
  updateSettings({pantryStock:stock});
  setSelected(current=>new Set([...current,...items.map(i=>normalize(i.name))]));
 };
 const addManual=(e:FormEvent)=>{e.preventDefault();if(voice.isListening||voice.isTranscribing)return;const items=draft.split(/[,;\n]+|\s+y\s+/i).map(s=>parseIngredientInput(s.trim())).filter(i=>i.name);addItems(items.map(i=>({...i,location:source==='all'?inferStockLocation(i.name):source})));setDraft('')};
 const analyse=async(file?:File)=>{
  if(!file||analysing)return;const run=++photoRun.current;setAnalysing(true);setError('');setCandidates([]);setPhoto(undefined);
  try{const result=await identifyPantryPhoto(file);if(run!==photoRun.current)return;setPhoto(result.previewUrl);setCandidates(result.ingredients.map(name=>({name,checked:true})));if(!result.ingredients.length)setError('No veo alimentos con suficiente claridad. Prueba otra foto o añádelos a mano.')}
  catch(e){if(run===photoRun.current)setError(e instanceof Error?e.message:'No se ha podido analizar la foto.')}
  finally{if(run===photoRun.current)setAnalysing(false)}
 };
 const confirmPhoto=()=>{
  const items=candidates.filter(i=>i.checked&&i.name.trim()).map(i=>({name:i.name.trim(),location:photoLocation==='auto'?inferStockLocation(i.name):photoLocation}));
  if(!items.length)return;
  addItems(items);setSelected(new Set(items.map(i=>normalize(i.name))));setCandidates([]);setPhoto(undefined);setSource('all');
 };
 const search=async()=>{
  if(!selectedItems.length||searching||analysing)return;setSearching(true);setError('');
  const available=selectedItems.map(i=>({...i,priority:selected.has(normalize(i.name))}));
  const request:CookingRequest={mode:'pantry',...cookingRequestOptions(options.value),pantryIngredients:available,pantryBasics:settings.pantryBasics,pantryPolicy:'prioritize',aiPreference:settings.aiPreference};
  try{const result=await getHybridProposals(request);setSearch(request,result.proposals.slice(0,1));navigate('/propuestas')}
  catch(e){setError(e instanceof Error?e.message:'No se ha podido preparar la propuesta.')}
  finally{setSearching(false)}
 };
 return <AppShell><ChefLoadingOverlay active={searching} title="Preparando tu propuesta" messages={['Cocinando con lo que tienes…']}/><TopBar title="Abre la despensa"/>
  <div className="page-content pantry-cook-visual">
   <p className="visual-hint">Elige los ingredientes con los que quieres cocinar.</p>
   <div className="pantry-source-tabs" aria-label="Ver inventario">
    <button aria-pressed={source==='all'} onClick={()=>setSource('all')}><PackageOpen/>Todo<span>{pantry.length}</span></button>
    <button aria-pressed={source==='fridge'} onClick={()=>setSource('fridge')}><Refrigerator/>Nevera<span>{pantry.filter(i=>locationOf(i)==='fridge').length}</span></button>
    <button aria-pressed={source==='pantry'} onClick={()=>setSource('pantry')}><PackageOpen/>Despensa<span>{pantry.filter(i=>locationOf(i)==='pantry').length}</span></button>
   </div>
   <div className="pantry-ingredient-grid" aria-label="Ingredientes disponibles">{visible.map(item=>{const active=selected.has(normalize(item.name));return <button key={normalize(item.name)} aria-pressed={active} onClick={()=>toggle(item.name)}><span className="pantry-food-icon">{locationOf(item)==='fridge'?<Refrigerator/>:<PackageOpen/>}</span><strong>{item.name}</strong>{item.quantity!==undefined&&<small>{item.quantity} {item.unit}</small>}<span className="pantry-choice-mark">{active?<Check size={18}/>:<Star size={18}/>}</span></button>})}</div>
   {!visible.length&&<p className="pantry-empty">No hay productos guardados aquí. Añádelos o usa una foto.</p>}
   <div className="pantry-photo-actions">
    <label><Camera/><strong>Hacer foto</strong><input aria-label="Fotografiar nevera o despensa" type="file" accept="image/*" capture="environment" disabled={analysing} onChange={e=>{void analyse(e.target.files?.[0]);e.target.value=''}}/></label>
    <label><ImagePlus/><strong>Subir foto</strong><input aria-label="Subir foto de nevera o despensa" type="file" accept="image/*" disabled={analysing} onChange={e=>{void analyse(e.target.files?.[0]);e.target.value=''}}/></label>
   </div>
   {analysing&&<p role="status">Identificando ingredientes…</p>}
   {photo&&candidates.length>0&&<section className="pantry-photo-review" aria-label="Revisar ingredientes de la foto"><img src={photo} alt="Nevera o despensa fotografiada"/><h2>Confirma lo que ves</h2>{candidates.map((item,index)=><div className="pantry-review-row" key={index}><input type="checkbox" aria-label={`Usar ingrediente ${index+1}`} checked={item.checked} onChange={e=>setCandidates(v=>v.map((x,i)=>i===index?{...x,checked:e.target.checked}:x))}/><input aria-label={`Ingrediente detectado ${index+1}`} value={item.name} onChange={e=>setCandidates(v=>v.map((x,i)=>i===index?{...x,name:e.target.value}:x))}/></div>)}<label>Guardar en<select aria-label="Guardar ingredientes en" value={photoLocation} onChange={e=>setPhotoLocation(e.target.value as StockLocation|'auto')}><option value="auto">Automática según producto</option><option value="fridge">Nevera</option><option value="pantry">Despensa</option></select></label><div className="pantry-review-actions"><button className="secondary-button" onClick={()=>{setCandidates([]);setPhoto(undefined)}}>Descartar</button><button className="secondary-button" disabled={!candidates.some(i=>i.checked&&i.name.trim())} onClick={confirmPhoto}><Check size={18}/>Guardar y usar</button></div></section>}
   <form className="ingredient-input pantry-add-input" onSubmit={addManual}><input aria-label="Añadir ingredientes" placeholder="Ej. arroz, pollo, calabacín…" value={draft} onChange={e=>setDraft(e.target.value)}/><button type="button" aria-label="Borrar ingredientes" className="clear-input-button" onClick={()=>{if(voice.isListening){ignoreVoice.current=true;voice.stop()}setDraft('')}} disabled={voice.isTranscribing}><X size={18}/></button><button type="button" className="voice-button" aria-label={voice.isListening?'Parar micrófono':'Iniciar micrófono'} disabled={!voice.isSupported||voice.isTranscribing} onClick={()=>{ignoreVoice.current=false;voice.toggle()}}>{voice.isListening?<MicOff size={19}/>:<Mic size={19}/>}</button><button type="submit" className="voice-confirm-button" aria-label="Confirmar ingredientes" disabled={!draft.trim()||voice.isListening||voice.isTranscribing}><Check size={19}/></button></form>
   {(voice.isListening||voice.isTranscribing)&&<p role="status">{voice.isListening?'Escuchando… pulsa el micrófono para parar.':'Transcribiendo…'}</p>}
   <div className="pantry-selection-summary" role="status"><strong>{selectedItems.length} elegidos</strong><span>{selectedItems.map(i=>i.name).join(' · ')}</span></div>

   {(error||voice.error)&&<p className="voice-status error" role="alert">{error||voice.error}</p>}
   <div className="visual-generate"><PrimaryButton onClick={()=>void search()} disabled={!selectedItems.length||searching||analysing||candidates.length>0}>{searching?'Preparando…':'Generar propuesta'}</PrimaryButton></div>
  </div>
 </AppShell>
}
