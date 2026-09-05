import { Check, Circle, Share2, ShoppingBasket, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { useApp } from '../AppContext';
import { formatQuantity } from '../utils/scaling';
import '../recipe-enhancements.css';

export function ShoppingListPage() {
  const navigate = useNavigate();
  const { shoppingList, toggleShoppingItem, removeShoppingItem, clearShoppingList } = useApp();
  const originRecipeId = shoppingList.find(item => item.recipeId)?.recipeId;

  const buildShareText = () => {
    const pending = shoppingList.filter(item => !item.checked);
    const rows = pending.map(item => {
      const quantity = item.quantity !== undefined
        ? `${formatQuantity(item.quantity)} ${item.unit ?? ''}`.trim()
        : 'cantidad por revisar';
      return `• ${item.name} — ${quantity}`;
    });
    return ['🛒 Lista de compra · The Chef', '', ...rows].join('\n');
  };

  const returnToRecipe = () => {
    if (originRecipeId) navigate(`/receta/${originRecipeId}`, { replace: true });
  };

  const shareList = async () => {
    const text = buildShareText();
    if (!text.trim() || !shoppingList.some(item => !item.checked)) return;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Lista de compra · The Chef', text });
        returnToRecipe();
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
      }
    }
    await navigator.clipboard?.writeText(text);
    window.alert('Lista copiada. Ya puedes pegarla en WhatsApp o donde quieras.');
    returnToRecipe();
  };

  const sendWhatsApp = async () => {
    const text = buildShareText();
    if (!text.trim() || !shoppingList.some(item => !item.checked)) return;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Lista de compra · The Chef', text });
        returnToRecipe();
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
      }
    }
    await navigator.clipboard?.writeText(text);
    window.alert('Lista copiada. Ábrela en WhatsApp y pégala.');
    returnToRecipe();
  };

  return (
    <AppShell>
      <div className="simple-page-header light-header"><span className="eyebrow">LO QUE FALTA</span><h1>Lista de compra</h1><p>Los ingredientes que marques como “Me falta” en una receta aparecerán aquí.</p></div>
      <div className="page-content nav-safe">
        {!shoppingList.length && <section className="editorial-card olive-intro"><ShoppingBasket size={24} /><h2>La lista está vacía.</h2><p>Abre una receta, marca los ingredientes que no tienes y se añadirán automáticamente.</p></section>}

        <div style={{ display: 'grid', gap: 10 }}>
          {shoppingList.map(item => (
            <section className="settings-card" key={item.id} style={{ display: 'grid', gridTemplateColumns: '42px 1fr 42px', alignItems: 'center', gap: 10, opacity: item.checked ? .58 : 1 }}>
              <button className="icon-button" onClick={() => toggleShoppingItem(item.id)} aria-label={item.checked ? 'Marcar pendiente' : 'Marcar comprado'}>
                {item.checked ? <Check size={20} /> : <Circle size={20} />}
              </button>
              <div style={{ minWidth: 0 }}>
                <strong style={{ display: 'block', textDecoration: item.checked ? 'line-through' : 'none' }}>{item.name}</strong>
                <small style={{ display: 'block', marginTop: 3 }}>
                  {item.quantity !== undefined ? `${formatQuantity(item.quantity)} ${item.unit ?? ''}` : 'Cantidad por revisar'}
                  {item.recipeTitle ? ` · ${item.recipeTitle}` : ''}
                </small>
              </div>
              <button className="icon-button" onClick={() => removeShoppingItem(item.id)} aria-label="Eliminar de la lista"><Trash2 size={18} /></button>
            </section>
          ))}
        </div>

        {!!shoppingList.length && (
          <div className="shopping-share-actions">
            <button className="secondary-button" type="button" onClick={() => void shareList()}><Share2 size={17} /> Compartir lista</button>
            <button className="secondary-button whatsapp-share-button" type="button" onClick={() => void sendWhatsApp()}>WhatsApp</button>
            <button className="advanced-toggle" onClick={clearShoppingList}><Trash2 size={17} /> Vaciar lista</button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
