import { Check, LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useApp } from '../AppContext';
import { avatarName } from '../data/avatarNames';
import { nextCookingTip } from '../data/cookingTips';
import { ChefAvatar } from './ChefAvatar';
import './ChefLoadingOverlay.css';
type Props={active:boolean;title?:string;messages?:string[];showTips?:boolean;progress?:string};
export function ChefLoadingOverlay({active,title='¡A la mesa! está trabajando',messages=[],showTips=true,progress}:Props){
 const {settings}=useApp();
 const [elapsed,setElapsed]=useState(0);
 useEffect(()=>{if(!active)return;setElapsed(0);const timer=window.setInterval(()=>setElapsed(s=>s+1),1000);return()=>window.clearInterval(timer);},[active]);
 const [visible,setVisible]=useState(active),[completed,setCompleted]=useState(false);
 const [tip,setTip]=useState<ReturnType<typeof nextCookingTip>>();
 useEffect(()=>{
  if(active){setVisible(true);setCompleted(false);if(showTips)setTip(nextCookingTip());return;}
  setCompleted(true);const timer=window.setTimeout(()=>setVisible(false),500);return()=>window.clearTimeout(timer);
 },[active,showTips]);
 useEffect(()=>{if(!active||!showTips)return;const timer=window.setInterval(()=>setTip(nextCookingTip()),9000);return()=>window.clearInterval(timer)},[active,showTips]);
 if(!visible)return null;
 return <div className="chef-loading-overlay" role="status" aria-live="polite" aria-busy={active}><div className={`chef-loading-card ${completed?'completed':''}`}><div className="chef-progress-ring">{!completed&&<LoaderCircle className="chef-visible-spinner" size={94} strokeWidth={2} aria-hidden="true"/>}<div className="chef-hat-spinner personalized-chef-spinner"><ChefAvatar avatar={settings.avatarEmoji} size={68}/></div>{completed&&<span className="chef-complete-check"><Check size={28}/></span>}</div><strong>{completed?'Listo':title}</strong>{active&&<><span>{progress??'Seguimos preparando tu receta…'}</span><small aria-live="off">Tiempo transcurrido: {elapsed} s</small></>}{completed?<span>Preparado.</span>:showTips&&tip?<div className="cooking-tip"><span className="cooking-tip-icon" aria-hidden="true">{tip.icon}</span><small>UN CONSEJO MIENTRAS ESPERAS</small><p>{tip.text}</p></div>:<span>{avatarName(settings.avatarEmoji)}: {messages[0]??'Preparando…'}</span>}</div></div>;
}
