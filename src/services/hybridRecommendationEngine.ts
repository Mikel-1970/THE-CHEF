import type { CookingRequest, Proposal } from '../domain/types';
import { fetchAiProposals, isAiProposalApiConfigured } from './aiProposalGateway';
import { getMockProposals } from './mockRecommendationEngine';
export const HYBRID_NOTICE_STORAGE_KEY='the-chef:last-hybrid-notice'; const PROPOSAL_COUNT=2;
export type HybridRecommendationResult={proposals:Proposal[];mode:'local'|'hybrid';externalRecipesAdded:number;externalError?:string};
export async function getHybridProposals(request:CookingRequest,excludeRecipeIds:string[]=[]):Promise<HybridRecommendationResult>{
 const preference=Math.max(0,Math.min(100,request.aiPreference??100)); const aiCount=preference===0?0:preference===100?2:Math.max(1,Math.min(1,Math.round(preference/50))); const localCount=PROPOSAL_COUNT-aiCount; let externalError:string|undefined; let ai:Proposal[]=[];
 if(aiCount>0&&isAiProposalApiConfigured()){try{ai=(await fetchAiProposals(request)).slice(0,aiCount)}catch(e){externalError=e instanceof Error&&e.message?e.message:'No se ha podido consultar la IA.'}}
 const local=getMockProposals(request,[...excludeRecipeIds,...ai.map(p=>p.recipeId)]).slice(0,localCount+(aiCount-ai.length)); const proposals=[...ai,...local].slice(0,PROPOSAL_COUNT);
 if(!proposals.length)throw new Error('No se han encontrado propuestas válidas.'); persistEngineNotice(externalError);return{proposals,mode:ai.length?'hybrid':'local',externalRecipesAdded:0,externalError};
}
function persistEngineNotice(message?:string){if(typeof sessionStorage==='undefined')return;try{if(message)sessionStorage.setItem(HYBRID_NOTICE_STORAGE_KEY,message);else sessionStorage.removeItem(HYBRID_NOTICE_STORAGE_KEY)}catch{/* informativo */}}
