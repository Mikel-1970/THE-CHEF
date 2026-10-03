import './BrandMark.css';
import p1 from '../assets/brandLogoPart1';
import p2 from '../assets/brandLogoPart2';
import p3 from '../assets/brandLogoPart3';

const APPROVED_LOGO = 'data:image/png;base64,' + p1 + p2 + p3;

export function BrandMark({compact=false,variant='default'}:{compact?:boolean;variant?:'default'|'light'}){
  const src=variant==='light'
    ? `${import.meta.env.BASE_URL}brand/a-la-mesa-logo-light.svg`
    : APPROVED_LOGO;
  return <span className={`brand-mark alm-brand-mark ${compact?'brand-mark-compact':''} ${variant==='light'?'brand-mark-light':''}`}>
    <img src={src} alt="¡A la mesa!" draggable={false}/>
  </span>;
}
