import { ArrowLeft, ChefHat } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function TopBar({ eyebrow, title, back = true }: { eyebrow?: string; title: string; back?: boolean }) {
  const navigate = useNavigate();
  return (
    <header className="top-bar top-bar-v03">
      {back ? (
        <button className="icon-button" onClick={() => navigate(-1)} aria-label="Volver">
          <ArrowLeft size={21} />
        </button>
      ) : <span className="icon-spacer" />}
      <div className="top-bar-copy">
        <ChefHat className="topbar-chef" size={19} />
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
      </div>
      <span className="icon-spacer" />
    </header>
  );
}
