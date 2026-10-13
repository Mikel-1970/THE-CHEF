import { BrandMark } from './BrandMark';

export function AlmPageHeader({eyebrow,title,subtitle,accent}:{eyebrow?:string;title:string;subtitle?:string;accent?:string}){
  return <header className="alm-derived-header">
    <div className="alm-derived-brand-row">
      <BrandMark compact/>
      {accent&&<span className="alm-hand">{accent}</span>}
    </div>
    {eyebrow&&<span className="eyebrow">{eyebrow}</span>}
    <h1>{title}</h1>
    {subtitle&&<p>{subtitle}</p>}
  </header>;
}
