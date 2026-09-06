import { Check, ChefHat } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useApp } from '../AppContext';
import './ChefLoadingOverlay.css';

const DEFAULT_MESSAGES = ['Analizando lo que necesitas…', 'Ajustando ingredientes y cantidades…', 'Afinando el punto…', 'Dando los últimos retoques…'];

type Props = {
  active: boolean;
  title?: string;
  messages?: string[];
};

export function ChefLoadingOverlay({ active, title = 'El Chef está trabajando', messages = DEFAULT_MESSAGES }: Props) {
  const { settings } = useApp();
  const options = useMemo(() => messages.length ? messages : DEFAULT_MESSAGES, [messages]);
  const [visible, setVisible] = useState(active);
  const [completed, setCompleted] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (active) {
      setVisible(true);
      setCompleted(false);
      setMessageIndex(0);
      return;
    }
    if (!visible) return;
    setCompleted(true);
    const timeout = window.setTimeout(() => setVisible(false), 360);
    return () => window.clearTimeout(timeout);
  }, [active, visible]);

  useEffect(() => {
    if (!active || options.length < 2) return;
    const interval = window.setInterval(() => setMessageIndex(index => (index + 1) % options.length), 1500);
    return () => window.clearInterval(interval);
  }, [active, options]);

  if (!visible) return null;

  return (
    <div className="chef-loading-overlay" role="status" aria-live="polite" aria-busy={active}>
      <div className={`chef-loading-card ${completed ? 'completed' : ''}`}>
        <div className="chef-progress-ring" aria-hidden="true">
          <div className="chef-hat-spinner personalized-chef-spinner">
            {settings.profileImage ? <img src={settings.profileImage} alt="" /> : <span>{settings.avatarEmoji}</span>}
            <i><ChefHat size={25} /></i>
          </div>
          {completed && <span className="chef-complete-check"><Check size={28} strokeWidth={2.7} /></span>}
        </div>
        <strong>{completed ? 'Listo' : title}</strong>
        <span>{completed ? 'Preparado.' : options[messageIndex] ?? DEFAULT_MESSAGES[0]}</span>
      </div>
    </div>
  );
}
