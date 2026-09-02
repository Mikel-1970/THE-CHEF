import { Check, Circle, ShoppingBasket, Trash2 } from 'lucide-react';
import { AppShell } from '../components/AppShell';
import { useApp } from '../AppContext';
import { formatQuantity } from '../utils/scaling';

export function ShoppingListPage() {
  const { shoppingList, toggleShoppingItem, removeShoppingItem, clearShoppingList } = useApp();

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

        {!!shoppingList.length && <button className="advanced-toggle" onClick={clearShoppingList}><Trash2 size={17} /> Vaciar lista</button>}
      </div>
    </AppShell>
  );
}
