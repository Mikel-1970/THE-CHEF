import {prepareDesireRequest} from '../utils/chefChoice';
import type { CookingRequest, Proposal } from '../domain/types';
import { proposalMatchesDesireIntent } from '../utils/desireIntent';
import { fetchAiProposals, isAiProposalApiConfigured } from './aiProposalGateway';
import { getMockProposals } from './mockRecommendationEngine';

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
 const preference=Math.max(0,Math.min(100,request.aiPreference??100));
 const aiCount=Math.max(0,Math.min(PROPOSAL_COUNT,Math.round(preference/100)));
 const localCount=PROPOSAL_COUNT-aiCount;
 let externalError:string|undefined;
 let aiPool:Proposal[]=[];

 if(aiCount>0&&isAiProposalApiConfigured()){
  try{
   aiPool=(await fetchAiProposals(request))
    .filter(proposal=>proposalWithinLimits(proposal,request))
    .filter(proposal=>proposalMatchesDesireIntent(proposal,request))
    .slice(0,PROPOSAL_COUNT);
  }catch(error){
   externalError=error instanceof Error&&error.message?error.message:'No se ha podido consultar la IA.';
  }
 }

 const ai=aiPool.slice(0,aiCount);
 const local=getMockProposals(request,[...excludeRecipeIds,...ai.map(proposal=>proposal.recipeId)])
  .slice(0,localCount+(aiCount-ai.length));
 const proposals=[...ai,...local];

 if(proposals.length<PROPOSAL_COUNT&&preference>0){
  for(const extra of aiPool){
   if(proposals.length>=PROPOSAL_COUNT)break;
   if(!proposals.some(proposal=>proposal.recipeId===extra.recipeId))proposals.push(extra);
  }
 }

 const finalProposals=proposals.slice(0,PROPOSAL_COUNT);
 if(!finalProposals.length){
  persistEngineNotice(undefined);
  if(externalError){
   throw new Error(`${externalError} No se mostrará otra receta distinta a la que has pedido. Reintenta la búsqueda.`);
  }
  if(request.mode==='desire'){
   throw new Error('No he encontrado una propuesta que mantenga lo que has pedido. Prueba a reformularlo o genera de nuevo.');
  }
  throw new Error('No hay recetas que cumplan los límites indicados. Amplía los criterios o revisa las restricciones.');
 }

 if(finalProposals.length<PROPOSAL_COUNT&&!externalError){
  externalError='Solo se ha encontrado una propuesta que cumple todos tus criterios.';
 }

 const usesAi=finalProposals.some(proposal=>aiPool.some(aiProposal=>aiProposal.id===proposal.id));
 persistEngineNotice(externalError);
 return{proposals:finalProposals,mode:usesAi?'hybrid':'local',externalRecipesAdded:0,externalError};
}

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
