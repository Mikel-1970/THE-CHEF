import { Check, ChefHat, Info, Mic, MicOff, Smartphone, Sparkles, Trash2, Type, UsersRound, X } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { AppShell } from '../components/AppShell';
import { Chip } from '../components/Chip';
import { NumberStepper } from '../components/NumberStepper';
import { useApp } from '../AppContext';
import { useAiDictation } from '../hooks/useAiDictation';
import type { CookingLevel, FontScale, SpiceLevel } from '../services/storage';
import '../voice-input.css';

const fontScaleLabels: Array<{ value: FontScale; label: string }> = [
  { value: 'normal', label: 'Normal' },
  { value: 'large', label: 'Grande' },
  { value: 'xlarge', label: 'Muy grande' }
];

export function SettingsPage() {
  const { settings, updateSettings } = useApp();
  const [draft, setDraft] = useState('');
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

  return (
    <AppShell>
      <div className="simple-page-header light-header"><span className="eyebrow">TU PERFIL DE COCINA</span><h1>Ajustes</h1><p>Preferencias locales para que el prototipo se parezca cada vez más a tu forma de cocinar.</p></div>
      <div className="page-content nav-safe settings-v03">
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

        <section className="editorial-card small-info"><Smartphone size={21} /><div><strong>PWA privada</strong><p>Una vez publicada por HTTPS, podrás instalarla desde Safari con “Añadir a pantalla de inicio”.</p></div></section>
        <section className="editorial-card small-info"><Info size={21} /><div><strong>V0.4 en evolución</strong><p>El motor de esta fase sigue siendo local. La búsqueda, las sustituciones y la lista de compra ya quedan separadas para conectar después el motor de IA sin rehacer la navegación.</p></div></section>
      </div>
    </AppShell>
  );
}
