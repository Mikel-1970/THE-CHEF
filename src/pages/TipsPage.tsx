import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { TopBar } from '../components/TopBar';
import { cookingTips, getTipReviews, setTipReview } from '../data/cookingTips';
import { queueTipReview, synchronizeCulinaryCatalog } from '../services/culinarySync';
import '../tips.css';

const ALL_CATEGORIES='Todas las categorías';

export function TipsPage(){
 const navigate=useNavigate();
 const [reviews,setReviews]=useState(getTipReviews);
 const [query,setQuery]=useState('');
 const [category,setCategory]=useState(ALL_CATEGORIES);
 const [error,setError]=useState('');
 const [sync,setSync]=useState(__PRIVATE_PREVIEW__?'Sincronizando…':'Guardado en este dispositivo');

 useEffect(()=>{
  const updated=(event:Event)=>{
   setReviews(getTipReviews());
   const detail=(event as CustomEvent).detail;
   setSync(detail==='synced'?'Sincronizado entre dispositivos':detail==='local'?'Guardado en este dispositivo':'Guardado aquí; sincronización pendiente');
  };
  window.addEventListener('chef:catalog-sync',updated);
  void synchronizeCulinaryCatalog();
  return()=>window.removeEventListener('chef:catalog-sync',updated);
 },[]);

 const categories=useMemo(()=>{
  const counts=new Map<string,number>();
  cookingTips.forEach(t=>counts.set(t.category,(counts.get(t.category)||0)+1));
  return [...counts.entries()].sort(([a],[b])=>a.localeCompare(b,'es'));
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
  return cookingTips.filter(t=>{
   if(category!==ALL_CATEGORIES&&t.category!==category)return false;
   if(!q)return true;
   return [
    t.code,t.title,t.category,t.text,t.explanation,t.whyItWorks,...t.tags,...t.techniques,...t.appliesTo
   ].join(' ').toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'').includes(q);
  });
 },[query,category]);

 const grouped=useMemo(()=>{
  const groups=new Map<string,typeof cookingTips>();
  filtered.forEach(t=>{
   const items=groups.get(t.category)||[];
   items.push(t);
   groups.set(t.category,items);
  });
  return [...groups.entries()].sort(([a],[b])=>a.localeCompare(b,'es'));
 },[filtered]);

 return <AppShell onBack={()=>navigate('/tecnicas',{replace:true})}>
  <TopBar title="Tips de cocina"/>
  <div className="page-content nav-safe tips-page">
   <nav className="culinary-tabs" aria-label="Técnicas y tips"><Link replace to="/tecnicas">Técnicas</Link><Link aria-current="page" replace className="active" to="/consejos">Tips</Link></nav>
   <section className="editorial-card tips-intro">
    <span className="eyebrow">BIBLIOTECA DE TIPS</span>
    <h2>{cookingTips.length} tips organizados por categorías</h2>
    <p>Consulta la biblioteca completa o entra directamente en una categoría. Chef Voldi seguirá mostrando en Elaboración solo los tips que aporten valor al paso concreto.</p>
    <small>{sync}</small>

    <label className="tips-filter-label">
     <span>Categoría</span>
     <select aria-label="Filtrar tips por categoría" value={category} onChange={e=>setCategory(e.target.value)}>
      <option value={ALL_CATEGORIES}>{ALL_CATEGORIES} · {cookingTips.length}</option>
      {categories.map(([name,count])=><option key={name} value={name}>{name} · {count}</option>)}
     </select>
    </label>

    <input aria-label="Buscar tip" placeholder="Busca un ingrediente, técnica o consejo" value={query} onChange={e=>setQuery(e.target.value)}/>
   </section>

   <nav className="tips-category-strip" aria-label="Categorías de tips">
    <button type="button" className={category===ALL_CATEGORIES?'active':''} onClick={()=>setCategory(ALL_CATEGORIES)}>Todas <span>{cookingTips.length}</span></button>
    {categories.map(([name,count])=><button type="button" key={name} className={category===name?'active':''} onClick={()=>setCategory(name)}>{name} <span>{count}</span></button>)}
   </nav>

   {error&&<p role="alert">{error}</p>}
   {!filtered.length&&<section className="editorial-card"><h3>No hay tips que coincidan.</h3><p>Prueba otra categoría o cambia la búsqueda.</p></section>}

   {grouped.map(([name,tips])=><section className="tips-category-section" key={name}>
    <div className="tips-category-heading"><div><span className="eyebrow">CATEGORÍA</span><h2>{name}</h2></div><strong>{tips.length}</strong></div>
    <div className="tips-category-list">
     {tips.map(t=><article className="editorial-card tip-review-card" key={t.id}>
      <div className="tip-card-heading">
       <span className="cooking-tip-icon" aria-hidden="true">{t.icon}</span>
       <div><small>{t.code} · {t.priority} · {t.level}</small><h3>{t.title}</h3></div>
      </div>
      <p><strong>{t.shortTip}</strong></p>
      <details>
       <summary>Ver ficha completa</summary>
       <p>{t.explanation}</p>
       <p><strong>Por qué funciona:</strong> {t.whyItWorks}</p>
       <p><strong>Úsalo en:</strong> {t.appliesTo.join(' · ')}</p>
       <p><strong>Técnicas:</strong> {t.techniques.join(' · ')}</p>
       <p><strong>Momento:</strong> {t.useMoment.join(' · ')}</p>
       <p><strong>Error que evita:</strong> {t.commonError}</p>
       <p><strong>Señal:</strong> {t.sensorySignal}</p>
       <p><strong>Chef Voldi:</strong> {t.chefQuickTip}</p>
      </details>
      {t.source&&<a href={t.source} target="_blank" rel="noreferrer">Consultar fuente</a>}
      <div className="chip-row">
       <button className="chip" aria-pressed={reviews[t.id]==='keep'} onClick={()=>review(t.id,'keep')}>Me interesa</button>
       <button className="chip" aria-pressed={reviews[t.id]==='hide'} onClick={()=>review(t.id,'hide')}>Ocultar</button>
       <button className="chip" aria-pressed={!reviews[t.id]} onClick={()=>review(t.id,'pending')}>Sin decidir</button>
      </div>
     </article>)}
    </div>
   </section>)}
  </div>
 </AppShell>;
}
