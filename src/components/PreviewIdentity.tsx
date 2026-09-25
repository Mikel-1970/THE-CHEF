import {BrandMark} from './BrandMark';
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { useApp } from '../AppContext';

export type PreviewUser = { id: string; email: string; name: string; role: 'admin' };
type Identity = { user: PreviewUser; expiresAt: number; stableUrl: string | null };
const Context = createContext<Identity | null>(null);
export const usePreviewIdentity = () => useContext(Context);

export function PreviewIdentity({ children }: { children: ReactNode }) {
  const { settings, updateSettings } = useApp();
  const profile = useRef({ settings, updateSettings });
  profile.current = { settings, updateSettings };
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    let alive = true;
    let checking = false;
    let expiry: ReturnType<typeof setTimeout>;
    const controller = new AbortController();
    const check = async () => {
      if (checking) return;
      checking = true;
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}api/session`, {
          credentials: 'same-origin', cache: 'no-store', signal: controller.signal
        });
        const isJson = response.headers.get('content-type')?.includes('application/json');
        // Local/GitHub builds retain the beta flow; private Pages builds fail closed.
        if (!__PRIVATE_PREVIEW__ && (response.status === 404 || !isJson)) {
          if (alive) setReady(true);
          return;
        }
        if (!response.ok || !isJson) throw new Error('No se ha podido verificar tu sesión.');
        const data = await response.json() as Identity;
        if (data.user?.role !== 'admin' || !data.user.id || !data.user.email || !data.user.name || !Number.isFinite(data.expiresAt) || data.expiresAt <= Date.now()) {
          throw new Error('La sesión no es válida.');
        }
        if (!alive) return;
        const { settings: saved, updateSettings: update } = profile.current;
        update({ loginUser: data.user.email, displayName: saved.displayName || data.user.name, loginPassword: undefined });
        setIdentity(data); setError(''); setReady(true);
        clearTimeout(expiry);
        expiry = setTimeout(() => { setIdentity(null); setError('Tu sesión ha caducado. Vuelve a verificar el acceso.'); }, Math.min(data.expiresAt - Date.now(), 2147483647));
      } catch {
        if (alive) { setIdentity(null); setReady(true); setError('No se ha podido verificar tu acceso.'); }
      } finally { checking = false; }
    };
    void check();
    const refresh = () => { if (document.visibilityState === 'visible') void check(); };
    document.addEventListener('visibilitychange', refresh);
    return () => { alive = false; controller.abort(); clearTimeout(expiry); document.removeEventListener('visibilitychange', refresh); };
  }, []);
  if (!ready || error) return <div className="entry-page"><section className="entry-card"><BrandMark compact/><p role="status">{error || 'Entrando en tu cocina…'}</p>{error && <button className="entry-primary" onClick={() => window.location.reload()}>Volver a verificar acceso</button>}</section></div>;
  return <Context.Provider value={identity}>{children}</Context.Provider>;
}
