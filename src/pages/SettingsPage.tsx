import { Camera, Check, ChefHat, ImagePlus, Info, Languages, Mic, MicOff, Smartphone, Sparkles, Trash2, Type, UsersRound, X } from 'lucide-react';
import { ChangeEvent, FormEvent, useState } from 'react';
import { AppShell } from '../components/AppShell';
import { Chip } from '../components/Chip';
import { NumberStepper } from '../components/NumberStepper';
import { useApp } from '../AppContext';
import { useAiDictation } from '../hooks/useAiDictation';
import type { AppLanguage, CookingLevel, FontScale, SpiceLevel } from '../services/storage';
import '../voice-input.css';

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

const AVATARS = ['👨‍🍳', '👩‍🍳', '🍅', '🍋', '🍆', '🦐', '🦀', '🐄', '🥐', '🍌'];

export function SettingsPage() {
  const { settings, updateSettings } = useApp();
  const [draft, setDraft] = useState('');
  const [profileError, setProfileError] = useState<string>();
  const voice = useAiDictation(transcript => setDraft(current => current.trim() ? `${current.trim()}, ${transcript.trim()}` : transcript.trim()));

  const addBasic = (e?: FormEvent) => {
    e?.preventDefault();
    if (voice.isListening) voice.stop();
    const values = draft.split(/[,;\n]+/).map(value => value.trim()).filter(Boolean);
    if (!values.length) return;
    const next = [...settings.pantryBasics];
    values.forEach(value => {
      if (!next.some(existing => existing.toLowerCase() === value.toLowerCase())) next.push(value);
    });
    updateSettings({ pantryBasics: next });
    setDraft('');
  };

  const chooseProfilePhoto = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setProfileError(undefined);
    try {
      const image = await prepareProfileImage(file);
      updateSettings({ profileImage: image });
    } catch (error) {
      setProfileError(error instanceof Error ? error.message : 'No se ha podido preparar la foto.');
    } finally {
      event.target.value = '';
    }
  };

  return (
    <AppShell hideBack>
      <div className="simple-page-header light-header"><span className="eyebrow">TU PERFIL DE COCINA</span><h1>Ajustes</h1><p>Preferencias para que El Chef se adapte a tu forma de cocinar.</p></div>
      <div className="page-content nav-safe settings-v03">
        <section className="settings-card profile-settings-card">
          <div className="settings-card-title"><ChefHat size={20} /><div><strong>Tu imagen en El Chef</strong><small>Elige un avatar o utiliza tu propia foto</small></div></div>
          <div className="profile-preview-row">
            <div className="profile-preview">
              {settings.profileImage ? <img src={settings.profileImage} alt="Foto de perfil" /> : <span>{settings.avatarEmoji}</span>}
              <i><ChefHat size={24} /></i>
            </div>
            <div><strong>{settings.profileImage ? 'Tu foto' : 'Tu avatar'}</strong><small>Se utilizará también durante las esperas de la aplicación.</small></div>
          </div>
          <div className="avatar-gallery" aria-label="Avatares disponibles">{AVATARS.map(avatar => <button type="button" className={!settings.profileImage && settings.avatarEmoji === avatar ? 'active' : ''} key={avatar} onClick={() => updateSettings({ avatarEmoji: avatar, profileImage: undefined })}>{avatar}</button>)}</div>
          <div className="profile-photo-actions">
            <label className="secondary-button"><Camera size={17} /> Hacer foto<input type="file" accept="image/*" capture="user" onChange={chooseProfilePhoto} /></label>
            <label className="secondary-button"><ImagePlus size={17} /> Elegir de fototeca<input type="file" accept="image/*" onChange={chooseProfilePhoto} /></label>
          </div>
          {settings.profileImage && <button className="advanced-toggle" type="button" onClick={() => updateSettings({ profileImage: undefined })}><Trash2 size={16} /> Quitar foto</button>}
          {profileError && <div className="voice-status error">{profileError}</div>}
        </section>

        <section className="settings-card">
          <div className="settings-card-title"><Languages size={20} /><div><strong>Idioma</strong><small>La estructura queda preparada para la localización de la app</small></div></div>
          <select className="settings-select" value={settings.language} onChange={event => updateSettings({ language: event.target.value as AppLanguage })}>{LANGUAGE_OPTIONS.map(option => <option value={option.value} key={option.value}>{option.label}</option>)}</select>
          {settings.language !== 'es' && <div className="pantry-basics-note">Preferencia guardada. La interfaz completa seguirá en español hasta incorporar la traducción de ese idioma.</div>}
        </section>

        <section className="control-card">
          <div className="control-row"><div className="control-title"><UsersRound size={19} /><div><strong>Comensales habituales</strong><small>Valor inicial en las búsquedas</small></div></div><NumberStepper value={settings.defaultServings} onChange={v => updateSettings({ defaultServings: v })} /></div>
        </section>

        <section className="settings-card">
          <div className="settings-card-title"><Type size={20} /><div><strong>Tamaño de texto</strong><small>Amplía las fuentes pequeñas de toda la aplicación</small></div></div>
          <div className="chip-row">{fontScaleLabels.map(option => <Chip key={option.value} selected={settings.fontScale === option.value} onClick={() => updateSettings({ fontScale: option.value })}>{option.label}</Chip>)}</div>
        </section>

        <section className="settings-card">
          <div className="settings-card-title"><ChefHat size={20} /><div><strong>Nivel de cocina</strong><small>Afectará al detalle y dificultad recomendada</small></div></div>
          <div className="chip-row">{(['Principiante','Intermedio','Avanzado'] as CookingLevel[]).map(v => <Chip key={v} selected={settings.cookingLevel === v} onClick={() => updateSettings({ cookingLevel: v })}>{v}</Chip>)}</div>
        </section>

        <section className="settings-card">
          <div className="settings-card-title"><strong>Picante habitual</strong><small>Preferencia, no restricción</small></div>
          <div className="chip-row">{(['Nada','Suave','Medio','Alto'] as SpiceLevel[]).map(v => <Chip key={v} selected={settings.spiceLevel === v} onClick={() => updateSettings({ spiceLevel: v })}>{v}</Chip>)}</div>
        </section>

        <section className="settings-card">
          <div className="settings-card-title"><strong>Básicos de despensa</strong><small>Se consideran disponibles al buscar con lo que tienes</small></div>
          <form className="ingredient-input compact-input" onSubmit={addBasic}>
            <input value={draft} onChange={e => setDraft(e.target.value)} placeholder="Añadir básico…" />
            <button type="button" className="clear-input-button" onClick={() => { voice.stop(); setDraft(''); }} disabled={!draft.trim() && !voice.isListening} aria-label="Borrar"><X size={17} /></button>
            <button type="button" className={`voice-button ${voice.isListening ? 'listening' : ''}`} onClick={voice.toggle} disabled={!voice.isSupported || voice.isTranscribing} aria-label={voice.isListening ? 'Detener dictado' : 'Dictar básicos'}>{voice.isListening ? <MicOff size={18} /> : <Mic size={18} />}</button>
            <button type="submit" className="voice-confirm-button" disabled={!draft.trim() || voice.isListening || voice.isTranscribing} aria-label="Confirmar básicos"><Check size={18} /></button>
          </form>
          {voice.isListening && <div className="voice-status listening"><Mic size={14} /> Escuchando… toca de nuevo cuando termines.</div>}
          {voice.isTranscribing && <div className="voice-status listening"><Sparkles size={14} /> Interpretando el dictado…</div>}
          {voice.error && <div className="voice-status error">{voice.error}</div>}
          <div className="basic-list">{settings.pantryBasics.map(item => <span key={item}>{item}<button onClick={() => updateSettings({ pantryBasics: settings.pantryBasics.filter(v => v !== item) })}><Trash2 size={13} /></button></span>)}</div>
        </section>

        <section className="editorial-card small-info"><Smartphone size={21} /><div><strong>PWA privada</strong><p>La versión final de pruebas se instalará desde HTTPS y podrá abrirse como una app.</p></div></section>
        <section className="editorial-card small-info"><Info size={21} /><div><strong>Versión 1</strong><p>Esta fase se centra en cerrar experiencia, fiabilidad y pruebas antes de abrir la beta privada.</p></div></section>
      </div>
    </AppShell>
  );
}

async function prepareProfileImage(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error('Selecciona un archivo de imagen.');
  const sourceUrl = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = () => reject(new Error('No se ha podido leer la imagen.'));
      element.src = sourceUrl;
    });
    const size = 320;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('No se ha podido preparar la imagen.');
    const sourceSide = Math.min(image.naturalWidth, image.naturalHeight);
    const sx = (image.naturalWidth - sourceSide) / 2;
    const sy = (image.naturalHeight - sourceSide) / 2;
    context.drawImage(image, sx, sy, sourceSide, sourceSide, 0, 0, size, size);
    return canvas.toDataURL('image/jpeg', .82);
  } finally {
    URL.revokeObjectURL(sourceUrl);
  }
}
