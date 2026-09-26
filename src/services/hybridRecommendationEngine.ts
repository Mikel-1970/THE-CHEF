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
 const proposals=(await fetchAiProposals(request))
  .filter(proposal=>!excluded.includes(proposal.recipeId))
  .filter(proposal=>proposalWithinLimits(proposal,request))
  .filter(proposal=>proposalMatchesDesireIntent(proposal,request))
  .slice(0,PROPOSAL_COUNT);
 if(!proposals.length)throw new Error('La IA no ha encontrado una alternativa que respete tus criterios. Puedes volver a intentarlo.');
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
