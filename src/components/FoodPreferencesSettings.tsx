import {AlertTriangle, Ruler, UtensilsCrossed} from 'lucide-react';
import {Chip} from './Chip';
import {EU_ALLERGENS,type EuAllergen} from '../data/allergens';
import type {AppSettings,NutritionDisplay,UnitPreference} from '../services/storage';

export function FoodPreferencesSettings({settings,onChange}:{settings:AppSettings;onChange:(next:Partial<AppSettings>)=>void}){
 const toggle=(value:EuAllergen)=>onChange({allergies:settings.allergies.includes(value)?settings.allergies.filter(v=>v!==value):[...settings.allergies,value]});
 return <>
  <section className="settings-card">
   <div className="settings-card-title"><AlertTriangle size={20}/><div><strong>Alergias e intolerancias</strong><small>Se aplican a recetas, Foto Receta, Nevera, importaciones y plan nutricional.</small></div></div>
   <p className="pantry-basics-note">Marca solo alergias confirmadas. The Chef puede detectar ingredientes de riesgo, pero no certifica que una receta sea segura para una alergia.</p>
   <div className="chip-row">{EU_ALLERGENS.map(a=><Chip key={a} selected={settings.allergies.includes(a)} onClick={()=>toggle(a)}>{a}</Chip>)}</div>
   <label><span>Otras intolerancias</span><input value={settings.intolerances.join(', ')} onChange={e=>onChange({intolerances:splitList(e.target.value)})} placeholder="Ej. lactosa, fructosa…"/></label>
   <label><span>Ingredientes que quieres evitar</span><input value={settings.avoidIngredients.join(', ')} onChange={e=>onChange({avoidIngredients:splitList(e.target.value)})} placeholder="Ej. cilantro, alcohol…"/></label>
  </section>
  <section className="settings-card">
   <div className="settings-card-title"><Ruler size={20}/><div><strong>Unidades</strong><small>Preferencia para recetas importadas y nuevas.</small></div></div>
   <select className="settings-select" value={settings.unitPreference} onChange={e=>onChange({unitPreference:e.target.value as UnitPreference})}>
    <option value="metric">Métrico · g, kg, ml, l, °C</option><option value="original">Mantener unidades originales</option>
   </select>
  </section>
  <section className="settings-card">
   <div className="settings-card-title"><UtensilsCrossed size={20}/><div><strong>Información nutricional</strong><small>Cómo quieres verla por defecto.</small></div></div>
   <select className="settings-select" value={settings.nutritionDisplay} onChange={e=>onChange({nutritionDisplay:e.target.value as NutritionDisplay})}>
    <option value="per-serving">Por ración</option><option value="whole-recipe">Receta completa</option><option value="per-100g">Por 100 g cuando exista dato fiable</option>
   </select>
  </section>
 </>;
}
function splitList(value:string){return Array.from(new Set(value.split(/[,;\n]/).map(v=>v.trim()).filter(Boolean))).slice(0,30)}
