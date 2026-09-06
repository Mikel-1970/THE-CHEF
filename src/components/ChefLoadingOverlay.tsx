import { ChefHat } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useApp } from '../AppContext';
import './ChefLoadingOverlay.css';

const DEFAULT_MESSAGES = ['¡Oído cocina!', 'El Chef se pone manos a la obra…', 'Afinando el punto…', 'Ya casi lo tenemos…'];

type Props = {
  active: boolean;
  title?: string;
  messages?: string[];
};

export function ChefLoadingOverlay({ active, title = 'El Chef está trabajando', messages = DEFAULT_MESSAGES }: Props) {
  const { settings } = useApp();
  const wasActive = useRef(false);
  const [message, setMessage] = useState(messages[0] ?? DEFAULT_MESSAGES[0]);

  useEffect(() => {
    if (active && !wasActive.current) {
      const options = messages.length ? messages : DEFAULT_MESSAGES;
      setMessage(options[Math.floor(Math.random() * options.length)] ?? DEFAULT_MESSAGES[0]);
    }
    wasActive.current = active;
  }, [active, messages]);

  if (!active) return null;

  return (
    <div className="chef-loading-overlay" role="status" aria-live="polite" aria-busy="true">
      <div className="chef-loading-card">
        <div className="chef-hat-spinner personalized-chef-spinner">
          {settings.profileImage ? <img src={settings.profileImage} alt="" /> : <span>{settings.avatarEmoji}</span>}
          <i><ChefHat size={25} /></i>
        </div>
        <strong>{title}</strong>
        <span>{message}</span>
      </div>
    </div>
  );
}
