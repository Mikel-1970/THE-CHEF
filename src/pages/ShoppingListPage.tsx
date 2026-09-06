import { Check, Circle, Mic, MicOff, Share2, ShoppingBasket, Sparkles, Trash2, X } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { AppShell } from '../components/AppShell';
import { useApp } from '../AppContext';
import { useAiDictation } from '../hooks/useAiDictation';
import { parseIngredientInput } from '../utils/ingredientInput';
import { formatQuantity } from '../utils/scaling';
import '../recipe-enhancements.css';
import '../voice-input.css';

export function ShoppingListPage() {
  const { shoppingList, toggleShoppingItem, removeShoppingItem, clearShoppingList, upsertShoppingItem } = useApp();
  const [draft, setDraft] = useState('');
  const voice = useAiDictation(transcript => setDraft(current => appendDictation(current, transcript)));

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
    <AppShell>
      <div className="simple-page-header light-header"><span className="eyebrow">TU CESTA</span><h1>Lista de compra</h1><p>Úsala de forma independiente o deja que las recetas añadan automáticamente lo que te falte.</p></div>
      <div className="page-content nav-safe">
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

        <div style={{ display: 'grid', gap: 10 }}>
          {shoppingList.map(item => (
            <section className="settings-card" key={item.id} style={{ display: 'grid', gridTemplateColumns: '42px 1fr 42px', alignItems: 'center', gap: 10, opacity: item.checked ? .58 : 1 }}>
              <button className="icon-button" onClick={() => toggleShoppingItem(item.id)} aria-label={item.checked ? 'Marcar pendiente' : 'Marcar comprado'}>{item.checked ? <Check size={20} /> : <Circle size={20} />}</button>
              <div style={{ minWidth: 0 }}><strong style={{ display: 'block', textDecoration: item.checked ? 'line-through' : 'none' }}>{item.name}</strong><small style={{ display: 'block', marginTop: 3 }}>{item.quantity !== undefined ? `${formatQuantity(item.quantity)} ${item.unit ?? ''}`.trim() : 'Cantidad no indicada'}{item.recipeTitle ? ` · ${item.recipeTitle}` : ''}</small></div>
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
