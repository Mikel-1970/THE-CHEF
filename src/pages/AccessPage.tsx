import { Eye, EyeOff, KeyRound, LockKeyhole, Mic, UserRound } from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';
import { useApp } from '../AppContext';
import { loadMicrophonePreference, requestMicrophoneAccess, saveMicrophonePreference } from '../utils/microphonePreference';
import '../entry-flow.css';

type AccessMode = 'login' | 'register' | 'recover';

type Props = { onAuthenticated: () => void };

export function AccessPage({ onAuthenticated }: Props) {
  const { settings, updateSettings } = useApp();
  const [mode, setMode] = useState<AccessMode>('login');
  const [name, setName] = useState(settings.displayName);
  const [user, setUser] = useState(settings.loginUser);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [micStep, setMicStep] = useState(false);
  const [micBusy, setMicBusy] = useState(false);
  const hasRegisteredUser = useMemo(() => Boolean(settings.loginUser && settings.loginPassword), [settings.loginPassword, settings.loginUser]);

  const finishAuthentication = () => {
    try { sessionStorage.setItem('chef:auth:session:v1', '1'); } catch { /* sin persistencia */ }
    onAuthenticated();
  };

  const continueAfterCredentials = () => {
    if (loadMicrophonePreference() === 'unset') setMicStep(true);
    else finishAuthentication();
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setError('');
    const cleanUser = user.trim();

    if (mode === 'login') {
      if (!hasRegisteredUser) {
        setError('Todavía no hay ningún usuario registrado en este dispositivo. Pulsa Registro.');
        return;
      }
      if (cleanUser !== settings.loginUser || password !== settings.loginPassword) {
        setError('Usuario o contraseña incorrectos.');
        return;
      }
      continueAfterCredentials();
      return;
    }

    if (mode === 'register') {
      if (!name.trim() || !cleanUser || password.length < 4) {
        setError('Completa nombre, usuario y una contraseña de al menos 4 caracteres.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden.');
        return;
      }
      updateSettings({ displayName: name.trim(), loginUser: cleanUser, loginPassword: password });
      continueAfterCredentials();
      return;
    }

    if (!hasRegisteredUser) {
      setError('No hay ningún usuario registrado en este dispositivo.');
      return;
    }
    if (cleanUser !== settings.loginUser) {
      setError('El usuario indicado no coincide con el registrado.');
      return;
    }
    if (password.length < 4 || password !== confirmPassword) {
      setError('Introduce dos veces la nueva contraseña.');
      return;
    }
    updateSettings({ loginPassword: password });
    setPassword('');
    setConfirmPassword('');
    setMode('login');
    setError('Contraseña actualizada. Ya puedes iniciar sesión.');
  };

  const allowMicrophone = async () => {
    if (micBusy) return;
    setMicBusy(true);
    await requestMicrophoneAccess();
    setMicBusy(false);
    finishAuthentication();
  };

  const skipMicrophone = () => {
    saveMicrophonePreference('disabled');
    finishAuthentication();
  };

  if (micStep) {
    return (
      <div className="entry-page">
        <section className="entry-card microphone-entry-card">
          <div className="entry-logo"><span>THE</span><strong>CHEF</strong></div>
          <div className="entry-round-icon"><Mic size={34} /></div>
          <span className="entry-eyebrow">CONFIGURACIÓN INICIAL</span>
          <h1>¿Permitir el micrófono?</h1>
          <p>Si lo permites ahora, El Chef podrá activar el dictado cuando entres en una petición sin pedirte este permiso cada vez.</p>
          <div className="entry-actions stacked">
            <button className="entry-primary" type="button" onClick={() => void allowMicrophone()} disabled={micBusy}>{micBusy ? 'Solicitando permiso…' : 'Permitir micrófono'}</button>
            <button className="entry-secondary" type="button" onClick={skipMicrophone}>Ahora no</button>
          </div>
          <small>El permiso real lo gestiona iPhone/Safari. Si lo deniegas, podrás activarlo después desde Ajustes.</small>
        </section>
      </div>
    );
  }

  return (
    <div className="entry-page">
      <section className="entry-card access-card">
        <div className="entry-logo"><span>THE</span><strong>CHEF</strong></div>
        <span className="entry-eyebrow">ACCESO</span>
        <h1>{mode === 'login' ? 'Bienvenido' : mode === 'register' ? 'Crear usuario' : 'Recuperar contraseña'}</h1>
        <p>{mode === 'login' ? 'Identifícate para entrar en tu cocina.' : mode === 'register' ? 'Crea el usuario de acceso para esta versión de The Chef.' : 'Define una nueva contraseña para el usuario registrado.'}</p>

        <form className="entry-form" onSubmit={submit}>
          {mode === 'register' && (
            <label><span>Nombre</span><div className="entry-input"><UserRound size={18} /><input value={name} onChange={event => setName(event.target.value)} autoComplete="name" placeholder="Tu nombre" /></div></label>
          )}
          <label><span>Usuario</span><div className="entry-input"><UserRound size={18} /><input value={user} onChange={event => setUser(event.target.value)} autoComplete="username" placeholder="Usuario" /></div></label>
          <label><span>{mode === 'recover' ? 'Nueva contraseña' : 'Contraseña'}</span><div className="entry-input"><KeyRound size={18} /><input type={showPassword ? 'text' : 'password'} value={password} onChange={event => setPassword(event.target.value)} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} placeholder="Contraseña" /><button type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>{showPassword ? <EyeOff size={19} /> : <Eye size={19} />}</button></div></label>
          {(mode === 'register' || mode === 'recover') && (
            <label><span>Repetir contraseña</span><div className="entry-input"><LockKeyhole size={18} /><input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} autoComplete="new-password" placeholder="Repite la contraseña" /></div></label>
          )}

          {error && <div className={`entry-message ${error.startsWith('Contraseña actualizada') ? 'success' : ''}`}>{error}</div>}
          <button className="entry-primary" type="submit">{mode === 'login' ? 'Login' : mode === 'register' ? 'Registro' : 'Guardar nueva contraseña'}</button>
        </form>

        <div className="entry-links">
          {mode !== 'login' && <button type="button" onClick={() => { setMode('login'); setError(''); setPassword(''); setConfirmPassword(''); }}>Volver a Login</button>}
          {mode === 'login' && <><button type="button" onClick={() => { setMode('register'); setError(''); setPassword(''); }}>Registro</button><button type="button" onClick={() => { setMode('recover'); setError(''); setPassword(''); setConfirmPassword(''); }}>¿Has olvidado la contraseña?</button></>}
        </div>

        <small className="entry-local-note">Acceso provisional de esta versión: los datos se guardan localmente en el dispositivo hasta conectar el sistema definitivo de usuarios.</small>
      </section>
    </div>
  );
}
