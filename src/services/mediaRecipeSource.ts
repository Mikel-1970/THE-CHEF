import type {Recipe} from '../domain/types';
import {evaluateDishPhoto,transcribeCookingAudio} from './mediaGateway';
import {textFromRecipeHtml} from './importHtml';
const LIMIT=20*1024*1024;
export type MediaEvidence={summary:string;image?:string;note:string;sourceUrl?:string};
const reference:Recipe={id:'source-analysis',title:'Identificación de una receta',description:'Describe solo lo observado: ingredientes, acciones, texto y cantidades legibles. Si es una secuencia numerada, analiza su orden temporal. Distingue hipótesis; no evalúes ni puntúes el cocinado.',emoji:'🔎',baseServings:1,prepMinutes:0,cookMinutes:0,difficulty:'Media',mealType:'Comida',style:'Análisis de fuente',cuisine:'Por identificar',ingredients:[],miseEnPlace:[],steps:[],criticalPoints:[],substitutions:[],storage:''};
function waitFor(video:HTMLVideoElement,event:string){return new Promise<void>((resolve,reject)=>{const timer=setTimeout(()=>finish(new Error('El vídeo no se ha podido leer. Prueba MP4 o WebM.')),15000);const done=()=>finish();const fail=()=>finish(new Error('Formato de vídeo no compatible con este navegador.'));function finish(error?:Error){clearTimeout(timer);video.removeEventListener(event,done);video.removeEventListener('error',fail);error?reject(error):resolve();}video.addEventListener(event,done,{once:true});video.addEventListener('error',fail,{once:true});});}
async function sampleVideo(file:File){
 const url=URL.createObjectURL(file),video=document.createElement('video');video.muted=true;video.preload='auto';video.playsInline=true;
 try{
 const loaded=waitFor(video,'loadeddata');video.src=url;video.load();await loaded;
 if(!Number.isFinite(video.duration)||video.duration<=0||video.duration>300)throw Error('Selecciona un vídeo de hasta 5 minutos.');
 const canvas=document.createElement('canvas');canvas.width=1280;canvas.height=1080;const ctx=canvas.getContext('2d')!;let image='';
 for(let i=0;i<6;i++){
 const time=Math.min(video.duration-.01,Math.max(.01,video.duration*(i+.5)/6));
 const sought=waitFor(video,'seeked');video.currentTime=time;await sought;
 const frame=document.createElement('canvas');frame.width=640;frame.height=360;const fc=frame.getContext('2d')!;fc.fillStyle='#fff';fc.fillRect(0,0,640,360);
 const scale=Math.min(640/video.videoWidth,330/video.videoHeight);fc.drawImage(video,(640-video.videoWidth*scale)/2,0,video.videoWidth*scale,video.videoHeight*scale);fc.fillStyle='#222';fc.font='18px sans-serif';fc.fillText('Fotograma '+(i+1)+' · '+Math.round(time)+' s',12,350);
 ctx.drawImage(frame,(i%2)*640,Math.floor(i/2)*360);image=frame.toDataURL('image/jpeg',.85);
 }
 const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('No se pudieron extraer fotogramas.')),'image/jpeg',.85));
 return {file:new File([blob],'fotogramas.jpg',{type:'image/jpeg'}),image};
 }finally{video.removeAttribute('src');video.load();URL.revokeObjectURL(url);}
}
export async function analyseMediaFile(file:File,progress:(text:string)=>void):Promise<MediaEvidence>{
 if(file.size>LIMIT)throw Error('El archivo supera 20 MB.');
 if(file.type.startsWith('image/')){progress('Identificando la fotografía…');const result=await evaluateDishPhoto(reference,file);return {summary:result.evaluation.summary,image:result.previewUrl,note:'Fuente examinada: fotografía. Los ingredientes ocultos y cantidades no son observables.'};}
 if(!file.type.startsWith('video/'))throw Error('Selecciona una fotografía o un vídeo MP4/WebM.');
 progress('Leyendo los fotogramas del vídeo…');const frames=await sampleVideo(file);
 progress('Analizando la secuencia y transcribiendo el audio…');
 const [visual,audio]=await Promise.allSettled([evaluateDishPhoto(reference,frames.file),transcribeCookingAudio(file)]);
 if(visual.status==='rejected')throw visual.reason;
 const spoken=audio.status==='fulfilled'?audio.value:'';
 return {summary:visual.value.evaluation.summary+(spoken?'\nTranscripción del audio (puede contener errores):\n'+spoken:''),image:frames.image,note:'Fuente examinada: 6 fotogramas distribuidos por el vídeo. '+(spoken?'Audio transcrito; revisa nombres y cantidades.':'No se ha podido leer el audio. Confirma la información que falta.')};
}
export async function analyseMediaLink(value:string,progress:(text:string)=>void):Promise<MediaEvidence>{
 const url=new URL(value);if(url.protocol!=='https:'||url.username||url.password)throw Error('Usa un enlace HTTPS público.');
 if(/\.(mp4|webm|mov)$/i.test(url.pathname)){
 progress('Leyendo el vídeo del enlace…');
 const response=await fetch(url.href,{signal:AbortSignal.timeout(30000)});
 if(!response.ok||Number(response.headers.get('content-length'))>LIMIT)throw Error('No se puede leer ese vídeo. Sube el archivo (máximo 20 MB).');
 const reader=response.body?.getReader();if(!reader)throw Error('El vídeo está vacío.');const chunks:Uint8Array[]=[];let size=0;
 try{for(;;){const next=await reader.read();if(next.done)break;size+=next.value.byteLength;if(size>LIMIT)throw Error('El vídeo supera 20 MB.');chunks.push(next.value);}}finally{await reader.cancel();}
 const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
 const result=await analyseMediaFile(new File([bytes],url.pathname.split('/').pop()||'video.mp4',{type:response.headers.get('content-type')?.startsWith('video/')?response.headers.get('content-type')!:'video/mp4'}),progress);
 return {...result,sourceUrl:url.href};
 }
 progress('Leyendo la receta o descripción del enlace…');
 const response=await fetch(import.meta.env.BASE_URL+'api/import-source',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url:url.href,allowVideoPage:true})});
 const result=await response.json();if(!response.ok)throw Error(result.error||'No se puede leer el enlace. Sube el vídeo o pega la receta en Importar receta.');
 const extracted=textFromRecipeHtml(result.html);
 if(extracted.text.length>20000)throw Error('Hay demasiado contenido. Importa solo el texto de la receta.');
 if(!/ingrediente|\b\d+\s*(g|ml|kg|min)|corta|mezcla|hornea|cocer|bate/i.test(extracted.text))throw Error('El enlace no expone una receta suficiente. Sube el vídeo o importa su transcripción.');
 return {summary:extracted.text,note:'Fuente examinada: texto accesible de la página. No se han visto ni oído los vídeos incrustados.',sourceUrl:result.url};
}
