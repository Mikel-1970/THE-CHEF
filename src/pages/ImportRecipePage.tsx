import {sourceLabelFromUrl} from '../utils/importSourceUrl';
import {useMemo,useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {AppShell} from '../components/AppShell';
import {TopBar} from '../components/TopBar';
import {useApp} from '../AppContext';
import {useApp} from '../AppContext';
import {parseImportText,readRecipeFile,organizeImportWithAi,buildImportedRecipe,persistImportedRecipe,importDraftIssues,importDraftNeedsReview,type ImportDraft} from '../services/recipeImport';
import {textFromRecipeHtml} from '../services/importHtml';
import './ImportRecipePage.css';

export function ImportRecipePage(){
 const navigate=useNavigate(),{toggleSavedRecipe,settings}=useApp();
 const [text,setText]=useState(''),[url,setUrl]=useState(''),[source,setSource]=useState('Texto aportado'),[author,setAuthor]=useState(''),[draft,setDraft]=useState<ImportDraft>(),[busy,setBusy]=useState(false),[status,setStatus]=useState(''),[error,setError]=useState(''),[confirmed,setConfirmed]=useState(false),[ai,setAi]=useState(false);
 const issues=useMemo(()=>draft?importDraftIssues(draft):[],[draft]),needsReview=useMemo(()=>draft?importDraftNeedsReview(draft):false,[draft]);
 const run=async(action:()=>Promise<void>)=>{if(busy)return;setBusy(true);setError('');try{await action();}catch(e){setError(e instanceof Error?e.message:'No se ha podido importar.');}finally{setBusy(false);}};
 const applyDefaults=(d:ImportDraft):ImportDraft=>d.servings?d:{...d,servings:String(settings.defaultServings),fieldEvidence:{...d.fieldEvidence,servings:{state:'estimated',confidence:1,note:'Raciones habituales configuradas por el usuario'}}};
 const review=(d:ImportDraft,usedAi=false)=>{const next={...applyDefaults(d),sourceLabel:source,sourceUrl:url,author};setDraft(next);setConfirmed(false);setAi(usedAi);setStatus(importDraftNeedsReview(next)?'He estructurado la receta. Revisa solo los datos marcados o que falten.':'La fuente contiene los datos necesarios. Puedes guardarla directamente o editarla.');};
 const update=(next:Partial<ImportDraft>,evidenceKey?:string)=>{setDraft(d=>d?{...d,...next,fieldEvidence:evidenceKey?{...d.fieldEvidence,[evidenceKey]:{state:'user-confirmed',confidence:1}}:d.fieldEvidence}:d);setConfirmed(false);};
 const canSave=Boolean(draft)&&issues.length===0&&(!needsReview||confirmed);
 return <AppShell onBack={()=>navigate('/mis-recetas?tab=all')}><TopBar title="Importar receta"/><div className="page-content nav-safe import-recipe">
  <section className="editorial-card"><h2>Convierte una fuente en receta The Chef</h2><p>Pega un enlace, texto o documento escrito. Instagram, TikTok, YouTube y Facebook pueden limitar lo que una web puede leer; si falta contenido, pega la descripción o transcripción y continuaremos sin inventar.</p><button className="secondary-button" onClick={()=>navigate('/foto')}>¿Es una foto o captura? Abrir Foto Receta</button></section>
  <fieldset disabled={busy}>
   <label>Enlace de receta o publicación<input type="url" value={url} onChange={e=>{setUrl(e.target.value);setDraft(undefined)}} placeholder="https://…"/></label>
   <button className="secondary-button" onClick={()=>void run(async()=>{const target=new URL(url);if(target.protocol!=='https:')throw Error('Usa un enlace HTTPS.');setStatus('Leyendo contenido público disponible…');const response=await fetch(`${import.meta.env.BASE_URL}api/import-source`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url})});const result=await response.json().catch(()=>({}));if(!response.ok)throw Error(result.error||'La fuente no permite lectura automática. Pega la descripción, receta o transcripción.');const extracted=textFromRecipeHtml(result.html),label=sourceLabelFromUrl(result.url),parsed=applyDefaults(parseImportText(extracted.text)),next={...parsed,sourceLabel:label,sourceUrl:result.url,author:extracted.author};setText(extracted.text);setAuthor(extracted.author);setSource(label);setUrl(result.url);setDraft(next);setAi(false);setConfirmed(false);setStatus(importDraftNeedsReview(next)?'Contenido recuperado. Completa solo los datos que faltan.':'Receta estructurada automáticamente y lista para guardar.');})} disabled={!url.trim()}>Leer enlace</button>
   <p className="import-note">Para redes sociales: copia el enlace de la publicación y pégalo aquí. En iPhone una PWA no puede instalar una extensión nativa de “Compartir con The Chef”.</p>
   <label>Archivo de receta<input type="file" accept=".txt,.md,.docx,.pdf" onChange={e=>{const file=e.target.files?.[0];if(file)void run(async()=>{const result=await readRecipeFile(file,setStatus);setText(result);setSource('Archivo: '+file.name);setUrl('');setAuthor('');setDraft(undefined);setStatus('Archivo leído. Revisa el texto reconocido.');});e.target.value='';}}/></label>
   <small>TXT, Word DOCX o PDF. Máximo 10 MB; PDF de hasta 20 páginas, o 5 si está escaneado. Foto/captura se gestiona exclusivamente con Foto Receta.</small>
   <label>Texto de la receta<textarea aria-label="Texto de la receta" value={text} maxLength={50000} rows={10} onChange={e=>{setText(e.target.value);setDraft(undefined)}} placeholder={'Nombre de la receta\nComensales: 4\nPreparación: 10 min\nCocción: 20 min\nIngredientes\n200 g de arroz\nElaboración\n1. …'}/></label>
   <div className="import-actions"><button className="secondary-button" disabled={text.trim().length<20} onClick={()=>review(parseImportText(text))}>Organizar sin IA</button><button className="secondary-button" disabled={text.trim().length<30||text.length>20000} onClick={()=>void run(async()=>review(await organizeImportWithAi(text),true))}>Analizar texto con IA</button></div>
   <p className="import-note">«Analizar texto con IA» envía el texto al servicio de IA y consume una petición. «Organizar sin IA» trabaja en el dispositivo.</p>
  </fieldset>
  {draft&&<section className="editorial-card"><h2>{needsReview?'Revisión necesaria':'Lista para guardar'}</h2><p>{ai?'La IA ha estructurado parte del contenido. Los datos interpretados deben contrastarse con la fuente.':'Los datos se han organizado sin completar información ausente.'}</p>
   {issues.length>0&&<div role="status" className="import-note"><strong>Falta completar:</strong><ul>{issues.map(i=><li key={i}>{i}</li>)}</ul></div>}
   <fieldset disabled={busy}>
    <label>Título<input value={draft.title} onChange={e=>update({title:e.target.value},'title')}/></label>
    <label>Descripción<textarea value={draft.description} onChange={e=>update({description:e.target.value},'description')}/></label>
    <div className="import-grid">{([['servings','Comensales'],['prep','Preparación (min)'],['cook','Cocción (min)']] as const).map(([key,label])=><label key={key}>{label}<input type="number" min={key==='servings'?1:0} value={draft[key]} onChange={e=>update({[key]:e.target.value},key)}/></label>)}</div>
    <h3>Ingredientes</h3>{draft.ingredients.map((i,n)=><div className="import-ingredient" key={n}><label>Ingrediente {n+1}<input value={i.name} onChange={e=>update({ingredients:draft.ingredients.map((v,j)=>j===n?{...v,name:e.target.value}:v)},'ingredients')}/></label><label>Cantidad {n+1}<input inputMode="decimal" value={i.quantity} onChange={e=>update({ingredients:draft.ingredients.map((v,j)=>j===n?{...v,quantity:e.target.value}:v)},'ingredients')}/></label><label>Unidad {n+1}<input value={i.unit} placeholder="g, ml, unidad…" onChange={e=>update({ingredients:draft.ingredients.map((v,j)=>j===n?{...v,unit:e.target.value}:v)},'ingredients')}/></label><button aria-label={`Quitar ingrediente ${n+1}`} onClick={()=>update({ingredients:draft.ingredients.filter((_,j)=>j!==n)},'ingredients')}>Quitar</button></div>)}
    <button className="secondary-button" onClick={()=>update({ingredients:[...draft.ingredients,{name:'',quantity:'',unit:''}]},'ingredients')}>Añadir ingrediente</button>
    <label>Elaboración · un paso por línea<textarea rows={8} value={draft.steps} onChange={e=>update({steps:e.target.value},'steps')}/></label>
    <label>Autor o creador (opcional)<input value={draft.author} onChange={e=>update({author:e.target.value},'author')}/></label>
    <label>Fuente<input value={draft.sourceLabel} onChange={e=>update({sourceLabel:e.target.value},'source')}/></label>
    <label>Enlace original (opcional)<input type="url" value={draft.sourceUrl} onChange={e=>update({sourceUrl:e.target.value},'source')}/></label>
    <p>No se inventa nutrición ni se genera una foto automáticamente. Si usas unidades imperiales y tienes sistema métrico, The Chef convierte solo equivalencias seguras y conserva el valor original.</p>
    {needsReview&&<label className="import-confirm"><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/>He revisado los datos interpretados y confirmado que ingredientes, cantidades y pasos coinciden con la fuente.</label>}
    <button className="primary-button" disabled={!canSave} onClick={()=>void run(async()=>{if(!draft)return;const recipe=buildImportedRecipe(draft);persistImportedRecipe(recipe);toggleSavedRecipe(recipe.id);navigate(`/receta/${recipe.id}`);})}>Guardar en Mis recetas</button>
   </fieldset>
  </section>}
  {status&&<p role="status">{status}</p>}{error&&<p role="alert">{error}</p>}
 </div></AppShell>;
}
