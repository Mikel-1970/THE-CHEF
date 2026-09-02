import { Minus, Plus } from 'lucide-react';

export function NumberStepper({ value, min = 1, max = 12, onChange, suffix }: {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  suffix?: string;
}) {
  return (
    <div className="stepper">
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} aria-label="Reducir">
        <Minus size={17} />
      </button>
      <span className="stepper-value">{value}{suffix ? <small>{suffix}</small> : null}</span>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} aria-label="Aumentar">
        <Plus size={17} />
      </button>
    </div>
  );
}
