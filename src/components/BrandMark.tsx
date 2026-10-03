import './BrandMark.css';
import p1 from '../assets/brandLogoPart1';
import p2 from '../assets/brandLogoPart2';
import p3 from '../assets/brandLogoPart3';

const APPROVED_LOGO = 'data:image/png;base64,' + p1 + p2 + p3;

export function BrandMark({compact=false}:{compact?:boolean}){
  return <span className={`brand-mark alm-brand-mark ${compact?'brand-mark-compact':''}`}>
    <img src={APPROVED_LOGO} alt="¡A la mesa!" draggable={false}/>
  </span>;
}
