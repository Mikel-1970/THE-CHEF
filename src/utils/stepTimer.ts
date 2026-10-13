import type { RecipeStep } from '../domain/types';
/** Only an explicit, unambiguous cooking/wait duration can start a timer.
 * Step.minutes remains an estimate and is never used as a countdown fallback. */
export function stepTimerSeconds(step?:RecipeStep):number {
 if(!step)return 0;
 const text=step.instruction.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const times=[...text.matchAll(/\b(\d+(?:[.,]\d+)?)\s*(segundos?|segs?|minutos?|min|horas?)\b/g)];
 if(times.length!==1)return 0;
 const time=times[0],before=text.slice(0,time.index);
 if(/\d\s*(?:-|–|a|o|y)\s*$/.test(before))return 0;
 const clause=before.split(/[.;!?]/).pop()??'';
 if(!/\b(?:horne\w*|cuece|cocer|cocina\w*|coccion|hierve|hervir|herv\w*|repos\w*|refriger\w*|enfri\w*|templ\w*|marin\w*|ferment\w*|remoja\w*|remojar|esper\w*)\b/.test(clause))return 0;
 const value=Number(time[1].replace(',','.'));const multiplier=time[2].startsWith('h')?3600:time[2].startsWith('m')?60:1;
 return Number.isFinite(value)&&value>0?Math.round(value*multiplier):0;
}
