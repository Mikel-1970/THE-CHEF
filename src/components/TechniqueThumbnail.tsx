import { Camera } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { getTechniqueImage } from '../services/mediaGateway';
import type { Technique } from '../services/techniqueGateway';

export function TechniqueThumbnail({ technique, eager=false }: { technique: Technique; eager?: boolean }) {
  const host=useRef<HTMLDivElement>(null);
  const [visible,setVisible]=useState(eager);
  const [url,setUrl]=useState<string>();
  const [failed,setFailed]=useState(false);

  useEffect(()=>{
    if(visible||!host.current)return;
    if(!('IntersectionObserver' in window)){setVisible(true);return;}
    const observer=new IntersectionObserver(entries=>{
      if(entries.some(entry=>entry.isIntersecting)){setVisible(true);observer.disconnect();}
    },{rootMargin:'280px'});
    observer.observe(host.current);
    return()=>observer.disconnect();
  },[visible]);

  useEffect(()=>{
    if(!visible)return;
    let disposed=false;
    let objectUrl:string|undefined;
    setFailed(false);
    setUrl(undefined);
    void getTechniqueImage(technique).then(value=>{
      objectUrl=value;
      if(disposed){if(value?.startsWith('blob:'))URL.revokeObjectURL(value);return;}
      if(!disposed&&value)setUrl(value);
      else if(!disposed)setFailed(true);
    }).catch(()=>{if(!disposed)setFailed(true)});
    return()=>{
      disposed=true;
      if(objectUrl?.startsWith('blob:'))URL.revokeObjectURL(objectUrl);
    };
  },[visible,technique.id]);

  return <div ref={host} className="technique-photo-media">
    {url?<img src={url} alt={`Ejemplo visual de ${technique.title}`} loading="lazy" onError={()=>{setUrl(undefined);setFailed(true)}}/>:
      <div className="technique-photo-placeholder" aria-label={failed?'Imagen no disponible':'Preparando imagen'}>
        <Camera size={25}/><span>{failed?'Vista técnica':'Preparando foto…'}</span>
      </div>}
  </div>;
}
