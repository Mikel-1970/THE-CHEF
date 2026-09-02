import { ChefHat } from 'lucide-react';

export function TopBar({ eyebrow, title }: { eyebrow?: string; title: string; back?: boolean }) {
  return (
    <header className="top-bar top-bar-v03">
      <span className="icon-spacer" />
      <div className="top-bar-copy">
        <ChefHat className="topbar-chef" size={19} />
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
      </div>
      <span className="icon-spacer" />
    </header>
  );
}
