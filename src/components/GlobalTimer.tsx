import {useEffect,useState} from 'react';
import {useCookingTimer,tickTimer,startTimer,pauseTimer,dismissTimer,silenceAlarm} from './timerStore';
import './StepTimer.css';
export function GlobalTimer(){
 const timer=useCookingTimer();const[expanded,setExpanded]=useState(false);
 useEffect(()=>{tickTimer();const interval=window.setInterval(tickTimer,250);const sync=()=>tickTimer();window.addEventListener('focus',sync);document.addEventListener('visibilitychange',sync);return()=>{clearInterval(interval);window.removeEventListener('focus',sync);document.removeEventListener('visibilitychange',sync)}},[]);
 useEffect(()=>{if(timer?.finished)setExpanded(true)},[timer?.finished]);
 useEffect(()=>{if(!timer?.running)return;let disposed=false;let lock:any;const acquire=async()=>{if(document.visibilityState!=='visible'||lock)return;try{const next=await(navigator as any).wakeLock?.request('screen');if(disposed)await next?.release();else {lock=next;next?.addEventListener('release',()=>{lock=undefined})}}catch{/* optional */}};void acquire();document.addEventListener('visibilitychange',acquire);return()=>{disposed=true;document.removeEventListener('visibilitychange',acquire);void lock?.release()}},[timer?.running]);
 if(!timer)return null;
 const time=Math.floor(timer.remainingSeconds/60).toString().padStart(2,'0')+':'+(timer.remainingSeconds%60).toString().padStart(2,'0');
 return <aside className="global-timer" aria-label="Temporizador global"><button className="global-timer-summary" aria-expanded={expanded} onClick={()=>setExpanded(v=>!v)}>⏱ {timer.finished?'Tiempo terminado':time}{!timer.running&&!timer.finished?' · Pausado':''}</button>{(expanded||timer.finished)&&<div className="global-timer-controls"><strong>{timer.label}</strong>{timer.finished?<button onClick={()=>{silenceAlarm();dismissTimer()}}>Silenciar y cerrar</button>:<><button onClick={()=>timer.running?pauseTimer():void startTimer(timer.id,timer.label,timer.remainingSeconds||timer.configuredSeconds)}>{timer.running?'Pausar temporizador':'Reanudar temporizador'}</button><button onClick={dismissTimer}>Cancelar temporizador</button></>}</div>}</aside>
}
