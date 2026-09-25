import { Mail, Share2, Star, Trash2 } from 'lucide-react';
import { useState } from 'react';
export function SettingsAbout({url}:{url:string}){
 const [panel,setPanel]=useState(''),[comment,setComment]=useState(''),[status,setStatus]=useState('');
 const [rating,setRating]=useState(()=>{try{return Number(localStorage.getItem('chef:beta-rating'))||0}catch{return 0}});
 const share=async(text:string,link?:string)=>{try{if(navigator.share)await navigator.share({title:'Chef Voldi',text,...(link?{url:link}:{})});else{await navigator.clipboard.writeText([text,link].filter(Boolean).join('\n'));setStatus('Copiado. Ya puedes compartirlo.')}}catch(e){if(!(e instanceof Error&&e.name==='AbortError'))setStatus('No se pudo compartir. Puedes copiar el texto manualmente.')}};
 return <section className="settings-about" aria-label="Acerca de"><h2>Acerca de</h2>
 <button onClick={()=>{setPanel(panel==='feedback'?'':'feedback');setStatus('')}}><Mail/>Enviar comentarios</button>
 {panel==='feedback'&&<div className="settings-card settings-feedback"><label htmlFor="beta-comment">¿Qué mejorarías?</label><textarea id="beta-comment" value={comment} onChange={e=>setComment(e.target.value)}/><button className="secondary-button" disabled={!comment.trim()} onClick={()=>void share(`Comentarios sobre Chef Voldi: ${comment}`)}>Compartir comentario</button><small>Elige a quién enviarlo desde tu dispositivo.</small></div>}
 <button onClick={()=>{setPanel(panel==='rating'?'':'rating');setStatus('')}}><Star/>Calificar la app</button>
 {panel==='rating'&&<div className="settings-card"><strong>Tu valoración de esta beta</strong><div className="rating-stars">{[1,2,3,4,5].map(n=><button key={n} aria-label={`${n} estrellas`} aria-pressed={rating===n} onClick={()=>{setRating(n);localStorage.setItem('chef:beta-rating',String(n));setStatus('Valoración guardada en este dispositivo.')}}><Star fill={n<=rating?'currentColor':'none'}/></button>)}</div><small>La app todavía no está publicada en una tienda.</small></div>}
 <button onClick={()=>void share('Prueba Chef Voldi. El acceso a esta preview sigue siendo privado.',url)}><Share2/>Compartir la app</button>
 <button className="settings-danger" onClick={()=>setPanel(panel==='delete'?'':'delete')}><Trash2/>Eliminar datos de este dispositivo</button>
 {panel==='delete'&&<div className="settings-card"><p>Se eliminarán el perfil local, las recetas guardadas, la despensa y las preferencias de este navegador. Tu cuenta de acceso privado seguirá existiendo.</p><button className="secondary-button" onClick={()=>setPanel('')}>Cancelar</button><button className="secondary-button" onClick={()=>{Object.keys(localStorage).filter(k=>(k.startsWith('chef:')||k.startsWith('the-chef:'))).forEach(k=>localStorage.removeItem(k));Object.keys(sessionStorage).filter(k=>(k.startsWith('chef:')||k.startsWith('the-chef:'))).forEach(k=>sessionStorage.removeItem(k));window.location.reload()}}>Confirmar eliminación de datos locales</button></div>}
 {status&&<p role="status">{status}</p>}
 </section>
}
