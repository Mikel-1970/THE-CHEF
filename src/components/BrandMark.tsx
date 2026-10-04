import './BrandMark.css';
import { APPROVED_LOGO_DATA_URI } from '../services/brandLogo';

export function BrandMark({compact=false,variant='default'}:{compact?:boolean;variant?:'default'|'light'}){
  const src=variant==='light'
    ? `${import.meta.env.BASE_URL}brand/a-la-mesa-logo-light.svg`
    : APPROVED_LOGO_DATA_URI;
  return <span className={`brand-mark alm-brand-mark ${compact?'brand-mark-compact':''} ${variant==='light'?'brand-mark-light':''}`}>
    <img src={src} alt="¡A la mesa!" draggable={false}/>
  </span>;
}
