import { Check, Mic, MicOff, PackageOpen, ShoppingBasket, Sparkles, Trash2, X } from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';
import { useApp } from '../AppContext';
import { AppShell } from '../components/AppShell';
import { TopBar } from '../components/TopBar';
import type { IngredientInput } from '../domain/types';
import { useAiDictation } from '../hooks/useAiDictation';
import { parseIngredientInput } from '../utils/ingredientInput';
import '../voice-input.css';

const UNIT_OPTIONS = ['ud', 'g', 'kg', 'ml', 'l', 'paquete', 'bote', 'lata', 'manojo'];

export function PantryPage() {
  const { settings, updateSettings, upsertShoppingItem } = useApp();
  const pantry = settings.pantryStock ?? [];
  const [draft, setDraft] = useState('');
  const [recentlyRemoved, setRecentlyRemoved] = useState<IngredientInput>();
  const voice = useAiDictation(transcript => setDraft(current => appendDictation(current, transcript)));
  const sorted = useMemo(() => [...pantry].sort((a, b) => a.name.localeCompare(b.name, 'es')), [pantry]);

  const addProducts = (event?: FormEvent) => {
    event?.preventDefault();
    if (voice.isListening) voice.stop();
    const entries = splitIngredientEntries(draft);
    if (!entries.length) return;
    updateSettings({ pantryStock: mergeIngredientEntries(pantry, entries) });
    setDraft('');
    setRecentlyRemoved(undefined);
  };

  const removeProduct = (item: IngredientInput) => {
    updateSettings({ pantryStock: pantry.filter(entry => normalize(entry.name) !== normalize(item.name)) });
    setRecentlyRemoved(item);
  };

  const editProduct = (item: IngredientInput, patch: Partial<IngredientInput>) => {
    updateSettings({
      pantryStock: pantry.map(entry => normalize(entry.name) === normalize(item.name) ? { ...entry, ...patch } : entry)
    });
  };

  const addRemovedToShopping = () => {
    if (!recentlyRemoved) return;
    upsertShoppingItem({
      id: `manual:${normalize(recentlyRemoved.name).replace(/\s+/g, '-')}`,
      name: recentlyRemoved.name,
      quantity: recentlyRemoved.quantity,
      unit: recentlyRemoved.unit,
      checked: false
    });
    setRecentlyRemoved(undefined);
  };

  return (
    <AppShell hideBack hideProfile>
      <TopBar eyebrow="TU INVENTARIO" title="Despensa" />
      <div className="page-content nav-safe">
        <section className="editorial-card olive-intro"><PackageOpen size={26} /><h2>Lo que tienes en casa.</h2><p>Este apartado guarda tu inventario. Para cocinar con estos productos usa “Cocina con lo que tienes” desde Inicio.</p></section>

        <section className="form-section pantry-add-first">
          <div className="section-label"><span>Añadir productos</span><small>Texto o voz</small></div>
          <form className="ingredient-input pantry-add-input" onSubmit={addProducts}>
            <input value={draft} onChange={event => setDraft(event.target.value)} placeholder="Ej. 2 kg patatas, 1 l leche…" />
            <button type="button" className="clear-input-button" onClick={() => { voice.stop(); setDraft(''); }} disabled={!draft.trim() && !voice.isListening} aria-label="Borrar"><X size={18} /></button>
            <button type="button" className={`voice-button ${voice.isListening ? 'listening' : ''}`} onClick={voice.toggle} disabled={!voice.isSupported || voice.isTranscribing} aria-label={voice.isListening ? 'Detener dictado' : 'Dictar productos'}>{voice.isListening ? <MicOff size={19} /> : <Mic size={19} />}</button>
            <button type="submit" className="voice-confirm-button" disabled={!draft.trim() || voice.isListening || voice.isTranscribing} aria-label="Añadir productos"><Check size={19} /></button>
          </form>
          {voice.isListening && <div className="voice-status listening"><Mic size={14} /> Escuchando productos…</div>}
          {voice.isTranscribing && <div className="voice-status listening"><Sparkles size={14} /> Interpretando el dictado…</div>}
          {voice.error && <div className="voice-status error">{voice.error}</div>}
        </section>

        <section className="form-section">
          <div className="section-label"><span>Productos disponibles</span><small>{pantry.length}</small></div>
          {!sorted.length && <div className="pantry-basics-note">Todavía no tienes productos guardados en la despensa.</div>}
          <div className="editable-stock-list">
            {sorted.map(item => (
              <section className="settings-card editable-stock-card pantry-stock-card" key={item.name}>
                <div className="editable-stock-main">
                  <strong>{item.name}</strong>
                  <div className="quantity-unit-editor">
                    <label><span>Cantidad</span><input inputMode="decimal" type="number" min="0" step="0.1" value={item.quantity ?? ''} placeholder="—" onChange={event => { const raw = event.target.value; const quantity = raw === '' ? undefined : Number(raw); editProduct(item, { quantity: Number.isFinite(quantity) ? quantity : undefined }); }} /></label>
                    <label><span>Unidad</span><select value={item.unit ?? ''} onChange={event => editProduct(item, { unit: event.target.value || undefined })}><option value="">Sin indicar</option>{UNIT_OPTIONS.map(unit => <option value={unit} key={unit}>{unit}</option>)}</select></label>
                  </div>
                </div>
                <button className="icon-button" type="button" onClick={() => removeProduct(item)} aria-label={`Eliminar ${item.name}`}><Trash2 size={18} /></button>
              </section>
            ))}
          </div>
        </section>

        {recentlyRemoved && (
          <section className="editorial-card" style={{ marginTop: 14 }}>
            <ShoppingBasket size={22} />
            <h2>Has quitado {recentlyRemoved.name}</h2>
            <p>¿Quieres añadirlo a la lista de la compra?</p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button className="secondary-button" type="button" onClick={addRemovedToShopping}><ShoppingBasket size={17} /> Añadir a compra</button>
              <button className="advanced-toggle" type="button" onClick={() => setRecentlyRemoved(undefined)}>No, gracias</button>
            </div>
          </section>
        )}
      </div>
    </AppShell>
  );
}

function mergeIngredientEntries(current: IngredientInput[], entries: string[]) { const next = [...current]; entries.forEach(entry => { const parsed = parseIngredientInput(entry); if (!parsed.name) return; const index = next.findIndex(item => normalize(item.name) === normalize(parsed.name)); if (index >= 0) next[index] = { ...next[index], ...parsed }; else next.push(parsed); }); return next; }
function splitIngredientEntries(value: string) { return value.replace(/\bademás\b/gi, ',').split(/[,;\n]+|\s+(?:y|e)\s+/i).map(item => item.replace(/^[.\-–—\s]+|[.\s]+$/g, '').trim()).filter(Boolean); }
function appendDictation(current: string, transcript: string) { const base = current.trimEnd(); const clean = transcript.trim(); return base ? `${base}, ${clean}` : clean; }
function normalize(value: string) { return value.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim(); }
