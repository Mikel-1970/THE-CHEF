// Keep concrete ingredients distinct; only generic queries expand to food families.
export function normalizeFoodText(value:string):string {
 return value.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/pil[\s-]*pil/g,'pilpil').replace(/[^a-z0-9]+/g,' ').trim();
}
const STOP=new Set('a al de del el la las los un una unos unas con y o en para por que me quiero quisiera apetece prepara preparame preparar haz hazme hacer receta recetas plato platos algo tengo tenemos ingredientes ingrediente disponible disponibles usar utiliza utilizar favor puedes puedo comida cocinar comensales personas persona somos hoy minutos minuto min menos mas maximo hasta tipo'.split(' '));
const ALIASES:Record<string,string>={espaguetis:'espagueti',spaghetti:'espagueti',spaghettis:'espagueti',macarrones:'macarron',tallarines:'tallarin',langostinos:'langostino',calamares:'calamar',chipirones:'calamar',gambas:'gamba',mejillones:'mejillon',almejas:'almeja',patatas:'patata',papas:'patata',huevos:'huevo',garbanzos:'garbanzo',latas:'lata',bonito:'atun'};
const FAMILIES:Record<string,string[]>={pescado:['merluza','salmon','bacalao','atun','dorada','lubina','rape','sardina'],marisco:['gamba','langostino','mejillon','almeja','calamar'],carne:['ternera','vacuno','cerdo','cordero','pollo','pavo'],pasta:['espagueti','macarron','lasana','ravioli','tallarin','penne','tagliatelle','trofie','noquis'],arroz:['risotto','paella']};
export function foodSearchTerms(value:string):string[]{return [...new Set(normalizeFoodText(value).split(' ').filter(w=>w&&!STOP.has(w)&&!/^\d+$/.test(w)).map(w=>ALIASES[w]??w))];}
export function foodTextMatches(candidate:string,query:string):boolean {
 const terms=foodSearchTerms(query), available=new Set(foodSearchTerms(candidate));
 return terms.every(term=>available.has(term)||(FAMILIES[term]??[]).some(child=>available.has(child)));
}
export function foodTitleScore(title:string,query:string):number {
 const requested=foodSearchTerms(query), actual=foodSearchTerms(title);
 if(!requested.length)return 0;
 const hits=requested.filter(t=>actual.includes(t)).length;
 return (hits===requested.length?100:0)+hits*10-(actual.length-hits);
}
