import { useEffect, useMemo, useState } from 'react';
import { AppShell } from '../components/AppShell';
import { TopBar } from '../components/TopBar';
import { cookingTips, getTipReviews, setTipReview } from '../data/cookingTips';
import { queueTipReview, synchronizeCulinaryCatalog } from '../services/culinarySync';

export function TipsPage(){
 const [reviews,setReviews]=useState(getTipReviews);
 const [query,setQuery]=useState('');
 const [error,setError]=useState('');
 const [sync,setSync]=useState(__PRIVATE_PREVIEW__?'Sincronizando…':'Guardado en este dispositivo');
 useEffect(()=>{
  const updated=(event:Event)=>{
   setReviews(getTipReviews());
   const detail=(event as CustomEvent).detail;setSync(detail==='synced'?'Sincronizado entre dispositivos':detail==='local'?'Guardado en este dispositivo':'Guardado aquí; sincronización pendiente');
  };
  window.addEventListener('chef:catalog-sync',updated);
  void synchronizeCulinaryCatalog();
  return()=>window.removeEventListener('chef:catalog-sync',updated);
 },[]);
 const review=(id:string,value:'keep'|'hide'|'pending')=>{
  try{
   setReviews(setTipReview(id,value));
   setSync(__PRIVATE_PREVIEW__?'Sincronizando…':'Guardado en este dispositivo');
   queueTipReview(id,value);
   setError('');
  }catch{setError('No se ha podido guardar tu selección en este navegador.')}
 };
 const filtered=useMemo(()=>{
  const q=query.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
  if(!q)return cookingTips;
  return cookingTips.filter(t=>[
   t.code,t.title,t.category,t.text,t.explanation,t.whyItWorks,...t.tags,...t.techniques,...t.appliesTo
  ].join(' ').toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'').includes(q));
 },[query]);
 return <AppShell>
  <TopBar title="Consejos de cocina"/>
  <div className="page-content nav-safe">
   <section className="editorial-card">
    <h2>{cookingTips.length} tips de cocina</h2>
    <p>The Chef los relaciona con ingredientes, técnicas y pasos concretos. En Elaboración solo aparece un consejo cuando aporta valor.</p>
    <small>{sync}</small>
    <input aria-label="Buscar consejo" placeholder="Busca un ingrediente, técnica o consejo" value={query} onChange={e=>setQuery(e.target.value)}/>
   </section>
   {error&&<p role="alert">{error}</p>}
   {filtered.map(t=><article className="editorial-card tip-review-card" key={t.id}>
    <div className="tip-card-heading">
     <span className="cooking-tip-icon" aria-hidden="true">{t.icon}</span>
     <div><small>{t.code} · {t.category} · {t.priority}</small><h3>{t.title}</h3></div>
    </div>
    <p><strong>{t.shortTip}</strong></p>
    <details>
     <summary>Ver explicación</summary>
     <p>{t.explanation}</p>
     <p><strong>Por qué funciona:</strong> {t.whyItWorks}</p>
     <p><strong>Úsalo en:</strong> {t.appliesTo.join(' · ')}</p>
     <p><strong>Técnicas:</strong> {t.techniques.join(' · ')}</p>
     <p><strong>Error que evita:</strong> {t.commonError}</p>
     <p><strong>The Chef:</strong> {t.chefQuickTip}</p>
    </details>
    {t.source&&<a href={t.source} target="_blank" rel="noreferrer">Consultar fuente</a>}
    <div className="chip-row">
     <button className="chip" aria-pressed={reviews[t.id]==='keep'} onClick={()=>review(t.id,'keep')}>Me interesa</button>
     <button className="chip" aria-pressed={reviews[t.id]==='hide'} onClick={()=>review(t.id,'hide')}>Ocultar</button>
     <button className="chip" aria-pressed={!reviews[t.id]} onClick={()=>review(t.id,'pending')}>Sin decidir</button>
    </div>
   </article>)}
  </div>
 </AppShell>;
}
