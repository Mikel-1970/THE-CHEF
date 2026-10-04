import { APPROVED_LOGO_DATA_URI } from './brandLogo';

export const BRAND_NAME='¡A la mesa!';
export const BRAND_PARENT='VollDium';

export async function loadBrandImage(){
 const image=new Image();image.src=APPROVED_LOGO_DATA_URI;await image.decode();return image;
}

export function drawBrand(ctx:CanvasRenderingContext2D,image:HTMLImageElement,x:number,y:number,width:number){
 const scale=width/image.naturalWidth;
 const height=image.naturalHeight*scale;
 ctx.drawImage(image,x,y,width,height);
}

export async function brandHeaderData(){
 await document.fonts?.ready;
 const image=await loadBrandImage(),canvas=document.createElement('canvas');
 canvas.width=630;canvas.height=255;
 const ctx=canvas.getContext('2d');if(!ctx)throw Error('No se ha podido cargar la marca.');
 ctx.clearRect(0,0,canvas.width,canvas.height);
 const scale=Math.min(580/image.naturalWidth,220/image.naturalHeight);
 const w=image.naturalWidth*scale,h=image.naturalHeight*scale;
 ctx.drawImage(image,(canvas.width-w)/2,(canvas.height-h)/2,w,h);
 return canvas.toDataURL('image/png');
}
