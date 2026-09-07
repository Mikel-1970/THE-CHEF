import { ChefHat } from 'lucide-react';

function normalizeLabel(value?: string) {
  if (!value) return value;
  if (value === 'Receta desde una foto') return 'Foto receta';
  if (value === 'COCINA CON LO QUE TIENES') return 'COCINA CON LO QUE HAY';
  if (value === 'Cocina con lo que tienes') return 'Cocina con lo que hay';
  return value;
}

export function TopBar({ eyebrow, title }: { eyebrow?: string; title: string; back?: boolean }) {
  const visibleEyebrow = normalizeLabel(eyebrow);
  const visibleTitle = normalizeLabel(title) ?? title;

  return (
    <header className="top-bar top-bar-v03">
      <span className="icon-spacer" />
      <div className="top-bar-copy">
        <ChefHat className="topbar-chef" size={19} />
        {visibleEyebrow && <span className="eyebrow">{visibleEyebrow}</span>}
        <h1>{visibleTitle}</h1>
      </div>
      <span className="icon-spacer" />
    </header>
  );
}
