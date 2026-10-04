import type {Recipe} from '../domain/types';

const normalize=(s:string)=>s.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
function duplicate(a:string,b:string):boolean {
 const x=normalize(a),y=normalize(b);
 if(x===y)return true;
 // Preserve different quantities, temperatures and negations even when the wording is close.
 if((x.match(/\b\d+\b/g)??[]).join()!==(y.match(/\b\d+\b/g)??[]).join()||/\bno\b/.test(x)!==/\bno\b/.test(y))return false;
 const words=(s:string)=>new Set(s.split(' ').filter(w=>w.length>2&&!['los','las','del','una','por','para','con','puedes'].includes(w)));
 const aa=words(x),bb=words(y), common=[...aa].filter(w=>bb.has(w)).length;
 return Math.min(aa.size,bb.size)>=4&&common/Math.max(aa.size,bb.size)>=.9;
}
export function cleanRecipeAdvice(recipe:Recipe):Recipe {
 const seen:string[]=[];
 const clean=(rows:string[])=>rows.flatMap(row=>{
  const sentences=row.trim().split(/(?<=[.!?])\s+(?=[A-ZÁÉÍÓÚÑ¿])/).filter(Boolean);
  const unique=sentences.filter(sentence=>{if(seen.some(previous=>duplicate(previous,sentence)))return false;seen.push(sentence);return true;});
  return unique.length?[unique.join(' ')]:[];
 });
 // Safety advice stays in Puntos críticos when a generator repeats it elsewhere.
 const criticalPoints=clean(recipe.criticalPoints??[]);
 const miseEnPlace=clean(recipe.miseEnPlace??[]);
 const substitutions=clean(recipe.substitutions??[]);
 return {...recipe,criticalPoints,miseEnPlace,substitutions};
}
