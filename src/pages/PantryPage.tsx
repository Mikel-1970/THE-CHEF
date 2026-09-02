import { ChevronDown, ChevronUp, Clock3, Plus, ShoppingBasket, Star, Trash2, UsersRound } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { Chip } from '../components/Chip';
import { NumberStepper } from '../components/NumberStepper';
import { PrimaryButton } from '../components/PrimaryButton';
import { TopBar } from '../components/TopBar';
import { useApp } from '../AppContext';
import type { Difficulty, IngredientInput, MealType } from '../domain/types';
import { getMockProposals } from '../services/mockRecommendationEngine';

const mealTypes: MealType[] = ['Comida', 'Cena', 'Brunch'];
const styles = ['Casera', 'Moderna', 'Rápida', 'Saludable'];
const cuisines = ['Mediterránea', 'Italiana', 'Asiática', 'Mexicana'];
const difficulties: Difficulty[] = ['Fácil', 'Media', 'Avanzada'];

export function PantryPage() {
  const navigate = useNavigate();
  const { settings, setSearch } = useApp();
  const [ingredients, setIngredients] = useState<IngredientInput[]>([
    { name: 'Pollo', priority: true },
    { name: 'Arroz' },
    { name: 'Calabacín' },
    { name: 'Huevos', quantity: 4, unit: 'ud' }
  ]);
  const [draft, setDraft] = useState('');
  const [servings, setServings] = useState(settings.defaultServings);
  const [mealType, setMealType] = useState<MealType>('Cena');
  const [maxMinutes, setMaxMinutes] = useState(40);
  const [maxPurchases, setMaxPurchases] = useState<0 | 1 | 2 | 3>(2);
  const [advanced, setAdvanced] = useState(false);
  const [style, setStyle] = useState<string>();
  const [cuisine, setCuisine] = useState<string>();
  const [difficulty, setDifficulty] = useState<Difficulty | undefined>(settings.defaultDifficulty);

  const addIngredient = (e?: FormEvent) => {
    e?.preventDefault();
    const clean = draft.trim();
    if (!clean || ingredients.some(i => i.name.toLowerCase() === clean.toLowerCase())) return;
    setIngredients([...ingredients, { name: clean }]);
    setDraft('');
  };

  const search = () => {
    const request = {
      mode: 'pantry' as const,
      servings,
      mealType,
      maxMinutes,
      maxExtraPurchases: maxPurchases,
      pantryIngredients: ingredients,
      pantryBasics: settings.pantryBasics,
      style,
      cuisine,
      difficulty
    };
    const proposals = getMockProposals(request);
    setSearch(request, proposals);
    navigate('/propuestas');
  };

  return (
    <AppShell hideNav>
      <TopBar eyebrow="ABRE LA NEVERA" title="¿Qué tenemos por ahí?" />
      <div className="page-content">
        <section className="editorial-card intro-card olive-intro">
          <span className="eyebrow">APROVECHA LO QUE HAY</span>
          <h2>Cuéntame lo que tienes.</h2>
          <p>Las cantidades son opcionales. Marca con ★ lo que quieras aprovechar especialmente.</p>
        </section>

        <section className="form-section">
          <div className="section-label"><span>Ingredientes</span><small>Pulsa ★ para priorizar</small></div>
          <form className="ingredient-input" onSubmit={addIngredient}>
            <input value={draft} onChange={e => setDraft(e.target.value)} placeholder="Ej. tomate, salmón, pasta…" />
            <button type="submit" aria-label="Añadir ingrediente"><Plus size={19} /></button>
          </form>
          <div className="ingredient-pills">
            {ingredients.map((item, index) => (
              <div className={`ingredient-pill ${item.priority ? 'priority' : ''}`} key={`${item.name}-${index}`}>
                <button className="star-toggle" onClick={() => setIngredients(ingredients.map((x, i) => i === index ? { ...x, priority: !x.priority } : x))}><Star size={15} fill={item.priority ? 'currentColor' : 'none'} /></button>
                <span>{item.name}{item.quantity ? ` · ${item.quantity}${item.unit ?? ''}` : ''}</span>
                <button onClick={() => setIngredients(ingredients.filter((_, i) => i !== index))}><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
          <div className="pantry-basics-note"><span>Básicos activos:</span> {settings.pantryBasics.join(' · ')} <button onClick={() => navigate('/ajustes')}>Editar</button></div>
        </section>

        <section className="control-card">
          <div className="control-row"><div className="control-title"><UsersRound size={19} /><div><strong>Somos</strong><small>Comensales</small></div></div><NumberStepper value={servings} onChange={setServings} /></div>
          <div className="divider" />
          <div className="control-stack"><div className="control-title"><Clock3 size={19} /><div><strong>Tiempo máximo</strong><small>Tiempo total</small></div></div><div className="range-row"><input type="range" min="15" max="90" step="5" value={maxMinutes} onChange={e => setMaxMinutes(Number(e.target.value))} /><span>{maxMinutes} min</span></div></div>
          <div className="divider" />
          <div className="control-stack"><div className="control-title"><ShoppingBasket size={19} /><div><strong>Puedo comprar</strong><small>Ingredientes adicionales</small></div></div><div className="chip-row compact">{[0,1,2,3].map(n => <Chip key={n} selected={maxPurchases === n} onClick={() => setMaxPurchases(n as 0|1|2|3)}>{n === 3 ? '3+' : n}</Chip>)}</div></div>
        </section>

        <section className="form-section"><div className="section-label"><span>Tipo de comida</span></div><div className="chip-row">{mealTypes.map(m => <Chip key={m} selected={mealType === m} onClick={() => setMealType(m)}>{m}</Chip>)}</div></section>
        <button className="advanced-toggle" onClick={() => setAdvanced(v => !v)}><span>Más opciones</span>{advanced ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</button>
        {advanced && <section className="advanced-panel"><div className="advanced-group"><strong>Estilo</strong><div className="chip-row">{styles.map(v => <Chip key={v} selected={style === v} onClick={() => setStyle(style === v ? undefined : v)}>{v}</Chip>)}</div></div><div className="advanced-group"><strong>Cocina</strong><div className="chip-row">{cuisines.map(v => <Chip key={v} selected={cuisine === v} onClick={() => setCuisine(cuisine === v ? undefined : v)}>{v}</Chip>)}</div></div><div className="advanced-group"><strong>Dificultad máxima</strong><div className="chip-row">{difficulties.map(v => <Chip key={v} selected={difficulty === v} onClick={() => setDifficulty(difficulty === v ? undefined : v)}>{v}</Chip>)}</div></div></section>}
        <div className="sticky-action"><PrimaryButton onClick={search} disabled={ingredients.length === 0}>Buscar 3 propuestas</PrimaryButton></div>
      </div>
    </AppShell>
  );
}
