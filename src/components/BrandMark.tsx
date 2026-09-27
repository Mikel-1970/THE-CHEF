import './BrandMark.css';

export function BrandMark({compact=false}:{compact?:boolean}){
  return <div className={`brand-mark alm-brand-mark ${compact?'brand-mark-compact':''}`} role="img" aria-label="¡A la mesa!">
    <span className="alm-wordmark">
      <span className="alm-line alm-line-top"><b>¡A</b><span>la</span><ClocheMark/></span>
      <span className="alm-line alm-line-bottom">mesa<b>!</b></span>
    </span>
  </div>
}

function ClocheMark(){
  return <span className="alm-cloche" aria-hidden="true">
    <svg viewBox="0 0 92 72" focusable="false">
      <path className="alm-cloche-lid" d="M17 36c3-18 14-27 29-27s26 9 29 27H17Z"/>
      <path className="alm-cloche-rim" d="M11 39h70"/>
      <path className="alm-cloche-plate" d="M24 50h44c-4 9-12 14-22 14S28 59 24 50Z"/>
      <path className="alm-steam" d="M39 28c-7-8 5-11-1-18M52 27c-7-8 5-11-1-18"/>
      <circle className="alm-cloche-knob" cx="46" cy="5" r="4"/>
      <path className="alm-rays" d="M81 27l8-4M83 35h8M80 43l8 4"/>
    </svg>
  </span>
}