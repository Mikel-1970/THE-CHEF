import {brandBoard,BRAND_REGIONS} from '../services/brand';
import './BrandMark.css';
/** Display windows into the supplied artwork. The source pixels are not regenerated. */
export function BrandCrop({part}:{part:keyof typeof BRAND_REGIONS}){
 const [x,y,w,h]=BRAND_REGIONS[part];
 return <span className={`brand-crop brand-crop-${part}`} style={{aspectRatio:`${w}/${h}`}}><img src={brandBoard()} alt="" style={{width:`${1448/w*100}%`,maxWidth:'none',height:'auto',left:`${-x/w*100}%`,top:`${-y/h*100}%`}}/></span>;
}
export function BrandMark({compact=false}:{compact?:boolean}){return <div className={`brand-mark ${compact?'brand-mark-compact':''}`} role="img" aria-label="Chef Voldi by VollDium"><BrandCrop part="icon"/><BrandCrop part="wordmark"/></div>}
