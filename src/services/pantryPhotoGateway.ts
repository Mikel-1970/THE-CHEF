import type { Recipe } from '../domain/types';
import { evaluateDishPhoto } from './mediaGateway';

const instruction = 'Devuelve en summary SOLO JSON: {"ingredients":["tomate","huevo"]}. Esta foto muestra una NEVERA O DESPENSA, no un plato: identifica hasta 4 alimentos principales claramente visibles para cocinar. Nombres cortos en español, sin cantidades ni marcas. No inventes alimentos ocultos o dudosos. Devuelve menos de 4 si no ves más; lista vacía si no hay alimentos identificables.';
const reference: Recipe = {id:'pantry-visual-identification',title:'Identificar ingredientes de nevera o despensa',description:instruction,emoji:'🥕',baseServings:1,prepMinutes:0,cookMinutes:0,difficulty:'Fácil',mealType:'Comida',style:'Inventario visual',cuisine:'No evaluar un plato',ingredients:[],miseEnPlace:[],steps:[],criticalPoints:[instruction],substitutions:[],storage:'',nutritionPerServing:{kcal:0,proteinG:0,carbsG:0,fatG:0}};
export function parsePantryPhotoSummary(summary:string):string[] {
 const text=summary.trim().replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,'');
 let parsed:unknown;try{parsed=JSON.parse(text)}catch{throw new Error('No se han podido identificar ingredientes con claridad. Prueba otra foto o añádelos a mano.')}
 if(!parsed||typeof parsed!=='object'||!Array.isArray((parsed as {ingredients?:unknown}).ingredients))throw new Error('La identificación no ha llegado completa. Prueba otra foto.');
 const result:string[]=[];
 for(const value of (parsed as {ingredients:unknown[]}).ingredients){
  if(typeof value!=='string')continue;const name=value.trim();
  if(!name||name.length>60||/[\n\r<>]/.test(name))continue;
  if(!result.some(v=>v.toLocaleLowerCase('es')===name.toLocaleLowerCase('es')))result.push(name);
  if(result.length===4)break;
 }
 return result;
}
export async function identifyPantryPhoto(file:File) {
 if(!file.type.startsWith('image/'))throw new Error('Elige un archivo de imagen.');
 if(file.size>15*1024*1024)throw new Error('La foto es demasiado grande. Elige una de menos de 15 MB.');
 const result=await evaluateDishPhoto(reference,file);
 return {ingredients:parsePantryPhotoSummary(result.evaluation.summary),previewUrl:result.previewUrl};
}
