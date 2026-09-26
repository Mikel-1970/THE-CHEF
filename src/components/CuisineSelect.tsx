import { useState } from 'react';
import { CUISINES } from '../data/cookingOptions';

export function CuisineSelect({ value, onChange }: { value?: string; onChange: (value?: string) => void }) {
  const listed=Boolean(value&&CUISINES.includes(value as typeof CUISINES[number]));
  const [otherMode,setOtherMode]=useState(Boolean(value&&!listed));
  const custom=Boolean(value&&!listed);
  return (
    <div style={{display:'grid',gap:8}}>
      <div className="ingredient-input" style={{ paddingRight: 14 }}>
        <select
          aria-label="Tipo de cocina"
          value={otherMode||custom?'__other__':value??''}
          onChange={event=>{
            const next=event.target.value;
            if(next==='__other__'){setOtherMode(true);onChange(undefined);return}
            setOtherMode(false);onChange(next||undefined);
          }}
          style={{ width: '100%', border: 0, outline: 0, background: 'transparent', color: 'inherit', minHeight: 38 }}
        >
          <option value="">Indiferente</option>
          {CUISINES.map(cuisine => <option key={cuisine} value={cuisine}>{cuisine}</option>)}
          <option value="__other__">Otra cocina…</option>
        </select>
      </div>
      {(otherMode||custom)&&<div className="ingredient-input"><input aria-label="Otra cocina" value={custom?value:''} onChange={event=>onChange(event.target.value||undefined)} placeholder="Escribe el tipo de cocina…"/></div>}
    </div>
  );
}
