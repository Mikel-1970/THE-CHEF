import { ChefHat } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import './ChefLoadingOverlay.css';

const DEFAULT_MESSAGES = ['¡Oído cocina!', 'El Chef se pone manos a la obra…', 'Afinando el punto…', 'Ya casi lo tenemos…'];

type Props = {
  active: boolean;
  title?: string;
  messages?: string[];
};

function pickMessage(messages: string[], previous?: string) {
  const available = messages.filter(message => message !== previous);
  const pool = available.length ? available : messages;
  return pool[Math.floor(Math.random() * Math.max(1, pool.length))] ?? '¡Oído cocina!';
}

export function ChefLoadingOverlay({ active, title = 'El Chef está trabajando', messages = DEFAULT_MESSAGES }: Props) {
  const [message, setMessage] = useState(() => messages[0] ?? '¡Oído cocina!');
  const previousActive = useRef(false);
  const previousMessage = useRef<string>();

  useEffect(() => {
    // El texto se decide una sola vez al comenzar cada operación y permanece fijo
    // mientras el gorro sigue girando. En una nueva operación puede aparecer otro.
    if (active && !previousActive.current) {
      const next = pickMessage(messages, previousMessage.current);
      setMessage(next);
      previousMessage.current = next;
    }
    previousActive.current = active;
  }, [active, messages]);

  if (!active) return null;

  return (
    <div className="chef-loading-overlay" role="status" aria-live="polite" aria-busy="true">
      <div className="chef-loading-card">
        <div className="chef-hat-spinner"><ChefHat size={42} /></div>
        <strong>{title}</strong>
        <span>{message}</span>
      </div>
    </div>
  );
}
