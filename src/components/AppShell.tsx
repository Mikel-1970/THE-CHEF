import { ArrowLeft, BookOpen, Camera, CookingPot, Heart, Home, PackageOpen, Search, Settings, ShoppingBasket, Sparkles, X } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext';
import { ChefAvatar } from './ChefAvatar';
import './AppNavigation.css';
const POSITION_KEY='chef:avatar-position:v1';
function bounded(p:{x:number;y:number}) {return {x:Math.max(8,Math.min(window.innerWidth-66,p.x)),y:Math.max(8,Math.min(window.innerHeight-78,p.y))}}
function initialPosition(){try{const p=JSON.parse(localStorage.getItem(POSITION_KEY)||'null');if(p&&Number.isFinite(p.x)&&Number.isFinite(p.y))return bounded(p)}catch{}return {x:74,y:12}}
export function AppShell({children,hideProfile=false,onBack}: {children:ReactNode;hideNav?:boolean;hideBack?:boolean;hideProfile?:boolean;onBack?:()=>void}) {
 const location=useLocation(),navigate=useNavigate();const{settings}=useApp();
 const [open,setOpen]=useState(false),[position,setPosition]=useState(initialPosition);
 const drag=useRef<{x:number;y:number;left:number;top:number;moved:boolean}|null>(null);
 const suppressClick=useRef(false); const button=useRef<HTMLButtonElement>(null);
 const go=(path:string)=>{setOpen(false);navigate(path)};
 const back=()=>{setOpen(false);if(onBack)onBack();else if(window.history.state?.idx>0)navigate(-1);else navigate('/')};
 const move=(p:{x:number;y:number})=>{const next=bounded(p);setPosition(next);try{localStorage.setItem(POSITION_KEY,JSON.stringify(next))}catch{}};
 useEffect(()=>{setOpen(false)},[location.pathname]);
 useEffect(()=>{const resize=()=>setPosition(p=>bounded(p));window.addEventListener('resize',resize);return()=>window.removeEventListener('resize',resize)},[]);
 useEffect(()=>{if(!open)return;const escape=(e:KeyboardEvent)=>{if(e.key==='Escape'){setOpen(false);button.current?.focus()}};window.addEventListener('keydown',escape);return()=>window.removeEventListener('keydown',escape)},[open]);
 const items=[['/','Inicio',Home],['/antojo','Qué cocinar',Sparkles],['/cocina-despensa','Abre la despensa',PackageOpen],['/foto','Foto Receta',Camera],['/mis-recetas?tab=favorites','Favoritas',Heart],['/mis-recetas','Mis recetas',BookOpen],['/nevera','Mi despensa',PackageOpen],['/lista-compra','Lista de compra',ShoppingBasket],['/buscar','Buscar',Search],['/tecnicas','Técnicas',CookingPot],['/tutorial','Guía',BookOpen]] as const;
 return <div className="app-bg chef-app-shell">
  <div className="ambient ambient-one"/><div className="ambient ambient-two"/><div className="grain"/>
  <main className="phone-shell without-bottom-nav">{children}</main>
  {createPortal(<div className="chef-navigation">
   {location.pathname!=='/'&&<button className="chef-nav-control chef-back" aria-label="Volver" onClick={back}><ArrowLeft size={23}/></button>}
   <button className="chef-nav-control chef-settings" aria-label="Perfil y ajustes" onClick={()=>go('/ajustes')}><Settings size={23}/></button>
   {!hideProfile&&<button ref={button} className="chef-draggable-avatar" style={{left:position.x,top:`calc(env(safe-area-inset-top, 0px) + ${position.y}px)`}} aria-label={open?'Cerrar menú':'Abrir menú'} aria-expanded={open} aria-controls="chef-navigation-panel" title="Tu menú · arrastra para mover" onPointerDown={e=>{if(e.button!==0)return;suppressClick.current=false;drag.current={x:e.clientX,y:e.clientY,left:position.x,top:position.y,moved:false};e.currentTarget.setPointerCapture(e.pointerId)}} onPointerMove={e=>{const d=drag.current;if(!d)return;const dx=e.clientX-d.x,dy=e.clientY-d.y;if(Math.hypot(dx,dy)>6)d.moved=true;if(d.moved){suppressClick.current=true;move({x:d.left+dx,y:d.top+dy})}}} onPointerUp={()=>{drag.current=null}} onPointerCancel={()=>{drag.current=null;suppressClick.current=true}} onClick={()=>{if(suppressClick.current){suppressClick.current=false;return}setOpen(v=>!v)}} onKeyDown={e=>{const deltas:Record<string,[number,number]>={ArrowLeft:[-20,0],ArrowRight:[20,0],ArrowUp:[0,-20],ArrowDown:[0,20]};const d=deltas[e.key];if(d){e.preventDefault();move({x:position.x+d[0],y:position.y+d[1]})}}}><ChefAvatar avatar={settings.avatarEmoji} size={54} showHat={false}/></button>}
   {open&&<><button className="chef-menu-backdrop" aria-label="Cerrar navegación" onClick={()=>setOpen(false)}/><nav id="chef-navigation-panel" className="chef-navigation-panel" aria-label="Menú de navegación"><div className="chef-menu-heading"><strong>Tu cocina</strong><button aria-label="Cerrar menú de navegación" onClick={()=>{setOpen(false);button.current?.focus()}}><X size={20}/></button></div><div className="chef-menu-grid">{items.map(([path,label,Icon])=><button key={path} onClick={()=>go(path)}><Icon size={23}/><span>{label}</span></button>)}</div></nav></>}
  </div>,document.body)}
 </div>
}
