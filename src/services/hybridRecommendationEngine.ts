import {prepareDesireRequest} from '../utils/chefChoice';
import type { CookingRequest, Proposal } from '../domain/types';
import { proposalMatchesDesireIntent } from '../utils/desireIntent';
import { fetchAiProposals, isAiProposalApiConfigured } from './aiProposalGateway';
import { getMockProposals } from './mockRecommendationEngine';
import {getRecipeById} from './recipeCatalog';

export const HYBRID_NOTICE_STORAGE_KEY='the-chef:last-hybrid-notice';
const PROPOSAL_COUNT=1;
const DIFFICULTY_RANK:Record<Proposal['difficulty'],number>={'Fácil':1,'Media':2,'Avanzada':3};

export type HybridRecommendationResult={
 proposals:Proposal[];
 mode:'local'|'hybrid';
 externalRecipesAdded:number;
 externalError?:string;
};

export async function getHybridProposals(request:CookingRequest,excludeRecipeIds:string[]=[]):Promise<HybridRecommendationResult>{
 request=prepareDesireRequest(request);
 const excluded=[...excludeRecipeIds,...(request.excludeRecipeIds??[])];
 if(request.generationMode!=='ai'){
  const proposals=getMockProposals(request,excluded,true).slice(0,PROPOSAL_COUNT);
  persistEngineNotice(undefined);
  if(!proposals.length)throw new Error(CATALOG_EMPTY);
  return {proposals,mode:'local',externalRecipesAdded:0};
 }
 if(!isAiProposalApiConfigured())throw new Error('La generación con IA no está disponible ahora.');
 const excludedTitles=excluded.map(id=>getRecipeById(id)?.title).filter(Boolean);
 if(excludedTitles.length)request={...request,desireText:(request.desireText??'')+'\nElige un plato distinto. No repitas: '+excludedTitles.join(', ')+'.'};
 let proposals:Proposal[]=[];
 let feedback='';
 for(let attempt=0;attempt<3;attempt++){
  const candidates=await fetchAiProposals({...request,desireText:(request.desireText??'')+feedback});
  proposals=candidates.filter(proposal=>!excluded.includes(proposal.recipeId)&&proposalWithinLimits(proposal,request)&&proposalMatchesDesireIntent(proposal,request)).slice(0,PROPOSAL_COUNT);
  if(proposals.length)break;
  feedback='\nCorrige la propuesta anterior: '+JSON.stringify(candidates.map(p=>({title:p.title,minutes:p.minutes,difficulty:p.difficulty})))+
   '. Conserva todos los ingredientes principales y técnicas de la petición original, los límites de tiempo y dificultad y las exclusiones. Puedes combinar elaboraciones, salsas y guarniciones de distintas recetas para crear un plato nuevo coherente. Explica en el subtítulo o la razón cómo cumples lo solicitado; no omitas el producto principal. No hace falta que exista en la biblioteca.';
 }
 if(!proposals.length)throw new Error('Tras varios intentos no hemos conseguido una propuesta que cumpla todos tus criterios. Tu petición se conserva; puedes revisar las opciones o volver a intentarlo.');
 persistEngineNotice(undefined);
 return {proposals,mode:'hybrid',externalRecipesAdded:0};
}
export const CATALOG_EMPTY='No hay una receta de la biblioteca que cumpla tu petición. Puedes cambiar la petición o crear una con IA.';

function persistEngineNotice(message?:string){
 if(typeof sessionStorage==='undefined')return;
 try{
  if(message)sessionStorage.setItem(HYBRID_NOTICE_STORAGE_KEY,message);
  else sessionStorage.removeItem(HYBRID_NOTICE_STORAGE_KEY);
 }catch{/* informativo */}
}

function proposalWithinLimits(proposal:Proposal,request:CookingRequest){
 if(request.maxMinutes&&proposal.minutes>request.maxMinutes)return false;
 if(request.difficulty&&DIFFICULTY_RANK[proposal.difficulty]>DIFFICULTY_RANK[request.difficulty])return false;
 return true;
}
