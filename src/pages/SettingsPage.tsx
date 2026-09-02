import { ChefHat, Info, Plus, Smartphone, Trash2, UsersRound } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { AppShell } from '../components/AppShell';
import { Chip } from '../components/Chip';
import { NumberStepper } from '../components/NumberStepper';
import { useApp } from '../AppContext';
import type { CookingLevel, SpiceLevel } from '../services/storage';

export function SettingsPage() {
  const { settings, updateSettings } = useApp();
  const [draft, setDraft] = useState('');

  const addBasic = (e: FormEvent) => {
    e.preventDefault();
    const clean = draft.trim();
    if (!clean || settings.pantryBasics.some(v => v.toLowerCase() === clean.toLowerCase())) return;
    updateSettings({ pantryBasics: [...settings.pantryBasics, clean] });
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
          <div className="settings-card-title"><ChefHat size={20} /><div><strong>Nivel de cocina</strong><small>Afectará al detalle y dificultad recomendada</small></div></div>
          <div className="chip-row">{(['Principiante','Intermedio','Avanzado'] as CookingLevel[]).map(v => <Chip key={v} selected={settings.cookingLevel === v} onClick={() => updateSettings({ cookingLevel: v })}>{v}</Chip>)}</div>
        </section>

        <section className="settings-card">
          <div className="settings-card-title"><strong>Picante habitual</strong><small>Preferencia, no restricción</small></div>
          <div className="chip-row">{(['Nada','Suave','Medio','Alto'] as SpiceLevel[]).map(v => <Chip key={v} selected={settings.spiceLevel === v} onClick={() => updateSettings({ spiceLevel: v })}>{v}</Chip>)}</div>
        </section>

        <section className="settings-card">
          <div className="settings-card-title"><strong>Básicos de despensa</strong><small>No se contarán como compra adicional</small></div>
          <form className="ingredient-input compact-input" onSubmit={addBasic}><input value={draft} onChange={e => setDraft(e.target.value)} placeholder="Añadir básico…" /><button><Plus size={19} /></button></form>
          <div className="basic-list">{settings.pantryBasics.map(item => <span key={item}>{item}<button onClick={() => updateSettings({ pantryBasics: settings.pantryBasics.filter(v => v !== item) })}><Trash2 size={13} /></button></span>)}</div>
        </section>

        <section className="editorial-card small-info"><Smartphone size={21} /><div><strong>PWA privada</strong><p>Una vez publicada por HTTPS, podrás instalarla desde Safari con “Añadir a pantalla de inicio”.</p></div></section>
        <section className="editorial-card small-info"><Info size={21} /><div><strong>V0.3 sin costes de IA</strong><p>El motor de esta versión es local. La arquitectura queda preparada para sustituirlo después por el motor de IA sin rehacer las pantallas.</p></div></section>
      </div>
    </AppShell>
  );
}
