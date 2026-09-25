import {brandHeaderData} from './brand';
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
  const brandData=await brandHeaderData();
  const blocks:HTMLElement[]=[];
  const heading=element('section','recipe-export-heading');heading.append(element('small','',recipe.cuisine+' · '+recipe.style),element('h1','',recipe.title),element('p','',recipe.description));
  const meta=element('div','recipe-export-chips');for(const text of [`${recipe.prepMinutes+recipe.cookMinutes} min`,recipe.difficulty,`${servings} ${recipe.recipeKind==='cocktail'?'copas':'comensales'}`])meta.append(element('span','',text));heading.append(meta);blocks.push(heading);
  const imageUrl=options.imageChoice==='result'&&options.resultPhotoUrl?options.resultPhotoUrl:await getRecipeImage(recipe).catch(()=>undefined);
  if(imageUrl){const img=document.createElement('img');img.className='recipe-export-photo';img.alt=recipe.title;img.src=imageUrl;await img.decode().catch(()=>undefined);if(img.naturalWidth)blocks.push(img);}
  const n=recipe.nutritionPerServing;
  if(n){const card=element('section','recipe-export-nutrition');card.append(element('small','','VALORES NUTRICIONALES ESTIMADOS'),element('h2','','Por ración'));const grid=element('div','recipe-export-nutrients');for(const [value,label] of [[n.kcal,'kcal'],[n.proteinG,'g proteína'],[n.carbsG,'g hidratos'],[n.fatG,'g grasas'],...(n.fiberG!==undefined?[[n.fiberG,'g fibra']]:[])] as [number,string][]){const cell=element('div');cell.append(element('strong','',String(Math.round(value))),element('span','',label));grid.append(cell);}card.append(grid,element('p','recipe-export-note','Estimación de la formulación original; los ingredientes, las marcas y el escalado culinario pueden modificar los valores.'));blocks.push(card);}
  let chapter='ingredients';
  const addCard=(title:string,rows:string[])=>{for(let start=0;start<rows.length;start+=18){const card=element('section','recipe-export-card');card.dataset.chapter=chapter;card.append(element('h2','',title+(start?' · continuación':'')));for(const row of rows.slice(start,start+18))card.append(element('p','',row));blocks.push(card);}};
  const ingredients=recipe.ingredients.map(i=>`${i.name} · ${formatQuantity(scaleQuantity(i,recipe.baseServings,servings))} ${i.unit}${i.optional?' (opcional)':''}`);
  addCard(`Ingredientes · ${servings} ${recipe.recipeKind==='cocktail'?'copas':'comensales'}`,ingredients);
  chapter='advice';
  addCard('Mise en place',recipe.miseEnPlace.map((s,i)=>`${i+1}. ${s}`));
  addCard('Recomendaciones',recipe.substitutions);addCard('Puntos críticos',recipe.criticalPoints);if(recipe.storage)addCard('Conservación',[recipe.storage]);
  const techniques=getTechniquesForRecipe(recipe).filter(t=>/emulsion|sous.vide|vacío|ferment|esferific|confit|atemper|clarific/i.test(t.title));if(techniques.length){const card=element('section','recipe-export-card');card.dataset.chapter=chapter;card.append(element('h2','','Técnicas utilizadas'));const chips=element('div','recipe-export-chips');techniques.forEach(t=>chips.append(element('span','',t.title)));card.append(chips);blocks.push(card);}
  chapter='steps';
  for(const step of recipe.steps)addCard(`Paso ${step.number}`, [scaleStepInstruction(recipe,step.instruction,servings),...(step.minutes?[`${step.minutes} min${step.temperatureC?' · '+step.temperatureC+' °C':''}`]:step.temperatureC?[`${step.temperatureC} °C`]:[]),...(step.cue?['Fíjate en esto: '+step.cue]:[])]);
  const pages:HTMLElement[]=[];let content:HTMLElement;
  const newPage=()=>{const page=element('article','recipe-export-page');const header=element('header','recipe-export-brand');const logo=document.createElement('img');logo.src=brandData;logo.alt='Chef Voldi by VollDium';header.append(logo);content=element('main','recipe-export-content');page.append(header,content,element('footer','recipe-export-footer'));host.append(page);pages.push(page);};newPage();
  let currentChapter='cover';content!.dataset.chapter=currentChapter;
  for(const block of blocks){const nextChapter=block.dataset.chapter??'cover';if(nextChapter!==currentChapter){newPage();currentChapter=nextChapter;}content!.dataset.chapter=currentChapter;content!.append(block);
    if(currentChapter==='cover'&&content!.scrollHeight>content!.clientHeight){const photo=content!.querySelector<HTMLImageElement>('.recipe-export-photo');if(photo){const excess=content!.scrollHeight-content!.clientHeight;photo.style.maxHeight=Math.max(100,photo.height-excess-8)+'px';}}
if(content!.scrollHeight>content!.clientHeight){block.remove();if(content!.children.length)newPage();content!.dataset.chapter=currentChapter;content!.append(block);
    // Long generated paragraphs are split into readable cards, never cropped or shrunk.
    if(content!.scrollHeight>content!.clientHeight){block.remove();const title=block.querySelector('h2,h1')?.textContent??'Receta';const words=(block.textContent??'').replace(title,'').trim().split(/\s+/);let chunk='';for(const word of words){if(chunk.length+word.length>600){addOverflow(title,chunk);chunk='';}chunk+=(chunk?' ':'')+word;}if(chunk)addOverflow(title,chunk);}
  }}
  function addOverflow(title:string,text:string){const card=element('section','recipe-export-card');card.append(element('h2','',title),element('p','',text));content!.append(card);if(content!.scrollHeight>content!.clientHeight){card.remove();newPage();content!.append(card);}}
  const doc=new jsPDF({unit:'mm',format:'a4',orientation:'portrait'});
  for(let i=0;i<pages.length;i++){pages[i].querySelector('footer')!.textContent=`${avatarName(options.avatarId)} · ${options.userName?.trim()||'Chef Voldi by VollDium'} · ${i+1} / ${pages.length}`;await Promise.all(Array.from(pages[i].querySelectorAll('img')).map(img=>img.decode().catch(()=>undefined)));const canvas=await html2canvas(pages[i],{scale:1.7,backgroundColor:'#f7f1e6',logging:false,useCORS:true});if(i)doc.addPage();doc.addImage(canvas.toDataURL('image/jpeg',.9),'JPEG',0,0,210,297,undefined,'FAST');}
  const blob=doc.output('blob'),safe=recipe.title.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9_-]+/g,'-').replace(/^-|-$/g,'').toLowerCase()||'receta';const file=new File([blob],`${safe}.pdf`,{type:'application/pdf'});
  if(navigator.share&&navigator.canShare?.({files:[file]})){try{await navigator.share({title:recipe.title,text:`Receta · ${recipe.title}`,files:[file]});return 'shared';}catch(error){if(error instanceof DOMException&&error.name==='AbortError')throw error;}}
  const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=file.name;a.click();window.setTimeout(()=>URL.revokeObjectURL(url),2000);return 'downloaded';
 }finally{host.remove();}
}
