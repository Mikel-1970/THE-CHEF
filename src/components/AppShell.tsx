import { ArrowLeft, BookOpen, Camera, CookingPot, Heart, Home, Lightbulb, PackageOpen, Search, Settings, ShoppingBasket, Sparkles, X } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext';
import { ChefAvatar } from './ChefAvatar';
import './AppNavigation.css';
export function AppShell({children,hideProfile=false,onBack}: {children:ReactNode;hideNav?:boolean;hideBack?:boolean;hideProfile?:boolean;onBack?:()=>void}) {
 const location=useLocation(),navigate=useNavigate();const{settings}=useApp();
 const [open,setOpen]=useState(false);
 const button=useRef<HTMLButtonElement>(null);
 const go=(path:string)=>{setOpen(false);navigate(path)};
 const back=()=>{setOpen(false);if(onBack)onBack();else if(window.history.state?.idx>0)navigate(-1);else navigate('/')};
 useEffect(()=>{setOpen(false)},[location.pathname]);
 useEffect(()=>{if(!open)return;const escape=(e:KeyboardEvent)=>{if(e.key==='Escape'){setOpen(false);button.current?.focus()}};window.addEventListener('keydown',escape);return()=>window.removeEventListener('keydown',escape)},[open]);
 const items=[['/','Inicio',Home],['/mis-recetas?tab=favorites','Favoritos',Heart],['/mis-recetas','Mis recetas',BookOpen],['/tecnicas','Técnicas',CookingPot],['/consejos','Tips',Lightbulb],['/nevera','Despensa y nevera',PackageOpen],['/lista-compra','Lista de la compra',ShoppingBasket],['/antojo','Qué cocinar',Sparkles],['/cocina-despensa','Abre la despensa',PackageOpen],['/foto','Foto Receta',Camera],['/buscar','Buscar',Search],['/tutorial','Guía',BookOpen],['/ajustes','Perfil y ajustes',Settings]] as const;
 return <div className="app-bg chef-app-shell">
  <div className="ambient ambient-one"/><div className="ambient ambient-two"/><div className="grain"/>
  <main className="phone-shell without-bottom-nav">{children}</main>
  {createPortal(<div className="chef-navigation">
   {location.pathname!=='/'&&<button className="chef-nav-control chef-back" aria-label="Volver" onClick={back}><ArrowLeft size={23}/></button>}
   {!hideProfile&&<button ref={button} className="chef-draggable-avatar" aria-label={open?'Cerrar menú':'Abrir menú'} aria-expanded={open} aria-controls="chef-navigation-panel" title="Tu menú" onClick={()=>setOpen(v=>!v)}><ChefAvatar avatar={settings.avatarEmoji} size={54} showHat={false}/></button>}
   {open&&<><button className="chef-menu-backdrop" aria-label="Cerrar navegación" onClick={()=>setOpen(false)}/><nav id="chef-navigation-panel" className="chef-navigation-panel" aria-label="Menú de navegación"><div className="chef-menu-heading"><strong>Tu cocina</strong><button aria-label="Cerrar menú de navegación" onClick={()=>{setOpen(false);button.current?.focus()}}><X size={20}/></button></div><div className="chef-menu-grid">{items.map(([path,label,Icon])=><button key={path} onClick={()=>go(path)}><Icon size={23}/><span>{label}</span></button>)}</div></nav></>}
  </div>,document.body)}
 </div>
}
