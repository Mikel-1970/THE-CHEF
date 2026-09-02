import type { ReactNode } from 'react';

export function Chip({ children, selected = false, onClick }: { children: ReactNode; selected?: boolean; onClick?: () => void }) {
  return <button type="button" className={`chip ${selected ? 'selected' : ''}`} onClick={onClick}>{children}</button>;
}
