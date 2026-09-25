import {jsPDF} from 'jspdf';
import html2canvas from 'html2canvas';
import type {Recipe} from '../domain/types';
import {avatarName} from '../data/avatarNames';
import {getRecipeImage} from './mediaGateway';
import {formatQuantity,scaleQuantity} from '../utils/scaling';
import {scaleStepInstruction} from '../utils/scaleStepInstruction';
import {getTechniquesForRecipe} from './techniqueResolver';
import './recipePdf.css';
type PdfOptions={avatarId?:string;userName?:string;imageChoice?:'ai'|'result';resultPhotoUrl?:string};
function element(tag:string,className='',text?:string){const el=document.createElement(tag);el.className=className;if(text!==undefined)el.textContent=text;return el;}
/** Render with the app's fonts, colours and cards; paginate whole blocks before rasterising. */
export async function shareRecipePdf(recipe:Recipe,servings:number,options:PdfOptions={}):Promise<'shared'|'downloaded'>{
 const host=element('div','recipe-export-host');document.body.append(host);
 try{
  await document.fonts.ready;
  const blocks:HTMLElement[]=[];
  const heading=element('section','recipe-export-heading');heading.append(element('small','',recipe.cuisine+' · '+recipe.style),element('h1','',recipe.title),element('p','',recipe.description));
  const meta=element('div','recipe-export-chips');for(const text of [`${recipe.prepMinutes+recipe.cookMinutes} min`,recipe.difficulty,`${servings} ${recipe.recipeKind==='cocktail'?'copas':'comensales'}`])meta.append(element('span','',text));heading.append(meta);blocks.push(heading);
  const imageUrl=options.imageChoice==='result'&&options.resultPhotoUrl?options.resultPhotoUrl:await getRecipeImage(recipe).catch(()=>undefined);
  if(imageUrl){const img=document.createElement('img');img.className='recipe-export-photo';img.alt=recipe.title;img.src=imageUrl;await img.decode().catch(()=>undefined);if(img.naturalWidth)blocks.push(img);}
  const n=recipe.nutritionPerServing;
  if(n){const card=element('section','recipe-export-nutrition');card.append(element('small','','VALORES NUTRICIONALES ESTIMADOS'),element('h2','','Por ración'));const grid=element('div','recipe-export-nutrients');for(const [value,label] of [[n.kcal,'kcal'],[n.proteinG,'g proteína'],[n.carbsG,'g hidratos'],[n.fatG,'g grasas'],...(n.fiberG!==undefined?[[n.fiberG,'g fibra']]:[])] as [number,string][]){const cell=element('div');cell.append(element('strong','',String(Math.round(value))),element('span','',label));grid.append(cell);}card.append(grid,element('p','recipe-export-note','Estimación de la formulación original; los ingredientes, las marcas y el escalado culinario pueden modificar los valores.'));blocks.push(card);}
  const addCard=(title:string,rows:string[])=>{for(let start=0;start<rows.length;start+=6){const card=element('section','recipe-export-card');card.append(element('h2','',title+(start?' · continuación':'')));for(const row of rows.slice(start,start+6))card.append(element('p','',row));blocks.push(card);}};
  const ingredients=recipe.ingredients.map(i=>`${i.name} · ${formatQuantity(scaleQuantity(i,recipe.baseServings,servings))} ${i.unit}${i.optional?' (opcional)':''}`);
  addCard(`Ingredientes · ${servings} ${recipe.recipeKind==='cocktail'?'copas':'comensales'}`,ingredients);
  addCard('Mise en place',recipe.miseEnPlace.map((s,i)=>`${i+1}. ${s}`));
  const techniques=getTechniquesForRecipe(recipe);if(techniques.length){const card=element('section','recipe-export-card');card.append(element('h2','','Técnicas utilizadas'));const chips=element('div','recipe-export-chips');techniques.forEach(t=>chips.append(element('span','',t.title)));card.append(chips);blocks.push(card);}
  for(const step of recipe.steps)addCard(`Paso ${step.number}`, [scaleStepInstruction(recipe,step.instruction,servings),...(step.minutes?[`${step.minutes} min${step.temperatureC?' · '+step.temperatureC+' °C':''}`]:step.temperatureC?[`${step.temperatureC} °C`]:[]),...(step.cue?['Fíjate en esto: '+step.cue]:[])]);
  if(recipe.nutritionNotes?.length)addCard('Sobre la estimación nutricional',recipe.nutritionNotes);
  addCard('Puntos críticos',recipe.criticalPoints);addCard('Recomendaciones',recipe.substitutions);if(recipe.storage)addCard('Conservación',[recipe.storage]);
  const pages:HTMLElement[]=[];let content:HTMLElement;
  const newPage=()=>{const page=element('article','recipe-export-page');const header=element('header','recipe-export-brand','The Chef');content=element('main','recipe-export-content');page.append(header,content,element('footer','recipe-export-footer'));host.append(page);pages.push(page);};newPage();
  for(const block of blocks){content!.append(block);if(content!.scrollHeight>content!.clientHeight){block.remove();if(content!.children.length)newPage();content!.append(block);
    // Long generated paragraphs are split into readable cards, never cropped or shrunk.
    if(content!.scrollHeight>content!.clientHeight){block.remove();const title=block.querySelector('h2,h1')?.textContent??'Receta';const words=(block.textContent??'').replace(title,'').trim().split(/\s+/);let chunk='';for(const word of words){if(chunk.length+word.length>600){addOverflow(title,chunk);chunk='';}chunk+=(chunk?' ':'')+word;}if(chunk)addOverflow(title,chunk);}
  }}
  function addOverflow(title:string,text:string){const card=element('section','recipe-export-card');card.append(element('h2','',title),element('p','',text));content!.append(card);if(content!.scrollHeight>content!.clientHeight){card.remove();newPage();content!.append(card);}}
  const doc=new jsPDF({unit:'mm',format:'a4',orientation:'portrait'});
  for(let i=0;i<pages.length;i++){pages[i].querySelector('footer')!.textContent=`${avatarName(options.avatarId)} · ${options.userName?.trim()||'The Chef'} · ${i+1} / ${pages.length}`;const canvas=await html2canvas(pages[i],{scale:1.7,backgroundColor:'#f7f1e6',logging:false,useCORS:true});if(i)doc.addPage();doc.addImage(canvas.toDataURL('image/jpeg',.9),'JPEG',0,0,210,297,undefined,'FAST');}
  const blob=doc.output('blob'),safe=recipe.title.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9_-]+/g,'-').replace(/^-|-$/g,'').toLowerCase()||'receta';const file=new File([blob],`${safe}.pdf`,{type:'application/pdf'});
  if(navigator.share&&navigator.canShare?.({files:[file]})){try{await navigator.share({title:recipe.title,text:`Receta · ${recipe.title}`,files:[file]});return 'shared';}catch(error){if(error instanceof DOMException&&error.name==='AbortError')throw error;}}
  const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=file.name;a.click();window.setTimeout(()=>URL.revokeObjectURL(url),2000);return 'downloaded';
 }finally{host.remove();}
}
