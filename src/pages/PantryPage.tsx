import { Check, Mic, MicOff, PackageOpen, ShoppingBasket, Snowflake, Sparkles, Trash2, X } from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';
import { useApp } from '../AppContext';
import { AppShell } from '../components/AppShell';
import { TopBar } from '../components/TopBar';
import type { IngredientInput, StockLocation } from '../domain/types';
import { useAiDictation } from '../hooks/useAiDictation';
import { parseIngredientInput } from '../utils/ingredientInput';
import { getPantryCategory, groupPantry, PANTRY_CATEGORIES } from '../utils/pantryCategories';
import '../voice-input.css';

const UNIT_OPTIONS = ['ud', 'g', 'kg', 'ml', 'l', 'paquete', 'bote', 'lata', 'manojo'];

export function PantryPage() {
  const { settings, updateSettings, upsertShoppingItem } = useApp();
  const stock = settings.pantryStock ?? [];
  const [draft, setDraft] = useState('');
  const [basicDraft, setBasicDraft] = useState('');
  const [newLocation, setNewLocation] = useState<StockLocation>('fridge');
  const [recentlyRemoved, setRecentlyRemoved] = useState<IngredientInput>();
  const voice = useAiDictation(transcript => setDraft(current => appendDictation(current, transcript)));
  const fridge = useMemo(() => stock.filter(item => locationOf(item) === 'fridge'), [stock]);
  const pantry = useMemo(() => stock.filter(item => locationOf(item) === 'pantry'), [stock]);

  const addProducts = (event?: FormEvent) => {
    event?.preventDefault();
    if (voice.isListening) voice.stop();
    const entries = splitIngredientEntries(draft);
    if (!entries.length) return;
    updateSettings({ pantryStock: mergeIngredientEntries(stock, entries, newLocation) });
    setDraft('');
    setRecentlyRemoved(undefined);
  };

  const addBasics = (event?: FormEvent) => {
    event?.preventDefault();
    const values = splitIngredientEntries(basicDraft);
    if (!values.length) return;
    const next = [...settings.pantryBasics];
    values.forEach(value => {
      const parsed = parseIngredientInput(value);
      const name = parsed.name || value.trim();
      if (name && !next.some(existing => normalize(existing) === normalize(name))) next.push(name);
    });
    updateSettings({ pantryBasics: next });
    setBasicDraft('');
  };

  const removeProduct = (item: IngredientInput) => {
    updateSettings({ pantryStock: stock.filter(entry => normalize(entry.name) !== normalize(item.name)) });
    setRecentlyRemoved(item);
  };

  const editProduct = (item: IngredientInput, patch: Partial<IngredientInput>) => {
    updateSettings({ pantryStock: stock.map(entry => normalize(entry.name) === normalize(item.name) ? { ...entry, ...patch } : entry) });
  };

  const addToShopping = (item: IngredientInput) => {
    upsertShoppingItem({
      id: `stock:${normalize(item.name).replace(/\s+/g, '-')}`,
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      category: item.category ?? getPantryCategory(item),
      checked: false
    });
  };

  const addRemovedToShopping = () => {
    if (!recentlyRemoved) return;
    addToShopping(recentlyRemoved);
    setRecentlyRemoved(undefined);
  };

  return (
    <AppShell hideBack hideProfile>
      <TopBar eyebrow="TU INVENTARIO" title="Despensa y nevera" />
      <div className="page-content nav-safe pantry-fridge-page">
        <section className="editorial-card olive-intro"><PackageOpen size={26} /><h2>Lo que tienes en casa.</h2><p>Nevera y despensa comparten la misma organización y están conectadas con tu lista de la compra.</p></section>

        <section className="form-section pantry-add-first">
          <div className="section-label"><span>Añadir productos</span><small>Texto o voz</small></div>
          <div className="stock-location-switch" aria-label="Dónde guardar los nuevos productos">
            <button type="button" className={newLocation === 'fridge' ? 'active' : ''} onClick={() => setNewLocation('fridge')}><Snowflake size={16} /> Nevera</button>
            <button type="button" className={newLocation === 'pantry' ? 'active' : ''} onClick={() => setNewLocation('pantry')}><PackageOpen size={16} /> Despensa</button>
          </div>
          <form className="ingredient-input pantry-add-input" onSubmit={addProducts}>
            <input value={draft} onChange={event => setDraft(event.target.value)} placeholder="Ej. 2 kg patatas, 1 l leche…" />
            <button type="button" className="clear-input-button" onClick={() => { voice.stop(); setDraft(''); }} disabled={!draft.trim() && !voice.isListening} aria-label="Borrar"><X size={18} /></button>
            <button type="button" className={`voice-button ${voice.isListening ? 'listening' : ''}`} onClick={voice.toggle} disabled={!voice.isSupported || voice.isTranscribing} aria-label={voice.isListening ? 'Detener dictado' : 'Dictar productos'}>{voice.isListening ? <MicOff size={19} /> : <Mic size={19} />}</button>
            <button type="submit" className="voice-confirm-button" disabled={!draft.trim() || voice.isListening || voice.isTranscribing} aria-label="Añadir productos"><Check size={19} /></button>
          </form>
          {voice.isListening && <div className="voice-status listening"><Mic size={14} /> Escuchando productos…</div>}
          {voice.isTranscribing && <div className="voice-status listening"><Sparkles size={14} /> Interpretando productos, cantidades y unidades…</div>}
          {voice.error && <div className="voice-status error">{voice.error}</div>}
        </section>

        {(['fridge', 'pantry'] as StockLocation[]).map(location => {
          const items = location === 'fridge' ? fridge : pantry;
          const grouped = groupPantry(items);
          return <section className="form-section stock-location-section" key={location}>
            <div className="section-label"><span>{location === 'fridge' ? 'Nevera' : 'Despensa'}</span><small>{items.length}</small></div>
            {!items.length && <div className="pantry-basics-note">No hay productos guardados aquí.</div>}
            <div className="pantry-category-list">
              {grouped.map(([category, categoryItems]) => (
                <details className="pantry-category" key={`${location}-${category}`} open>
                  <summary><strong>{category}</strong><span>{categoryItems.length}</span></summary>
                  <div className="editable-stock-list">
                    {categoryItems.map(item => (
                      <section className={`settings-card editable-stock-card pantry-stock-card ${item.quantity === undefined ? 'needs-quantity' : ''}`} key={item.name}>
                        <div className="editable-stock-main">
                          <strong>{item.name}</strong>
                          <div className="quantity-unit-editor">
                            <label><span>Cantidad</span><input inputMode="decimal" type="number" min="0" step="0.1" value={item.quantity ?? ''} placeholder="Sin indicar" onChange={event => { const raw = event.target.value; const quantity = raw === '' ? undefined : Number(raw); editProduct(item, { quantity: Number.isFinite(quantity) ? quantity : undefined }); }} /></label>
                            <label><span>Unidad</span><select value={item.unit ?? ''} onChange={event => editProduct(item, { unit: event.target.value || undefined })}><option value="">Sin indicar</option>{UNIT_OPTIONS.map(unit => <option value={unit} key={unit}>{unit}</option>)}</select></label>
                          </div>
                          <div className="pantry-edit-grid">
                            <label className="pantry-category-editor"><span>Categoría</span><select value={getPantryCategory(item)} onChange={event => editProduct(item, { category: event.target.value })}>{PANTRY_CATEGORIES.map(value => <option value={value} key={value}>{value}</option>)}</select></label>
                            <label className="pantry-category-editor"><span>Ubicación</span><select value={locationOf(item)} onChange={event => editProduct(item, { location: event.target.value as StockLocation })}><option value="fridge">Nevera</option><option value="pantry">Despensa</option></select></label>
                          </div>
                        </div>
                        <div className="stock-card-actions">
                          <button className="icon-button" type="button" onClick={() => addToShopping(item)} aria-label={`Añadir ${item.name} a la lista de compra`}><ShoppingBasket size={18} /></button>
                          <button className="icon-button" type="button" onClick={() => removeProduct(item)} aria-label={`Eliminar ${item.name}`}><Trash2 size={18} /></button>
                        </div>
                      </section>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </section>;
        })}

        <section className="form-section">
          <div className="section-label"><span>Básicos de cocina</span><small>{settings.pantryBasics.length}</small></div>
          <p className="pantry-basics-note">Se consideran disponibles por defecto al usar “Cocina con lo que hay”.</p>
          <form className="ingredient-input pantry-add-input" onSubmit={addBasics}><input value={basicDraft} onChange={event => setBasicDraft(event.target.value)} placeholder="Sal, aceite, vinagre…" /><button type="submit" className="voice-confirm-button" disabled={!basicDraft.trim()} aria-label="Añadir básicos"><Check size={18} /></button></form>
          <div className="basic-list">{settings.pantryBasics.map(item => <span key={item}>{item}<button type="button" onClick={() => updateSettings({ pantryBasics: settings.pantryBasics.filter(value => value !== item) })} aria-label={`Eliminar ${item}`}><Trash2 size={13} /></button></span>)}</div>
        </section>

        {recentlyRemoved && <section className="editorial-card" style={{ marginTop: 14 }}><ShoppingBasket size={22} /><h2>Has quitado {recentlyRemoved.name}</h2><p>¿Quieres añadirlo a la lista de la compra?</p><div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}><button className="secondary-button" type="button" onClick={addRemovedToShopping}><ShoppingBasket size={17} /> Añadir a compra</button><button className="advanced-toggle" type="button" onClick={() => setRecentlyRemoved(undefined)}>No, gracias</button></div></section>}
      </div>
    </AppShell>
  );
}

function mergeIngredientEntries(current: IngredientInput[], entries: string[], location: StockLocation) {
  const next = [...current];
  entries.forEach(entry => {
    const parsed = parseIngredientInput(entry);
    if (!parsed.name) return;
    const index = next.findIndex(item => normalize(item.name) === normalize(parsed.name));
    if (index >= 0) next[index] = { ...next[index], ...parsed, location };
    else next.push({ ...parsed, location });
  });
  return next;
}
function splitIngredientEntries(value: string) { return value.replace(/\bademás\b/gi, ',').split(/[,;\n]+|\s+(?:y|e)\s+/i).map(item => item.replace(/^[.\-–—\s]+|[.\s]+$/g, '').trim()).filter(Boolean); }
function appendDictation(current: string, transcript: string) { const base = current.trimEnd(); const clean = transcript.trim(); return base ? `${base}, ${clean}` : clean; }
function locationOf(item: IngredientInput): StockLocation { return item.location === 'fridge' ? 'fridge' : 'pantry'; }
function normalize(value: string) { return value.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim(); }
