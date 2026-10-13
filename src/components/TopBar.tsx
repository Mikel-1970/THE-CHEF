import { BrandMark } from './BrandMark';

function normalizeLabel(value?: string) {
  if (!value) return value;
  if (value === 'Receta desde una foto') return 'Foto/Video Receta';
  if (value === 'COCINA CON LO QUE TIENES') return 'COCINA CON LO QUE TIENES';
  if (value === 'Cocina con lo que tienes') return 'Cocina con lo que tienes';
  return value;
}

export function TopBar({ eyebrow, title }: { eyebrow?: string; title: string; back?: boolean }) {
  const visibleEyebrow = normalizeLabel(eyebrow);
  const visibleTitle = normalizeLabel(title) ?? title;
  return (
    <header className="top-bar top-bar-v03 alm-top-bar">
      <span className="icon-spacer" />
      <div className="top-bar-copy">
        <BrandMark compact/>
        {visibleEyebrow && <span className="eyebrow">{visibleEyebrow}</span>}
        {visibleTitle.trim() && <h1>{visibleTitle}</h1>}
      </div>
      <span className="icon-spacer" />
    </header>
  );
}