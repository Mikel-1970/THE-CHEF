import type {Recipe} from '../domain/types';
export type SocialFormat='post'|'story';
export function socialAppUrl(){return new URL(import.meta.env.BASE_URL,location.origin).href;}
export function socialCaption(recipe:Recipe,servings:number){return `${recipe.title}\n${recipe.prepMinutes+recipe.cookMinutes} min · ${servings} ${recipe.recipeKind==='cocktail'?'copas':'comensales'}\nPreparado con The Chef. Descubre la app:\n${socialAppUrl()}\n#TheChef #Cocina` ;}

/** Local composition of the existing photo. No generation, uploads or new AI calls. */
export async function createSocialCard(recipe:Recipe,servings:number,format:SocialFormat,imageUrl:string):Promise<File>{
 await document.fonts.ready;
 const photo=new Image();photo.crossOrigin='anonymous';photo.src=imageUrl;await photo.decode();
 const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=format==='story'?1920:1350;
 const ctx=canvas.getContext('2d');if(!ctx)throw new Error('No se ha podido preparar la tarjeta.');
 const h=canvas.height;ctx.fillStyle='#f7f1e6';ctx.fillRect(0,0,1080,h);
 const text=(value:string,x:number,y:number,size:number,color='#405526',serif=false)=>{ctx.fillStyle=color;ctx.font=`${serif?'700':'600'} ${size}px ${serif?'"Playfair Display", Georgia':'"DM Sans", sans-serif'}`;ctx.fillText(value,x,y);};
 const top=format==='story'?160:64;
 text('THE CHEF',64,top,44);text('COCINA A TU MANERA',64,top+43,22,'#718252');
 const photoY=top+80,photoH=format==='story'?820:650;
 ctx.save();ctx.beginPath();ctx.roundRect(48,photoY,984,photoH,32);ctx.clip();ctx.fillStyle='#e8e7d7';ctx.fillRect(48,photoY,984,photoH);
 // Keep the complete dish in the frame; portrait photos also remain uncropped.
 const scale=Math.min(984/photo.naturalWidth,photoH/photo.naturalHeight),w=photo.naturalWidth*scale,ph=photo.naturalHeight*scale;
 ctx.drawImage(photo,48+(984-w)/2,photoY+(photoH-ph)/2,w,ph);ctx.restore();
 const linesFor=(value:string,size:number)=>{ctx.font=`700 ${size}px "Playfair Display", Georgia`;const lines:string[]=[];let line='';for(const word of value.split(/\s+/)){if(line&&ctx.measureText(line+' '+word).width>952){lines.push(line);line='';}if(ctx.measureText(word).width>952){for(const char of word){if(ctx.measureText(line+char).width>952){lines.push(line);line='';}line+=char;}}else line+=(line?' ':'')+word;}if(line)lines.push(line);return lines;};
 let size=60,lines=linesFor(recipe.title,size);while(lines.length>4&&size>36){size-=2;lines=linesFor(recipe.title,size);}
 if(lines.length>4){lines=lines.slice(0,4);lines[3]=lines[3].slice(0,-3)+'…';}
 let y=photoY+photoH+76;for(const line of lines){text(line,64,y,size,'#344529',true);y+=size*1.22;}
 text(`${recipe.prepMinutes+recipe.cookMinutes} min  ·  ${servings} ${recipe.recipeKind==='cocktail'?'copas':'comensales'}`,64,y+26,28);
 const footerY=h-(format==='story'?190:95);ctx.fillStyle='#405526';ctx.beginPath();ctx.roundRect(48,footerY,984,64,22);ctx.fill();text('Descubre The Chef · Enlace en el texto',80,footerY+42,26,'#fffaf1');
 const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('No se ha podido crear la imagen.')),'image/png'));
 const name=recipe.title.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9]+/g,'-').slice(0,70).replace(/^-|-$/g,'').toLowerCase()||'receta';
 return new File([blob],`${name}-${format==='story'?'historia':'publicacion'}-the-chef.png`,{type:'image/png'});
}
export function downloadSocialCard(file:File){const url=URL.createObjectURL(file);const a=document.createElement('a');a.href=url;a.download=file.name;a.click();window.setTimeout(()=>URL.revokeObjectURL(url),60000);}
