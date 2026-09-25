import { Camera } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import manifest from '../data/techniqueImageManifest.json';
import { getCachedTechniqueImage, getTechniqueImage } from '../services/mediaGateway';
import type { Technique } from '../services/techniqueGateway';

type StaticImageEntry={thumb:string;detail:string};
const staticItems=manifest.items as Record<string,StaticImageEntry>;

export function TechniqueThumbnail({ technique, eager=false }: { technique: Technique; eager?: boolean }) {
  const host=useRef<HTMLDivElement>(null);
  const [visible,setVisible]=useState(eager);
  const staticUrl=useMemo(()=>{
    const entry=staticItems[technique.id];
    if(!entry)return undefined;
    return import.meta.env.BASE_URL+(eager?entry.detail:entry.thumb);
  },[technique.id,eager]);
  const [url,setUrl]=useState<string|undefined>(staticUrl);
  const [failed,setFailed]=useState(false);

  useEffect(()=>{
    setUrl(staticUrl);
    setFailed(false);
  },[staticUrl,technique.id]);

  useEffect(()=>{
    if(visible||!host.current)return;
    if(!('IntersectionObserver' in window)){setVisible(true);return;}
    const observer=new IntersectionObserver(entries=>{
      if(entries.some(entry=>entry.isIntersecting)){setVisible(true);observer.disconnect();}
    },{rootMargin:'360px'});
    observer.observe(host.current);
    return()=>observer.disconnect();
  },[visible]);

  useEffect(()=>{
    if(!visible||staticUrl)return;
    let disposed=false;
    let objectUrl:string|undefined;
    setFailed(false);
    void (async()=>{
      const cached=await getCachedTechniqueImage(technique.id).catch(()=>undefined);
      const value=cached||await getTechniqueImage(technique);
      objectUrl=value;
      if(disposed){if(value?.startsWith('blob:'))URL.revokeObjectURL(value);return;}
      if(value)setUrl(value);else setFailed(true);
    })().catch(()=>{if(!disposed)setFailed(true)});
    return()=>{
      disposed=true;
      if(objectUrl?.startsWith('blob:'))URL.revokeObjectURL(objectUrl);
    };
  },[visible,staticUrl,technique.id]);

  return <div ref={host} className="technique-photo-media">
    {url?<img src={url} alt={'Ejemplo visual de '+technique.title} loading={eager?'eager':'lazy'} decoding="async" fetchPriority={eager?'high':'auto'} onError={()=>{
      if(staticUrl&&url===staticUrl){setUrl(undefined);return;}
      setUrl(undefined);setFailed(true);
    }}/>:<div className="technique-photo-placeholder" aria-label={failed?'Imagen no disponible':'Preparando imagen'}>
      <Camera size={25}/><span>{failed?'Vista técnica':'Preparando foto…'}</span>
    </div>}
  </div>;
}
