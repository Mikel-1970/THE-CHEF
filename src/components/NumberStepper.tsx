import { Minus, Plus } from 'lucide-react';

export function NumberStepper({ value, min = 1, max = 12, step = 1, onChange, suffix, editable = false }: {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  suffix?: string;
  editable?: boolean;
}) {
  const clamp = (next: number) => Math.min(max, Math.max(min, Math.round(next / step) * step));

  return (
    <div className="stepper">
      <button type="button" onClick={() => onChange(clamp(value - step))} aria-label="Reducir">
        <Minus size={17} />
      </button>
      {editable ? (
        <label className="stepper-value" style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={event => {
              const next = Number(event.target.value);
              if (Number.isFinite(next)) onChange(clamp(next));
            }}
            style={{ width: 54, border: 0, background: 'transparent', textAlign: 'center', font: 'inherit', color: 'inherit' }}
            aria-label="Valor"
          />
          {suffix ? <small>{suffix}</small> : null}
        </label>
      ) : (
        <span className="stepper-value">{value}{suffix ? <small>{suffix}</small> : null}</span>
      )}
      <button type="button" onClick={() => onChange(clamp(value + step))} aria-label="Aumentar">
        <Plus size={17} />
      </button>
    </div>
  );
}
