import type {CookingRequest} from '../domain/types';
import {interpretDesireText} from '../services/requestInterpreter';

export const CUISINE_REQUIRED='¿Qué tipo de cocina quieres? Selecciona al menos una cocina y el chef elegirá un plato típico para ti.';
const normalize=(text:string)=>text.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();

// Only discard choice phrases and general preferences. Unknown food names remain constraints.
export function isChefChoice(request:CookingRequest):boolean {
 if(request.mode!=='desire'||request.mainProduct?.trim()||request.technique?.trim())return false;
 return !desireFoodText(request);
}

export function desireFoodText(request:CookingRequest):string {
 let text=normalize((request.desireText??'').split('\n')[0]);
 const cuisine=request.cuisine||interpretDesireText(text).cuisine;
 if(cuisine)text=text.replace(new RegExp('\\b'+normalize(cuisine).replace(/a$/, '[ao]?').split(' ').join('\\s+')+'\\b','g'),' ');
 text=text.replace(/\b(lo que (?:tu |el chef )?quieras?|a (?:tu |su )?eleccion|a (?:tu |su )?gusto|sorprendeme|elige (?:tu|el chef)|decide tu|elige por mi|no se que (?:comer|cocinar)|me da igual|cualquier cosa)\b/g,' ');
 text=text.replace(/\b(?:quiero|quisiera|me|apetece|prepara|preparame|preparar|haz|hazme|hacer|cocina|cocinar|comer|una?|el|la|de|del|que|tu|para|por|favor|algo|cualquier|receta|plato|comida|cena|desayuno|tipo|estilo|tipico|tipica|tradicional|casero|casera|saludable|rapido|rapida|facil|sencillo|sencilla|personas?|comensales?|somos|hoy|cinco|dos|tres|cuatro|seis|siete|ocho|nueve|diez)\b/g,' ').replace(/\b\d+\b/g,' ').trim();
 return text;
}

export function prepareDesireRequest(request:CookingRequest):CookingRequest {
 if(request.mode!=='desire')return request;
 const cuisine=request.cuisine?.trim()||interpretDesireText(request.desireText??'').cuisine;
 const prepared={...request,cuisine};
 if(!isChefChoice(prepared))return prepared;
 if(!cuisine||normalize(cuisine)==='indiferente')throw new Error(CUISINE_REQUIRED);
 const original=(request.desireText??'').split('\n')[0].trim();
 return {...prepared,desireText:original+'\nElección del chef: elige un plato típico y representativo de la cocina '+cuisine+'. No se ha pedido un plato ni un producto concreto. Prepara la receta para '+request.servings+' comensales y respeta todas las restricciones, exclusiones y opciones indicadas.'};
}

export function matchesChosenCuisine(actual:string,expected?:string){
 if(!expected)return true;
 return normalize(actual)===normalize(expected);
}
