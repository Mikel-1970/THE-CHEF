import { ChefHat, Eye, EyeOff, Info, KeyRound, Languages, Smartphone, Type, UserRound, UsersRound } from 'lucide-react';
import { useState } from 'react';
import { AppShell } from '../components/AppShell';
import { ChefAvatar, CHEF_AVATARS, normalizeChefAvatar } from '../components/ChefAvatar';
import { Chip } from '../components/Chip';
import { NumberStepper } from '../components/NumberStepper';
import { useApp } from '../AppContext';
import type { AppLanguage, CookingLevel, FontScale, SpiceLevel } from '../services/storage';

const fontScaleLabels: Array<{ value: FontScale; label: string }> = [
  { value: 'normal', label: 'Normal' },
  { value: 'large', label: 'Grande' },
  { value: 'xlarge', label: 'Muy grande' }
];

const LANGUAGE_OPTIONS: Array<{ value: AppLanguage; label: string }> = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'it', label: 'Italiano' },
  { value: 'pt', label: 'Português' },
  { value: 'zh', label: '中文' }
];

export function SettingsPage() {
  const { settings, updateSettings } = useApp();
  const currentAvatar = normalizeChefAvatar(settings.avatarEmoji);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AppShell hideBack>
      <div className="simple-page-header light-header"><span className="eyebrow">TU PERFIL DE COCINA</span><h1>Ajustes</h1><p>Preferencias para que El Chef se adapte a tu forma de cocinar.</p></div>
      <div className="page-content nav-safe settings-v03">
        <section className="settings-card">
          <div className="settings-card-title"><UserRound size={20} /><div><strong>Datos de usuario</strong><small>Información preparada para el futuro acceso personal.</small></div></div>
          <div className="settings-user-fields">
            <label><span>Nombre</span><input value={settings.displayName} onChange={event => updateSettings({ displayName: event.target.value })} autoComplete="name" placeholder="Tu nombre" /></label>
            <label><span>Usuario de acceso</span><input value={settings.loginUser} onChange={event => updateSettings({ loginUser: event.target.value })} autoComplete="username" placeholder="Usuario" /></label>
            <label><span>Contraseña</span><div className="password-field"><KeyRound size={17} /><input type={showPassword ? 'text' : 'password'} value={settings.loginPassword} onChange={event => updateSettings({ loginPassword: event.target.value })} autoComplete="current-password" placeholder="Contraseña" /><button type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>{showPassword ? <EyeOff size={19} /> : <Eye size={19} />}</button></div></label>
          </div>
          <div className="pantry-basics-note">En esta versión los datos se guardan solo en este dispositivo; el acceso real con cuenta se conectará cuando exista el backend de usuarios.</div>
        </section>

        <section className="settings-card profile-settings-card">
          <div className="settings-card-title"><ChefHat size={20} /><div><strong>Tu avatar en El Chef</strong><small>Elige uno de los 16 personajes ilustrados.</small></div></div>
          <div className="profile-preview-row">
            <ChefAvatar avatar={settings.avatarEmoji} size={74} showHat={false} />
            <div><strong>Tu avatar</strong><small>Se utiliza también en el botón de Perfil y durante las esperas.</small></div>
          </div>
          <div className="avatar-gallery" aria-label="Avatares disponibles">
            {CHEF_AVATARS.map(avatar => (
              <button type="button" className={currentAvatar === avatar.id ? 'active' : ''} key={avatar.id} onClick={() => updateSettings({ avatarEmoji: avatar.id, profileImage: undefined })} aria-label={`Elegir avatar ${avatar.label}`}>
                <ChefAvatar avatar={avatar.id} size={48} showHat={false} />
              </button>
            ))}
          </div>
        </section>

        <section className="settings-card">
          <div className="settings-card-title"><Languages size={20} /><div><strong>Idioma</strong><small>Preferencia preparada para la localización de la app.</small></div></div>
          <select className="settings-select" value={settings.language} onChange={event => updateSettings({ language: event.target.value as AppLanguage })}>{LANGUAGE_OPTIONS.map(option => <option value={option.value} key={option.value}>{option.label}</option>)}</select>
          {settings.language !== 'es' && <div className="pantry-basics-note">Preferencia guardada. La interfaz completa seguirá en español hasta incorporar la traducción de ese idioma.</div>}
        </section>

        <section className="control-card">
          <div className="control-row"><div className="control-title"><UsersRound size={19} /><div><strong>Comensales habituales</strong><small>Valor inicial en las búsquedas</small></div></div><NumberStepper value={settings.defaultServings} onChange={v => updateSettings({ defaultServings: v })} /></div>
        </section>

        <section className="settings-card">
          <div className="settings-card-title"><Type size={20} /><div><strong>Tamaño de texto</strong><small>Amplía las fuentes pequeñas de toda la aplicación.</small></div></div>
          <div className="chip-row">{fontScaleLabels.map(option => <Chip key={option.value} selected={settings.fontScale === option.value} onClick={() => updateSettings({ fontScale: option.value })}>{option.label}</Chip>)}</div>
        </section>

        <section className="settings-card">
          <div className="settings-card-title"><ChefHat size={20} /><div><strong>Nivel de cocina</strong><small>Afecta al detalle y dificultad recomendada.</small></div></div>
          <div className="chip-row">{(['Principiante','Intermedio','Avanzado'] as CookingLevel[]).map(v => <Chip key={v} selected={settings.cookingLevel === v} onClick={() => updateSettings({ cookingLevel: v })}>{v}</Chip>)}</div>
        </section>

        <section className="settings-card">
          <div className="settings-card-title"><strong>Picante habitual</strong><small>Preferencia, no restricción.</small></div>
          <div className="chip-row">{(['Nada','Suave','Medio','Alto'] as SpiceLevel[]).map(v => <Chip key={v} selected={settings.spiceLevel === v} onClick={() => updateSettings({ spiceLevel: v })}>{v}</Chip>)}</div>
        </section>

        <section className="editorial-card small-info"><Smartphone size={21} /><div><strong>PWA privada</strong><p>La versión final de pruebas se instalará desde HTTPS y podrá abrirse como una app.</p></div></section>
        <section className="editorial-card small-info"><Info size={21} /><div><strong>Versión 1</strong><p>Esta fase se centra en cerrar experiencia, fiabilidad y pruebas antes de abrir la beta privada.</p></div></section>
      </div>
    </AppShell>
  );
}
