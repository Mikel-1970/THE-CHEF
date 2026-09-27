import type {RecipeIngredient} from '../domain/types';
import type {UnitPreference} from '../services/foodPreferences';

const norm=(u:string)=>u.trim().toLocaleLowerCase('es').replace(/\./g,'');
const round=(n:number)=>n>=100?Math.round(n):n>=10?Math.round(n*10)/10:Math.round(n*100)/100;

export function convertImportedIngredient(quantity:number,unit:string,preference:UnitPreference):RecipeIngredient{
 const base:RecipeIngredient={name:'',quantity,unit,scalingMode:'linear'};
 if(preference!=='metric')return base;
 const u=norm(unit);
 const map:Record<string,{factor:number;unit:string}>={
  oz:{factor:28.3495,unit:'g'},ounce:{factor:28.3495,unit:'g'},ounces:{factor:28.3495,unit:'g'},
  lb:{factor:453.592,unit:'g'},lbs:{factor:453.592,unit:'g'},pound:{factor:453.592,unit:'g'},pounds:{factor:453.592,unit:'g'},
  'fl oz':{factor:29.5735,unit:'ml'},'fluid ounce':{factor:29.5735,unit:'ml'},'fluid ounces':{factor:29.5735,unit:'ml'},
  cup:{factor:236.588,unit:'ml'},cups:{factor:236.588,unit:'ml'},
  tbsp:{factor:14.7868,unit:'ml'},tablespoon:{factor:14.7868,unit:'ml'},tablespoons:{factor:14.7868,unit:'ml'},
  tsp:{factor:4.92892,unit:'ml'},teaspoon:{factor:4.92892,unit:'ml'},teaspoons:{factor:4.92892,unit:'ml'}
 };
 const hit=map[u];if(!hit)return base;
 return {...base,quantity:round(quantity*hit.factor),unit:hit.unit,originalQuantity:quantity,originalUnit:unit};
}

export function convertFahrenheitInText(text:string,preference:UnitPreference){
 if(preference!=='metric')return text;
 return text.replace(/(\d{2,3}(?:[.,]\d+)?)\s*°?\s*F\b/gi,(_,raw)=>`${Math.round((Number(String(raw).replace(',','.'))-32)*5/9)} °C`);
}
