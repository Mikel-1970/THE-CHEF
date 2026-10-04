import {useSyncExternalStore} from 'react';
export type TimerState={configuredSeconds:number;remainingSeconds:number;running:boolean;deadline?:number;finished?:boolean;label:string;id:string};
const KEY='chef:global-timer:v1';
let state:TimerState|undefined;
try{const raw=sessionStorage.getItem(KEY);if(raw){const saved=JSON.parse(raw);if(typeof saved.id==='string'&&Number.isFinite(saved.remainingSeconds)&&Number.isFinite(saved.configuredSeconds)&&(!saved.running||Number.isFinite(saved.deadline)))state=saved;}}catch{/* optional storage */}
const listeners=new Set<()=>void>();
function publish(next:TimerState|undefined){state=next;try{if(next)sessionStorage.setItem(KEY,JSON.stringify(next));else sessionStorage.removeItem(KEY)}catch{/* optional storage */}listeners.forEach(fn=>fn());}
export function useCookingTimer(){return useSyncExternalStore(fn=>{listeners.add(fn);return()=>{listeners.delete(fn)}},()=>state);}
export function tickTimer(){if(!state?.running||!state.deadline)return;const remainingSeconds=Math.max(0,Math.ceil((state.deadline-Date.now())/1000));if(!remainingSeconds){const label=state.label;publish({...state,remainingSeconds:0,running:false,deadline:undefined,finished:true});playAlarm(label);}else if(remainingSeconds!==state.remainingSeconds)publish({...state,remainingSeconds});}
export async function startTimer(id:string,label:string,seconds:number){if(seconds<=0)return;await primeAudio();if(state&&state.id!==id)return;silenceAlarm();publish({id,label,configuredSeconds:state?.configuredSeconds??seconds,remainingSeconds:seconds,running:true,deadline:Date.now()+seconds*1000,finished:false});}
export function pauseTimer(){tickTimer();if(state?.running)publish({...state,running:false,deadline:undefined});}
export function resetTimer(){silenceAlarm();if(state)publish({...state,remainingSeconds:state.configuredSeconds,running:false,deadline:undefined,finished:false});}
export function dismissTimer(){silenceAlarm();publish(undefined);}
export function configureTimer(id:string,seconds:number){if(state?.id===id){silenceAlarm();publish({...state,configuredSeconds:seconds,remainingSeconds:seconds,running:false,deadline:undefined,finished:false});}}
let sharedAudioContext:AudioContext|undefined;
async function primeAudio(){
  try{
    const Ctx=window.AudioContext||(window as any).webkitAudioContext;
    if(!Ctx)return;
    sharedAudioContext??=new Ctx();
    if(sharedAudioContext.state==='suspended')await sharedAudioContext.resume();
  }catch{/* vibración/notificación siguen disponibles */}
}



let alarmInterval:number|undefined;
const alarmNodes=new Set<OscillatorNode>();
export function silenceAlarm(){if(alarmInterval!==undefined)window.clearInterval(alarmInterval);alarmInterval=undefined;for(const node of alarmNodes){try{node.stop()}catch{/* already stopped */}}alarmNodes.clear();try{navigator.vibrate?.(0)}catch{/* optional */}}
function playAlarm(label:string){
 silenceAlarm();
 const pulse=()=>{
  try{const Ctx=window.AudioContext||(window as any).webkitAudioContext;if(Ctx){sharedAudioContext??=new Ctx();const ctx=sharedAudioContext;if(ctx.state==='suspended')void ctx.resume();const osc=ctx.createOscillator(),gain=ctx.createGain();const now=ctx.currentTime;osc.type='sawtooth';osc.frequency.setValueAtTime(600,now);for(let i=0;i<4;i++){osc.frequency.linearRampToValueAtTime(1200,now+i*.5+.25);osc.frequency.linearRampToValueAtTime(600,now+i*.5+.5)}gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(.3,now+.04);gain.gain.setValueAtTime(.3,now+1.94);gain.gain.linearRampToValueAtTime(0,now+2);osc.connect(gain);gain.connect(ctx.destination);alarmNodes.add(osc);osc.onended=()=>{alarmNodes.delete(osc);osc.disconnect();gain.disconnect()};osc.start(now);osc.stop(now+2.01)}}catch{/* visual alarm remains */}
  try{navigator.vibrate?.([500,150,500,150,500])}catch{/* optional */}
 };
 pulse();alarmInterval=window.setInterval(pulse,2500);
 if(typeof Notification!=='undefined'&&Notification.permission==='granted'&&document.hidden){try{new Notification('The Chef · Tiempo terminado',{body:label})}catch{/* optional */}}
}
