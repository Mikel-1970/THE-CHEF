import { CUISINES } from '../data/cookingOptions';

export function CuisineSelect({ value, onChange }: { value?: string; onChange: (value?: string) => void }) {
  return (
    <div className="ingredient-input" style={{ paddingRight: 14 }}>
      <select
        aria-label="Tipo de cocina"
        value={value ?? ''}
        onChange={event => onChange(event.target.value || undefined)}
        style={{ width: '100%', border: 0, outline: 0, background: 'transparent', color: 'inherit', minHeight: 38 }}
      >
        <option value="">Indiferente</option>
        {CUISINES.map(cuisine => <option key={cuisine} value={cuisine}>{cuisine}</option>)}
      </select>
    </div>
  );
}
