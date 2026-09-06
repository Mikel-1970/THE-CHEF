import { ArrowLeft, Check, Circle, Mic, MicOff, Share2, ShoppingBasket, Sparkles, Trash2, X } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { useApp } from '../AppContext';
import { useAiDictation } from '../hooks/useAiDictation';
import { parseIngredientInput } from '../utils/ingredientInput';
import { formatQuantity } from '../utils/scaling';
import '../recipe-enhancements.css';
import '../voice-input.css';

const UNIT_OPTIONS = ['ud', 'g', 'kg', 'ml', 'l', 'paquete', 'bote', 'lata', 'manojo'];

export function ShoppingListPage() {
  const navigate = useNavigate();
  const { shoppingList, toggleShoppingItem, removeShoppingItem, clearShoppingList, upsertShoppingItem } = useApp();
  const [draft, setDraft] = useState('');
  const voice = useAiDictation(transcript => setDraft(current => appendDictation(current, transcript)));
  const originRecipeId = shoppingList.find(item => item.recipeId)?.recipeId;

  const addItems = (event?: FormEvent) => {
    event?.preventDefault();
    if (voice.isListening) voice.stop();
    const entries = splitEntries(draft);
    entries.forEach(entry => {
      const parsed = parseIngredientInput(entry);
      if (!parsed.name) return;
      upsertShoppingItem({
        id: `manual:${normalize(parsed.name).replace(/\s+/g, '-')}`,
        name: parsed.name,
        quantity: parsed.quantity,
        unit: parsed.unit,
        checked: false
      });
    });
    if (entries.length) setDraft('');
  };

  const updateQuantity = (id: string, value: string) => {
    const item = shoppingList.find(entry => entry.id === id);
    if (!item) return;
    const parsed = value === '' ? undefined : Number(value);
    upsertShoppingItem({ ...item, quantity: Number.isFinite(parsed) ? parsed : undefined });
  };

  const updateUnit = (id: string, unit: string) => {
    const item = shoppingList.find(entry => entry.id === id);
    if (!item) return;
    upsertShoppingItem({ ...item, unit: unit || undefined });
  };

  const buildShareText = () => {
    const pending = shoppingList.filter(item => !item.checked);
    const rows = pending.map(item => {
      const quantity = item.quantity !== undefined
        ? `${formatQuantity(item.quantity)} ${item.unit ?? ''}`.trim()
        : 'cantidad por revisar';
      return `• ${item.name} — ${quantity}`;
    });
    return ['🛒 Lista de compra · El Chef', '', ...rows].join('\n');
  };

  const shareList = async () => {
    const text = buildShareText();
    if (!shoppingList.some(item => !item.checked)) return;
    if (navigator.share) {
      try { await navigator.share({ title: 'Lista de compra · El Chef', text }); return; }
      catch (error) { if (error instanceof DOMException && error.name === 'AbortError') return; }
    }
    await navigator.clipboard?.writeText(text);
    window.alert('Lista copiada. Ya puedes pegarla donde quieras.');
  };

  return (
    <AppShell hideBack hideProfile>
      <div className="simple-page-header light-header"><span className="eyebrow">TU CESTA</span><h1>Lista de compra</h1><p>Úsala de forma independiente o deja que las recetas añadan automáticamente lo que te falte.</p></div>
      <div className="page-content nav-safe">
        {originRecipeId && <button className="secondary-button return-to-recipe" type="button" onClick={() => navigate(`/receta/${originRecipeId}`)}><ArrowLeft size={17} /> Volver a la receta</button>}

        <section className="form-section">
          <div className="section-label"><span>Añadir productos</span><small>Texto o voz</small></div>
          <form className="ingredient-input pantry-add-input" onSubmit={addItems}>
            <input value={draft} onChange={event => setDraft(event.target.value)} placeholder="Ej. 2 kg patatas, 1 l leche…" />
            <button type="button" className="clear-input-button" onClick={() => { voice.stop(); setDraft(''); }} disabled={!draft.trim() && !voice.isListening} aria-label="Borrar"><X size={18} /></button>
            <button type="button" className={`voice-button ${voice.isListening ? 'listening' : ''}`} onClick={voice.toggle} disabled={!voice.isSupported || voice.isTranscribing} aria-label={voice.isListening ? 'Detener dictado' : 'Dictar compra'}>{voice.isListening ? <MicOff size={19} /> : <Mic size={19} />}</button>
            <button type="submit" className="voice-confirm-button" disabled={!draft.trim() || voice.isListening || voice.isTranscribing} aria-label="Añadir a la lista"><Check size={19} /></button>
          </form>
          {voice.isListening && <div className="voice-status listening"><Mic size={14} /> Escuchando la compra…</div>}
          {voice.isTranscribing && <div className="voice-status listening"><Sparkles size={14} /> Interpretando productos y cantidades…</div>}
          {voice.error && <div className="voice-status error">{voice.error}</div>}
        </section>

        {!shoppingList.length && <section className="editorial-card olive-intro"><ShoppingBasket size={24} /><h2>La lista está vacía.</h2><p>Añade aquí cualquier producto que quieras comprar, aunque no esté relacionado con una receta.</p></section>}

        <div className="editable-stock-list">
          {shoppingList.map(item => (
            <section className={`settings-card editable-stock-card ${item.checked ? 'checked' : ''}`} key={item.id}>
              <button className="icon-button" onClick={() => toggleShoppingItem(item.id)} aria-label={item.checked ? 'Marcar pendiente' : 'Marcar comprado'}>{item.checked ? <Check size={20} /> : <Circle size={20} />}</button>
              <div className="editable-stock-main">
                <strong className={item.checked ? 'strike' : ''}>{item.name}</strong>
                {item.recipeTitle && <small>Para {item.recipeTitle}</small>}
                <div className="quantity-unit-editor">
                  <label><span>Cantidad</span><input inputMode="decimal" type="number" min="0" step="0.1" value={item.quantity ?? ''} placeholder="—" onChange={event => updateQuantity(item.id, event.target.value)} /></label>
                  <label><span>Unidad</span><select value={item.unit ?? ''} onChange={event => updateUnit(item.id, event.target.value)}><option value="">Sin indicar</option>{UNIT_OPTIONS.map(unit => <option value={unit} key={unit}>{unit}</option>)}</select></label>
                </div>
              </div>
              <button className="icon-button" onClick={() => removeShoppingItem(item.id)} aria-label="Eliminar de la lista"><Trash2 size={18} /></button>
            </section>
          ))}
        </div>

        {!!shoppingList.length && <div className="shopping-share-actions"><button className="secondary-button" type="button" onClick={() => void shareList()}><Share2 size={17} /> Compartir lista</button><button className="advanced-toggle" onClick={clearShoppingList}><Trash2 size={17} /> Vaciar lista</button></div>}
      </div>
    </AppShell>
  );
}

function splitEntries(value: string) { return value.replace(/\bademás\b/gi, ',').split(/[,;\n]+|\s+(?:y|e)\s+/i).map(item => item.replace(/^[.\-–—\s]+|[.\s]+$/g, '').trim()).filter(Boolean); }
function appendDictation(current: string, transcript: string) { const base = current.trimEnd(); const clean = transcript.trim(); return base ? `${base}, ${clean}` : clean; }
function normalize(value: string) { return value.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim(); }
