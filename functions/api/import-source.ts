import {importSource} from '../../server/importSource';
import type {PreviewEnv} from '../../server/previewSession';
export const onRequestPost=({request,env}:{request:Request;env:PreviewEnv})=>importSource(request,env);
