import fs from 'node:fs';
const path='src/data/library/recipes.json';
const recipes=JSON.parse(fs.readFileSync(path,'utf8'));
const foods=JSON.parse(fs.readFileSync('src/data/library/nutrition-ingredients.json','utf8'));
const audit=[];
for(const recipe of recipes){
 const totals={kcal:0,proteinG:0,carbsG:0,fatG:0};const rows=[];
 for(const i of recipe.ingredients){
  const food=foods[i.name];if(!food)throw Error('Unmapped ingredient: '+i.name);
  let amount=i.quantity;
  if(i.unit==='unidad'){if(!food.gramsPerUnitEstimate)throw Error('Unit weight missing: '+i.name);amount*=food.gramsPerUnitEstimate;}
  else if(i.unit==='ml'&&food.basis!=='100ml')amount*=food.densityEstimate;
  else if(!['g','ml'].includes(i.unit))throw Error('Unknown unit: '+i.unit);
  amount*=food.edibleFractionEstimate;
  const assumption=(i.name.includes('freír')||(['lib-051','lib-055'].includes(recipe.id)&&i.name==='aceite de oliva'))?'Aceite absorbido estimado: 10 g por ración, limitado al aceite utilizado.':undefined;
  if(assumption)amount=Math.min(amount,recipe.baseServings*10);
  if(i.optional)amount=0;
  for(const key of Object.keys(totals)){const n=food.per100[key];if(!Number.isFinite(n))throw Error('Missing nutrient: '+i.name+' '+key);totals[key]+=n*amount/100;}
  rows.push({ingredient:i.name,amountUsed:Math.round(amount*100)/100,basis:food.basis,source:food.source,code:food.code,optionalExcluded:!!i.optional,...(assumption?{assumption}:{})});
 }
 recipe.nutritionPerServing=Object.fromEntries(Object.entries(totals).map(([k,v])=>[k,Math.round(v/recipe.baseServings*10)/10]));
 recipe.nutritionStatus='estimated';
 recipe.nutritionNotes=['Estimación por ingredientes basada en CoFID 2021 y USDA SR Legacy 2018. Se usan alimentos representativos; las marcas y la preparación pueden cambiar los valores.','Se excluyen ingredientes opcionales. Los pesos por unidad, densidades y partes comestibles son estimados.'];
 if(recipe.ingredients.some(i=>i.name.includes('freír')))recipe.nutritionNotes.push('Fritura: se estiman 10 g de aceite absorbido por ración; puede variar considerablemente.');
 if(recipe.ingredients.some(i=>foods[i.name].basis==='100ml'))recipe.nutritionNotes.push('Se incluye toda la energía del alcohol añadido; la cocción puede reducirla.');
 if(recipe.ingredients.some(i=>foods[i.name].code==='composite'))recipe.nutritionNotes.push('Ñoquis y sirope simple, cuando aparecen, se calculan mediante formulaciones aproximadas.');
 audit.push({id:recipe.id,baseServings:recipe.baseServings,ingredients:rows,nutritionPerServing:recipe.nutritionPerServing});
}
if(process.argv.includes('--check')){const stored=JSON.parse(fs.readFileSync(path,'utf8'));for(let n=0;n<recipes.length;n++)if(JSON.stringify(stored[n].nutritionPerServing)!==JSON.stringify(recipes[n].nutritionPerServing))throw Error('Stale nutrition: '+stored[n].id);console.log('170 nutrition calculations reproduced.');}
else{fs.writeFileSync(path,JSON.stringify(recipes,null,2)+'\n');fs.writeFileSync('docs/LIBRARY_NUTRITION_AUDIT.json',JSON.stringify(audit,null,2)+'\n');console.log('Calculated nutrition for '+recipes.length+' recipes.');}
