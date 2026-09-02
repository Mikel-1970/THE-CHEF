import { ChevronDown, ChevronUp, Clock3, Sparkles, UsersRound, WandSparkles } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { Chip } from '../components/Chip';
import { NumberStepper } from '../components/NumberStepper';
import { PrimaryButton } from '../components/PrimaryButton';
import { TopBar } from '../components/TopBar';
import { useApp } from '../AppContext';
import type { Difficulty, MealType } from '../domain/types';
import { getMockProposals } from '../services/mockRecommendationEngine';

const suggestions = ['Algo italiano', 'Pollo', 'Pasta', 'Algo rápido', 'Algo ligero'];
const styles = ['Casera', 'Moderna', 'Rápida', 'Saludable'];
const cuisines = ['Mediterránea', 'Italiana', 'Asiática', 'Mexicana'];
const difficulties: Difficulty[] = ['Fácil', 'Media', 'Avanzada'];

export function DesirePage() {
  const navigate = useNavigate();
  const { settings, setSearch } = useApp();
  const [text, setText] = useState('Una cena moderna con pollo, no muy complicada');
  const [servings, setServings] = useState(settings.defaultServings);
  const [mealType, setMealType] = useState<MealType>('Cena');
  const [maxMinutes, setMaxMinutes] = useState(45);
  const [advanced, setAdvanced] = useState(false);
  const [style, setStyle] = useState<string>();
  const [cuisine, setCuisine] = useState<string>();
  const [difficulty, setDifficulty] = useState<Difficulty | undefined>(settings.defaultDifficulty);

  const search = () => {
    const request = { mode: 'desire' as const, servings, mealType, maxMinutes, desireText: text, style, cuisine, difficulty };
    const proposals = getMockProposals(request);
    setSearch(request, proposals);
    navigate('/propuestas');
  };

  return (
    <AppShell hideNav>
      <TopBar eyebrow="EL CHEF SE ENCARGA" title="¿Qué te apetece hoy?" />
      <div className="page-content">
        <section className="editorial-card desire-intro olive-intro"><span className="eyebrow">PÍDELO A TU MANERA</span><h2>Háblame como lo harías en casa.</h2><p>Escribe lo que te apetece y usa los filtros solo cuando realmente te ayuden.</p></section>
        <section className="form-section"><div className="section-label"><span>Hoy me apetece…</span></div><div className="desire-box"><WandSparkles size={22} /><textarea rows={5} value={text} onChange={e => setText(e.target.value)} placeholder="Ej. una cena italiana con pollo, fácil y en menos de 40 minutos…" /></div><div className="suggestion-row">{suggestions.map(s => <button key={s} onClick={() => setText(s)}>{s}</button>)}</div></section>
        <section className="control-card"><div className="control-row"><div className="control-title"><UsersRound size={19} /><div><strong>Somos</strong><small>Comensales</small></div></div><NumberStepper value={servings} onChange={setServings} /></div><div className="divider" /><div className="control-stack"><div className="control-title"><Clock3 size={19} /><div><strong>Tiempo máximo</strong><small>Tiempo total</small></div></div><div className="range-row"><input type="range" min="15" max="90" step="5" value={maxMinutes} onChange={e => setMaxMinutes(Number(e.target.value))} /><span>{maxMinutes} min</span></div></div></section>
        <section className="form-section"><div className="section-label"><span>Tipo de comida</span></div><div className="chip-row">{(['Comida','Cena','Brunch'] as MealType[]).map(m => <Chip key={m} selected={mealType === m} onClick={() => setMealType(m)}>{m}</Chip>)}</div></section>
        <button className="advanced-toggle" onClick={() => setAdvanced(v => !v)}><span>Más opciones</span>{advanced ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</button>
        {advanced && <section className="advanced-panel"><div className="advanced-group"><strong>Estilo</strong><div className="chip-row">{styles.map(v => <Chip key={v} selected={style === v} onClick={() => setStyle(style === v ? undefined : v)}>{v}</Chip>)}</div></div><div className="advanced-group"><strong>Cocina</strong><div className="chip-row">{cuisines.map(v => <Chip key={v} selected={cuisine === v} onClick={() => setCuisine(cuisine === v ? undefined : v)}>{v}</Chip>)}</div></div><div className="advanced-group"><strong>Dificultad máxima</strong><div className="chip-row">{difficulties.map(v => <Chip key={v} selected={difficulty === v} onClick={() => setDifficulty(difficulty === v ? undefined : v)}>{v}</Chip>)}</div></div></section>}
        <div className="helper-note"><Sparkles size={17} /> El motor local ya pondera texto, tiempo, cocina, estilo y dificultad para ordenar las tres propuestas.</div>
        <div className="sticky-action"><PrimaryButton onClick={search} disabled={!text.trim()}>Que decida el Chef</PrimaryButton></div>
      </div>
    </AppShell>
  );
}
