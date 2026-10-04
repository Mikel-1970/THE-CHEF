import { previewSession, type PreviewEnv } from '../../server/previewSession';
export const onRequestGet = ({ request, env }: { request: Request; env: PreviewEnv }) => previewSession(request, env);
