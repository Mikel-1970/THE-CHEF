import type { CookingRequest, Proposal } from '../domain/types';
import { fetchAiProposals, isAiProposalApiConfigured } from './aiProposalGateway';
import { getMockProposals } from './mockRecommendationEngine';
export const HYBRID_NOTICE_STORAGE_KEY='the-chef:last-hybrid-notice'; const PROPOSAL_COUNT=2;
export type HybridRecommendationResult={proposals:Proposal[];mode:'local'|'hybrid';externalRecipesAdded:number;externalError?:string};
export async function getHybridProposals(request:CookingRequest,excludeRecipeIds:string[]=[]):Promise<HybridRecommendationResult>{
 const preference=Math.max(0,Math.min(100,request.aiPreference??100)); const aiCount=Math.max(0,Math.min(PROPOSAL_COUNT,Math.round(preference/50))); const localCount=PROPOSAL_COUNT-aiCount; let externalError:string|undefined; let aiPool:Proposal[]=[];
 if(preference>0&&isAiProposalApiConfigured()){try{aiPool=(await fetchAiProposals(request)).slice(0,PROPOSAL_COUNT)}catch(e){externalError=e instanceof Error&&e.message?e.message:'No se ha podido consultar la IA.'}}
 const ai=aiPool.slice(0,aiCount); const local=getMockProposals(request,[...excludeRecipeIds,...ai.map(p=>p.recipeId)]).slice(0,localCount+(aiCount-ai.length)); const proposals=[...ai,...local]; if(proposals.length<PROPOSAL_COUNT&&preference>0){for(const extra of aiPool){if(proposals.length>=PROPOSAL_COUNT)break;if(!proposals.some(p=>p.recipeId===extra.recipeId))proposals.push(extra)}}
 const finalProposals=proposals.slice(0,PROPOSAL_COUNT); if(!finalProposals.length)throw new Error('No hay recetas que cumplan los límites indicados. Amplía tiempo, dificultad o revisa las restricciones.'); if(finalProposals.length<PROPOSAL_COUNT&&!externalError)externalError='Solo se ha encontrado una propuesta que cumple todos tus límites.'; persistEngineNotice(externalError);return{proposals:finalProposals,mode:ai.length?'hybrid':'local',externalRecipesAdded:0,externalError};
}
function persistEngineNotice(message?:string){if(typeof sessionStorage==='undefined')return;try{if(message)sessionStorage.setItem(HYBRID_NOTICE_STORAGE_KEY,message);else sessionStorage.removeItem(HYBRID_NOTICE_STORAGE_KEY)}catch{/* informativo */}}
