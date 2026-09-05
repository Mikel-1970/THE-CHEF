import { ChefHat } from 'lucide-react';
import { useEffect, useState } from 'react';
import './ChefLoadingOverlay.css';

const DEFAULT_MESSAGES = ['¡Oído cocina!', 'El Chef se pone manos a la obra…', 'Afinando el punto…', 'Ya casi lo tenemos…'];

type Props = {
  active: boolean;
  title?: string;
  messages?: string[];
};

export function ChefLoadingOverlay({ active, title = 'El Chef está trabajando', messages = DEFAULT_MESSAGES }: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!active) {
      setIndex(0);
      return;
    }
    const timer = window.setInterval(() => setIndex(current => (current + 1) % Math.max(1, messages.length)), 1800);
    return () => window.clearInterval(timer);
  }, [active, messages.length]);

  if (!active) return null;

  return (
    <div className="chef-loading-overlay" role="status" aria-live="polite" aria-busy="true">
      <div className="chef-loading-card">
        <div className="chef-hat-spinner"><ChefHat size={42} /></div>
        <strong>{title}</strong>
        <span>{messages[index] ?? messages[0]}</span>
      </div>
    </div>
  );
}
