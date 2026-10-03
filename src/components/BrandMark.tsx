import './BrandMark.css';

export function BrandMark({compact=false}:{compact?:boolean}){
  const src=`${import.meta.env.BASE_URL}brand/a-la-mesa-logo.png`;
  return <span className={`brand-mark alm-brand-mark ${compact?'brand-mark-compact':''}`}>
    <img src={src} alt="¡A la mesa!" draggable={false}/>
  </span>;
}
