import { ChiliIcon } from './ChiliIcon';
import { ChevronDown, ChevronUp, Clock3, UsersRound, Palette, Globe2, ShieldCheck, Gauge } from 'lucide-react';
import { useState } from 'react';
import { CuisineSelect } from './CuisineSelect';
import { NumberStepper } from './NumberStepper';
import { RECIPE_STYLES } from '../data/cookingOptions';
import type { CookingRequest, Difficulty } from '../domain/types';
import type { AppSettings, SpiceLevel } from '../services/storage';
import '../visual-controls.css';
export type CookingOptionsValue = { servings:number; maxMinutes:number; style?:string; cuisine?:string; difficulty?:Difficulty; spiceLevel:SpiceLevel; restrictions:string[]; customRestriction:string };
export function useCookingOptions(settings:AppSettings, previous?:CookingRequest) {
 const [value,setValue]=useState<CookingOptionsValue>({servings:previous?.servings??settings.defaultServings,maxMinutes:Math.min(120,Math.max(15,previous?.maxMinutes??60)),style:previous?.style,cuisine:previous?.cuisine,difficulty:previous?.difficulty??settings.defaultDifficulty,spiceLevel:previous?.spiceLevel??settings.spiceLevel,restrictions:previous?.restrictions??[],customRestriction:''});
 const [touched,setTouched]=useState<Set<string>>(new Set());
 const change=(patch:Partial<CookingOptionsValue>)=>{setValue(v=>({...v,...patch}));setTouched(v=>new Set([...v,...Object.keys(patch)]))};
 return {value,change,touched};
}
export function cookingRequestOptions(v:CookingOptionsValue) { const {customRestriction,...rest}=v; return {...rest,restrictions:[...v.restrictions,...customRestriction.split(/[,;]+/).map(s=>s.trim()).filter(Boolean)]}; }
const exclusions = ['Sin gluten','Sin lácteos','Sin huevo','Sin frutos secos','Sin pescado','Sin marisco','Vegetariana','Vegana'];
export function CookingOptions({value,onChange,expanded=false}:{value:CookingOptionsValue;onChange:(patch:Partial<CookingOptionsValue>)=>void;expanded?:boolean}) {
 const [optionsOpen,setOptionsOpen]=useState(false);
 const {servings,maxMinutes,style,cuisine,difficulty,spiceLevel,restrictions,customRestriction}=value;
 const setServings=(v:CookingOptionsValue["servings"])=>onChange({servings:v});
 const setMaxMinutes=(v:CookingOptionsValue["maxMinutes"])=>onChange({maxMinutes:v});
 const setStyle=(v:CookingOptionsValue["style"])=>onChange({style:v});
 const setCuisine=(v:CookingOptionsValue["cuisine"])=>onChange({cuisine:v});
 const setDifficulty=(v:CookingOptionsValue["difficulty"])=>onChange({difficulty:v});
 const setSpiceLevel=(v:CookingOptionsValue["spiceLevel"])=>onChange({spiceLevel:v});
 const setRestrictions=(v:CookingOptionsValue["restrictions"])=>onChange({restrictions:v});
 const setCustomRestriction=(v:CookingOptionsValue["customRestriction"])=>onChange({customRestriction:v});
 return <>
   {!expanded&&<button type="button" className="advanced-toggle" aria-expanded={optionsOpen} onClick={()=>setOptionsOpen(v=>!v)}><span>Personalizar</span>{optionsOpen?<ChevronUp size={20}/>:<ChevronDown size={20}/>}</button>}
   {(expanded||optionsOpen)&&<section className="visual-options" aria-label="Personalizar receta">
    <div className="visual-option"><div className="visual-option-title"><UsersRound/><strong>Comensales</strong></div><NumberStepper value={servings} onChange={v=>{setServings(v)}}/></div>
    <div className="visual-option"><div className="visual-option-title"><Clock3/><strong>Tiempo máximo</strong></div><NumberStepper value={maxMinutes} min={15} max={120} step={5} suffix="min" editable onChange={v=>{setMaxMinutes(v)}}/></div>
    <label className="visual-option"><span className="visual-option-title"><Palette/><strong>Estilo</strong></span><select aria-label="Estilo" value={style??''} onChange={e=>setStyle(e.target.value||undefined)}><option value="">Indiferente</option>{RECIPE_STYLES.filter(v=>v!=='Indiferente').map(v=><option key={v}>{v}</option>)}</select></label>
    <div className="visual-option"><div className="visual-option-title"><Globe2/><strong>Tipo de cocina</strong></div><CuisineSelect value={cuisine} onChange={setCuisine}/></div>
    <div className="visual-option"><div className="visual-option-title"><ShieldCheck/><strong>Restricciones / exclusiones</strong></div><details className="visual-multiselect"><summary><span>{[...restrictions,...(customRestriction?['Otra exclusión']:[])].join(' · ')||'Seleccionar'}</span><ChevronDown/></summary><div>{exclusions.map(value=><label key={value}><input type="checkbox" checked={restrictions.includes(value)} onChange={e=>setRestrictions(e.target.checked?[...restrictions,value]:restrictions.filter(v=>v!==value))}/>{value}</label>)}<label className="custom-exclusion">Otra exclusión<input aria-label="Otra exclusión" value={customRestriction} onChange={e=>setCustomRestriction(e.target.value)} placeholder="Ej. cebolla, ajo…"/></label></div></details></div>
    <label className="visual-option"><span className="visual-option-title"><Gauge/><strong>Dificultad máxima</strong></span><select aria-label="Dificultad máxima" value={difficulty??''} onChange={e=>setDifficulty(e.target.value as Difficulty||undefined)}><option value="">Indiferente</option>{['Fácil','Media','Avanzada'].map(v=><option key={v}>{v}</option>)}</select></label>
    <label className="visual-option"><span className="visual-option-title"><ChiliIcon/><strong>Picante</strong></span><select aria-label="Picante" value={spiceLevel} onChange={e=>setSpiceLevel(e.target.value as SpiceLevel)}>{['Nada','Suave','Medio','Alto'].map(v=><option key={v}>{v}</option>)}</select></label>
   </section>}
 </>;
}
