import {BrandMark} from '../components/BrandMark';
import { BookOpen, Camera, ChefHat, CookingPot, Heart, ShoppingBasket } from 'lucide-react';
import { useState } from 'react';
import { WelcomeSplash } from '../components/WelcomeSplash';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext';
import { AppShell } from '../components/AppShell';
import '../home-v04.css';
import { FoodCollage } from '../components/FoodCollage';
import '../home-v04-refinements.css';

export function HomePage() {
  const navigate = useNavigate();
  const { favorites, settings } = useApp();
  const [greet,setGreet]=useState(()=>sessionStorage.getItem('chef:home-greeted:v2')!=='1');
  const [notice,setNotice]=useState('');
  if(greet)return <WelcomeSplash greeting={`¡Hola${settings.displayName?', '+settings.displayName:''}!`} notice={notice} onComplete={mode=>{if(mode==='register'){setNotice('Tu cuenta ya está registrada. Pulsa Login para entrar.');return}sessionStorage.setItem('chef:home-greeted:v2','1');setGreet(false)}}>{null}</WelcomeSplash>;
  const desireImage = `${import.meta.env.BASE_URL}home-desire.webp`;
  const photoRecipeImage = `${import.meta.env.BASE_URL}home-photo-recipe.png`;
  return <AppShell>
    <section className="reference-home"><FoodCollage/>
      <div className="reference-decor reference-decor-right" style={{ backgroundImage: `url(${desireImage})` }} aria-hidden="true" />
      <header className="reference-brand"><BrandMark/><h1 className="brand-sr-only">Chef Voldi</h1><div className="reference-divider" aria-hidden="true"><span /><i>◇</i><span /></div><p className="reference-brand-tagline">Vamos a cocinar algo delicioso.</p></header>
      <section className="reference-main-actions" aria-label="Acción principal">
        <button data-tour="desire" className="reference-action-card reference-desire-card" onClick={() => navigate('/antojo')}>
          <div className="reference-action-text"><h3>¿Qué quieres<br />cocinar?</h3><span className="reference-action-line reference-action-line-gold" /><p>Dime un plato o los ingredientes que tienes</p><span className="reference-card-cta">Empezar</span></div>
          <div className="reference-action-photo reference-desire-photo" style={{ backgroundImage: `linear-gradient(90deg, rgba(255,253,248,.98) 0%, rgba(255,253,248,.88) 38%, rgba(255,253,248,.14) 68%, rgba(255,253,248,0) 100%), url(${desireImage})` }} aria-hidden="true" />
          <span className="reference-card-icon reference-card-icon-gold"><ChefHat size={38} strokeWidth={1.55} /></span>
        </button>
      </section>
      <section className="reference-secondary-actions" aria-label="Otras formas de cocinar">
        <button data-tour="photo" className="reference-secondary-card reference-photo-card" onClick={() => navigate('/foto')}><span className="reference-secondary-photo" style={{ backgroundImage: `linear-gradient(180deg, rgba(24,30,18,.01), rgba(24,30,18,.61)), url(${photoRecipeImage})` }} aria-hidden="true" /><span className="reference-secondary-icon"><Camera size={25} /></span><span className="reference-secondary-copy"><strong>Foto Receta</strong><small>Enséñame un plato y descubre cómo prepararlo.</small><b>Empezar</b></span></button>
      </section>
      <section data-tour="quick" className="reference-quick-section" aria-label="Accesos rápidos"><div className="reference-quick-title"><span>❧</span><h2>Accesos rápidos</h2><span>❧</span></div><div className="reference-quick-grid">
        <button className="reference-favorite" onClick={() => navigate('/mis-recetas?tab=favorites')}><Heart size={39} strokeWidth={1.55} fill="currentColor" /><strong>Favoritos</strong>{favorites.length > 0 && <small>{favorites.length}</small>}</button>
        <button onClick={() => navigate('/mis-recetas')}><BookOpen size={37} strokeWidth={1.65} /><strong>Mis recetas</strong></button>
        <button onClick={() => navigate('/tecnicas')}><CookingPot size={39} strokeWidth={1.55} /><strong>Técnicas</strong></button>
        <button onClick={() => navigate('/lista-compra')}><ShoppingBasket size={39} strokeWidth={1.55} /><strong>Lista de la compra</strong></button>
      </div></section>
    </section>
  </AppShell>;
}
