import { Clock3, Pause, Play, RotateCcw, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import './StepTimer.css';

type TimerState = {
  configuredSeconds:number;
  remainingSeconds:number;
  running:boolean;
  deadline?:number;
  finished?:boolean;
};

const PREFIX='chef:step-timer:v2:';
const scheduledAlarms=new Map<string,number>();
const firedAlarms=new Set<string>();

export function StepTimer({
  timerId,
  suggestedSeconds=0,
  label='Temporizador'
}:{
  timerId:string;
  suggestedSeconds?:number;
  label?:string;
}){
  const initial=useMemo(()=>readState(timerId,suggestedSeconds),[timerId,suggestedSeconds]);
  const[open,setOpen]=useState(initial.running);
  const[configured,setConfigured]=useState(initial.configuredSeconds);
  const[remaining,setRemaining]=useState(initial.remainingSeconds);
  const[running,setRunning]=useState(initial.running);
  const[deadline,setDeadline]=useState<number|undefined>(initial.deadline);
  const[finished,setFinished]=useState(Boolean(initial.finished));
  const alarmed=useRef(false);
  const wakeLock=useRef<any>(null);

  useEffect(()=>{
    const next=readState(timerId,suggestedSeconds);
    setConfigured(next.configuredSeconds);
    setRemaining(next.remainingSeconds);
    setRunning(next.running);
    setDeadline(next.deadline);
    setFinished(Boolean(next.finished));
    if(next.running)setOpen(true);
    alarmed.current=Boolean(next.finished);
    if(next.running&&next.deadline)scheduleAlarm(timerId,next.deadline,label);
  },[timerId,suggestedSeconds,label]);

  useEffect(()=>{
    persist(timerId,{configuredSeconds:configured,remainingSeconds:remaining,running,deadline,finished});
  },[timerId,configured,remaining,running,deadline,finished]);
  useEffect(()=>{
    const listener=(event:Event)=>{
      const detail=(event as CustomEvent<{timerId:string}>).detail;
      if(detail?.timerId!==timerId)return;
      const next=readState(timerId,suggestedSeconds);
      setConfigured(next.configuredSeconds);
      setRemaining(next.remainingSeconds);
      setRunning(next.running);
      setDeadline(next.deadline);
      setFinished(Boolean(next.finished));
      alarmed.current=Boolean(next.finished);
    };
    window.addEventListener('chef:step-timer-finished',listener);
    return()=>window.removeEventListener('chef:step-timer-finished',listener);
  },[timerId,suggestedSeconds]);


  useEffect(()=>{
    let disposed=false;
    const acquire=async()=>{
      if(!running||document.visibilityState!=='visible'||!('wakeLock' in navigator))return;
      try{
        const lock=await (navigator as any).wakeLock.request('screen');
        if(disposed){await lock.release?.();return;}
        wakeLock.current=lock;
      }catch{/* opcional */}
    };
    const visibility=()=>{if(running&&document.visibilityState==='visible'&&!wakeLock.current)void acquire()};
    if(running)void acquire();
    document.addEventListener('visibilitychange',visibility);
    return()=>{disposed=true;document.removeEventListener('visibilitychange',visibility);void wakeLock.current?.release?.();wakeLock.current=null};
  },[running]);

  useEffect(()=>{
    if(!running||!deadline)return;
    const sync=()=>{
      const left=Math.max(0,Math.ceil((deadline-Date.now())/1000));
      setRemaining(left);
      if(left<=0){
        setRunning(false);
        setDeadline(undefined);
        setFinished(true);
        if(!alarmed.current){
          alarmed.current=true;
          ringAlarm(timerId,label);
        }
      }
    };
    sync();
    const interval=window.setInterval(sync,500);
    const onFocus=()=>sync();
    window.addEventListener('focus',onFocus);
    document.addEventListener('visibilitychange',onFocus);
    return()=>{window.clearInterval(interval);window.removeEventListener('focus',onFocus);document.removeEventListener('visibilitychange',onFocus)};
  },[running,deadline,label]);

  const setDuration=(minutes:number,seconds:number)=>{
    const total=Math.max(0,Math.min(24*60*60,Math.trunc(minutes)*60+Math.trunc(seconds)));
    cancelScheduled(timerId);
    firedAlarms.delete(timerId);
    setConfigured(total);
    setRemaining(total);
    setRunning(false);
    setDeadline(undefined);
    setFinished(false);
    alarmed.current=false;
  };

  const startPause=async()=>{
    if(running){
      const left=deadline?Math.max(0,Math.ceil((deadline-Date.now())/1000)):remaining;
      cancelScheduled(timerId);
      setRemaining(left);
      setRunning(false);
      setDeadline(undefined);
      return;
    }
    const base=remaining>0?remaining:configured;
    if(base<=0)return;
    await primeAudio();
    if(typeof Notification!=='undefined'&&Notification.permission==='default'){
      try{await Notification.requestPermission()}catch{/* opcional */}
    }
    cancelScheduled(timerId);
    firedAlarms.delete(timerId);
    alarmed.current=false;
    setFinished(false);
    setRemaining(base);
    const nextDeadline=Date.now()+base*1000;
    setDeadline(nextDeadline);
    setRunning(true);
    scheduleAlarm(timerId,nextDeadline,label);
  };

  const reset=()=>{
    const base=configured;
    cancelScheduled(timerId);
    firedAlarms.delete(timerId);
    setRemaining(base);
    setRunning(false);
    setDeadline(undefined);
    setFinished(false);
    alarmed.current=false;
  };

  const configuredMinutes=Math.floor(configured/60);
  const configuredSeconds=configured%60;
  const mm=Math.floor(remaining/60).toString().padStart(2,'0');
  const ss=(remaining%60).toString().padStart(2,'0');

  return <section className={'step-timer '+(running?'running ':'')+(finished?'finished':'')}>
    <button type="button" className="step-timer-trigger" aria-label={open?'Cerrar temporizador':'Abrir temporizador'} aria-expanded={open} onClick={()=>setOpen(v=>!v)}>
      <span className="step-timer-clock">{open?<X size={22}/>:<Clock3 size={24}/>}</span>
      <span className="step-timer-trigger-copy"><strong>Temporizador</strong><small>{running?(mm+':'+ss+' en marcha'):finished?'Tiempo terminado':'Toca el reloj para ajustar el tiempo'}</small></span>
    </button>
    {open&&<div className="step-timer-panel">
      <div className="step-timer-inputs">
        <label><span>Minutos</span><input aria-label="Minutos del temporizador" type="number" inputMode="numeric" min="0" max="1440" value={configuredMinutes} disabled={running} onChange={e=>setDuration(Number(e.target.value)||0,configuredSeconds)}/></label>
        <span className="step-timer-colon">:</span>
        <label><span>Segundos</span><input aria-label="Segundos del temporizador" type="number" inputMode="numeric" min="0" max="59" value={configuredSeconds} disabled={running} onChange={e=>setDuration(configuredMinutes,Math.max(0,Math.min(59,Number(e.target.value)||0)))}/></label>
      </div>
      {suggestedSeconds>0&&<button type="button" className="step-timer-suggestion" disabled={running} onClick={()=>setDuration(Math.floor(suggestedSeconds/60),suggestedSeconds%60)}>Usar tiempo sugerido · {formatDuration(suggestedSeconds)}</button>}
      <div className="step-timer-display" role="timer" aria-live="polite">{mm}:{ss}</div>
      <div className="step-timer-actions">
        <button type="button" className="primary" onClick={()=>void startPause()} disabled={!running&&remaining<=0&&configured<=0}>{running?<><Pause size={18}/> Pausar</>:<><Play size={18}/> Iniciar</>}</button>
        <button type="button" onClick={reset}><RotateCcw size={18}/> Reiniciar</button>
      </div>
      {finished&&<div className="step-timer-finished">Tiempo terminado</div>}
    </div>}
  </section>;
}

function readState(timerId:string,suggestedSeconds:number):TimerState{
  const fallback={configuredSeconds:suggestedSeconds,remainingSeconds:suggestedSeconds,running:false,finished:false};
  try{
    const raw=sessionStorage.getItem(PREFIX+timerId);
    if(!raw)return fallback;
    const value=JSON.parse(raw) as Partial<TimerState>;
    const configured=Number.isFinite(value.configuredSeconds)?Math.max(0,Number(value.configuredSeconds)):suggestedSeconds;
    let remaining=Number.isFinite(value.remainingSeconds)?Math.max(0,Number(value.remainingSeconds)):configured;
    let running=Boolean(value.running);
    let deadline=Number.isFinite(value.deadline)?Number(value.deadline):undefined;
    let finished=Boolean(value.finished);
    if(running&&deadline){
      remaining=Math.max(0,Math.ceil((deadline-Date.now())/1000));
      if(remaining<=0){running=false;deadline=undefined;finished=true;}
    }
    return{configuredSeconds:configured,remainingSeconds:remaining,running,deadline,finished};
  }catch{return fallback}
}

function persist(timerId:string,state:TimerState){
  try{sessionStorage.setItem(PREFIX+timerId,JSON.stringify(state))}catch{/* almacenamiento restringido */}
}

let sharedAudioContext:AudioContext|undefined;
async function primeAudio(){
  try{
    const Ctx=window.AudioContext||(window as any).webkitAudioContext;
    if(!Ctx)return;
    sharedAudioContext??=new Ctx();
    if(sharedAudioContext.state==='suspended')await sharedAudioContext.resume();
  }catch{/* vibración/notificación siguen disponibles */}
}


function scheduleAlarm(timerId:string,deadline:number,label:string){
  cancelScheduled(timerId);
  const delay=Math.max(0,deadline-Date.now());
  const handle=window.setTimeout(()=>ringAlarm(timerId,label),delay);
  scheduledAlarms.set(timerId,handle);
}

function cancelScheduled(timerId:string){
  const handle=scheduledAlarms.get(timerId);
  if(handle!==undefined)window.clearTimeout(handle);
  scheduledAlarms.delete(timerId);
}

function ringAlarm(timerId:string,label:string){
  if(firedAlarms.has(timerId))return;
  firedAlarms.add(timerId);
  cancelScheduled(timerId);
  try{
    const raw=sessionStorage.getItem(PREFIX+timerId);
    if(raw){
      const state=JSON.parse(raw) as TimerState;
      persist(timerId,{...state,remainingSeconds:0,running:false,deadline:undefined,finished:true});
    }
  }catch{/* no bloquea */}
  playAlarm(label);
  window.dispatchEvent(new CustomEvent('chef:step-timer-finished',{detail:{timerId}}));
}

function playAlarm(label:string){
  try{
    const Ctx=window.AudioContext||(window as any).webkitAudioContext;
    if(Ctx){
      sharedAudioContext??=new Ctx();
      const ctx=sharedAudioContext;
      if(ctx.state==='suspended')void ctx.resume();
      [0,.38,.76].forEach(offset=>{
        const osc=ctx.createOscillator(),gain=ctx.createGain();
        osc.type='sine';osc.frequency.value=880;
        gain.gain.setValueAtTime(.0001,ctx.currentTime+offset);
        gain.gain.exponentialRampToValueAtTime(.18,ctx.currentTime+offset+.02);
        gain.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+offset+.26);
        osc.connect(gain);gain.connect(ctx.destination);
        osc.start(ctx.currentTime+offset);osc.stop(ctx.currentTime+offset+.28);
      });
    }
  }catch{/* no bloquea */}
  try{navigator.vibrate?.([220,120,220,120,300])}catch{/* opcional */}
  if(typeof Notification!=='undefined'&&Notification.permission==='granted'&&document.hidden){
    try{new Notification('The Chef · Tiempo terminado',{body:label})}catch{/* opcional */}
  }
}

function formatDuration(totalSeconds:number){
  const minutes=Math.floor(totalSeconds/60),seconds=totalSeconds%60;
  return seconds?(minutes+' min '+seconds+' s'):(minutes+' min');
}
