export const BRAND_NAME='¡A la mesa!';
export const BRAND_PARENT='VollDium';
export const BRAND_REGIONS={icon:[0,0,64,64],wordmark:[0,0,64,64]} as const;
export const brandBoard=()=>`${import.meta.env.BASE_URL}favicon.svg`;

export async function loadBrandImage(){
 const image=new Image();image.src=brandBoard();await image.decode();return image;
}

export function drawBrand(ctx:CanvasRenderingContext2D,image:HTMLImageElement,x:number,y:number,width:number){
 const height=width*.24,icon=height*.9;
 ctx.save();
 ctx.drawImage(image,x,y,icon,icon);
 ctx.fillStyle='#123f2e';
 ctx.textBaseline='middle';
 ctx.font=`800 ${Math.max(24,height*.48)}px "Fraunces","Playfair Display",Georgia,serif`;
 ctx.fillText('¡A la mesa!',x+icon+height*.08,y+height*.49);
 ctx.fillStyle='#d94820';
 ctx.beginPath();ctx.arc(x+icon+height*.035,y+height*.49,Math.max(2,height*.024),0,Math.PI*2);ctx.fill();
 ctx.restore();
}

export async function brandHeaderData(){
 await document.fonts?.ready;
 const image=await loadBrandImage(),canvas=document.createElement('canvas');canvas.width=630;canvas.height=153;
 const ctx=canvas.getContext('2d');if(!ctx)throw Error('No se ha podido cargar la marca.');
 drawBrand(ctx,image,0,8,630);return canvas.toDataURL('image/png');
}