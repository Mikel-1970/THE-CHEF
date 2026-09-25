import { Clock3, Pause, Play, RotateCcw, X } from 'lucide-react';
import {useState} from 'react';
import {useCookingTimer,startTimer,pauseTimer,resetTimer,configureTimer} from './timerStore';
import './StepTimer.css';
export function StepTimer(props:{timerId:string;suggestedSeconds?:number;label?:string}){return <TimerEditor key={props.timerId} {...props}/>}
function TimerEditor({timerId,suggestedSeconds=0,label='Temporizador'}:{timerId:string;suggestedSeconds?:number;label?:string}){
 const active=useCookingTimer(),own=active?.id===timerId?active:undefined;
 const[open,setOpen]=useState(Boolean(own));
 const[draft,setDraft]=useState(suggestedSeconds);
 const configured=own?.configuredSeconds??draft,remaining=own?.remainingSeconds??draft,running=own?.running??false,finished=own?.finished??false;
 const busy=Boolean(active&&active.id!==timerId);
 const setDuration=(minutes:number,seconds:number)=>{const total=Math.max(0,Math.min(86400,Math.trunc(minutes)*60+Math.trunc(seconds)));setDraft(total);configureTimer(timerId,total)};
 const startPause=()=>running?pauseTimer():startTimer(timerId,label,remaining>0?remaining:configured);
 const reset=()=>{if(own)resetTimer();else setDraft(configured)};
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
        <button type="button" className="primary" onClick={()=>void startPause()} disabled={busy||(!running&&remaining<=0&&configured<=0)}>{running?<><Pause size={18}/> Pausar</>:<><Play size={18}/> Iniciar</>}</button>
        <button type="button" onClick={reset}><RotateCcw size={18}/> Reiniciar</button>
      </div>
      {busy&&<p>Ya hay un temporizador activo. Puedes controlarlo desde el reloj flotante.</p>}{finished&&<div className="step-timer-finished">Tiempo terminado</div>}
    </div>}
  </section>;
}

function formatDuration(totalSeconds:number){
  const minutes=Math.floor(totalSeconds/60),seconds=totalSeconds%60;
  return seconds?(minutes+' min '+seconds+' s'):(minutes+' min');
}
