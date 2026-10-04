import {culinaryApi,type CatalogEnv} from '../../server/culinaryCatalog';
export const onRequestGet=({request,env}:{request:Request;env:CatalogEnv})=>culinaryApi(request,env);
export const onRequestPut=({request,env}:{request:Request;env:CatalogEnv})=>culinaryApi(request,env);
