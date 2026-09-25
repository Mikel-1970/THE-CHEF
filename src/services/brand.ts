export const BRAND_NAME='Chef Voldi';
export const BRAND_PARENT='VollDium';
export const BRAND_REGIONS={icon:[543,227,260,263],wordmark:[1038,291,385,123]} as const;
export const brandBoard=()=>`${import.meta.env.BASE_URL}brand/chef-voldi-board.png`;
export async function loadBrandImage(){const image=new Image();image.src=brandBoard();await image.decode();return image;}
export function drawBrand(ctx:CanvasRenderingContext2D,image:HTMLImageElement,x:number,y:number,width:number){
 const height=width/(260/263+385/123+.1),iconWidth=height*260/263;ctx.drawImage(image,...BRAND_REGIONS.icon,x,y,iconWidth,height);ctx.drawImage(image,...BRAND_REGIONS.wordmark,x+iconWidth+height*.1,y,height*385/123,height);
}
export async function brandHeaderData(){const image=await loadBrandImage(),canvas=document.createElement('canvas');canvas.width=630;canvas.height=153;const ctx=canvas.getContext('2d');if(!ctx)throw Error('No se ha podido cargar la marca.');drawBrand(ctx,image,0,0,630);return canvas.toDataURL('image/png');}
