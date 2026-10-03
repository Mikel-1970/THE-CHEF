import { BrandMark } from '../components/BrandMark';
import { BookOpen, Camera, ChefHat, ChevronRight, Clock3, CookingPot, Heart, PackageOpen, Play, Search, ShoppingBasket } from 'lucide-react';
import { useMemo, useState } from 'react';
import { WelcomeSplash } from '../components/WelcomeSplash';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext';
import { AppShell } from '../components/AppShell';
import { RecipeThumbnail } from '../components/RecipeThumbnail';
import { getAllRecipes } from '../services/recipeCatalog';
import { formatDuration } from '../utils/time';

export function HomePage() {
  const navigate = useNavigate();
  const { favorites, toggleFavorite, settings } = useApp();
  const [greet,setGreet]=useState(()=>sessionStorage.getItem('chef:home-greeted:v2')!=='1');
  const [notice,setNotice]=useState('');
  const dailyRecipes=useMemo(()=>pickRecipesOfTheDay(getAllRecipes(),4),[]);

  if(greet)return <WelcomeSplash greeting={`¡Hola${settings.displayName?', '+settings.displayName:''}!`} notice={notice} onComplete={mode=>{if(mode==='register'){setNotice('Tu cuenta ya está registrada. Pulsa Login para entrar.');return}sessionStorage.setItem('chef:home-greeted:v2','1');setGreet(false)}}>{null}</WelcomeSplash>;

  const pantryImage=`${import.meta.env.BASE_URL}home-pantry-traditional.jpg`;
  const photoImage=`${import.meta.env.BASE_URL}home-photo-recipe-master.jpg`;

  return <AppShell>
    <section className="alm-home">
      <header className="alm-home-brand">
        <div className="alm-home-logo-row"><BrandMark/><span className="alm-home-note alm-hand">Buenas recetas,<br/>mejores momentos ♡</span></div>
        <h1>¿Qué comemos hoy?</h1>
        <p className="alm-subtitle">Tu asistente de cocina, siempre contigo.</p>
      </header>

      <button className="alm-search" onClick={()=>navigate('/buscar')} aria-label="Buscar recetas">
        <Search size={21}/><span>Busca recetas, ingredientes, cocinas…</span>
      </button>

      <section className="alm-primary-actions" aria-label="Formas principales de cocinar">
        <button className="alm-action-card pantry" onClick={()=>navigate('/despensa')}>
          <img src={pantryImage} alt="Despensa tradicional con tarros y productos"/>
          <span className="alm-action-overlay"/>
          <span className="alm-card-note alm-hand">Con lo que tienes,<br/>se comen cosas increíbles ♡</span>
          <span className="alm-action-copy"><strong>Abre la despensa</strong><small>Dime qué tienes y te doy ideas</small></span>
          <span className="alm-card-arrow" aria-hidden="true"><ChevronRight size={22}/></span>
        </button>
        <button className="alm-action-card photo" onClick={()=>navigate('/foto')}>
          <img src={photoImage} alt="Plato preparado para analizar por foto o vídeo"/>
          <span className="alm-action-overlay"/>
          <span className="alm-card-note alm-hand">Una foto también<br/>puede ser una receta ♡</span>
          <span className="alm-media-actions" aria-hidden="true"><span><Camera size={20}/></span><span><Play size={20} fill="currentColor"/></span></span>
          <span className="alm-action-copy"><strong>Foto/Video Receta</strong><small>Haz una foto o un vídeo y cocina con ella</small></span>
          <span className="alm-card-arrow" aria-hidden="true"><ChevronRight size={22}/></span>
        </button>
      </section>

      <section className="alm-quick" aria-label="Más opciones">
        <div className="alm-section-title"><h2>Más a tu alcance</h2><span className="alm-hand alm-section-note">Todo lo que necesitas,<br/>a un toque ♡</span></div>
        <div className="alm-quick-grid">
          <button onClick={()=>navigate('/mis-recetas?tab=favorites')}><span><Heart fill="currentColor" size={24}/></span><b>Favoritos</b>{favorites.length>0&&<em>{favorites.length}</em>}</button>
          <button onClick={()=>navigate('/mis-recetas')}><span><BookOpen size={24}/></span><b>Mis recetas</b></button>
          <button onClick={()=>navigate('/tecnicas')}><span><CookingPot size={25}/></span><b>Técnicas</b></button>
          <button onClick={()=>navigate('/inventario')}><span><PackageOpen size={25}/></span><b>Despensa</b></button>
          <button onClick={()=>navigate('/lista-compra')}><span><ShoppingBasket size={25}/></span><b>Lista de compra</b></button>
        </div>
      </section>

      <section className="alm-daily" aria-label="Propuesta del día">
        <div className="alm-section-title"><h2>Propuesta del día</h2><span>Desliza para ver más →</span></div>
        <div className="alm-daily-strip">
          {dailyRecipes.map(recipe=><article className="alm-daily-card" key={recipe.id} onClick={()=>navigate(`/receta/${recipe.id}`)}>
            <div className="alm-daily-image"><RecipeThumbnail recipe={recipe}/><button className={favorites.includes(recipe.id)?'active':''} aria-label={favorites.includes(recipe.id)?'Quitar de favoritos':'Añadir a favoritos'} onClick={e=>{e.stopPropagation();toggleFavorite(recipe.id)}}><Heart size={18} fill={favorites.includes(recipe.id)?'currentColor':'none'}/></button></div>
            <div className="alm-daily-copy"><strong>{recipe.title}</strong><div className="alm-daily-meta"><span><Clock3 size={14}/>{formatDuration(recipe.prepMinutes+recipe.cookMinutes)}</span><span><ChefHat size={14}/>{recipe.difficulty}</span></div></div>
          </article>)}
        </div>
      </section>
      <footer className="alm-home-footer"><span className="alm-hand">Cocinar bien también es vivir mejor ♡</span><span className="alm-hand">¡A la buena mesa, mejores historias! ♡</span></footer>
    </section>
  </AppShell>;
}

function pickRecipesOfTheDay<T extends {id:string}>(items:T[],count:number):T[]{
  const day=new Date().toLocaleDateString('en-CA');
  return [...items].sort((a,b)=>score(a.id+day)-score(b.id+day)).slice(0,count);
}
function score(value:string){let h=2166136261;for(let i=0;i<value.length;i++){h^=value.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
