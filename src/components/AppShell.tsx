import type { ReactNode } from 'react';
import { BottomNav } from './BottomNav';

export function AppShell({ children, hideNav = false }: { children: ReactNode; hideNav?: boolean }) {
  return (
    <div className="app-bg">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="grain" />
      <main className="phone-shell">{children}</main>
      {!hideNav && <BottomNav />}
    </div>
  );
}
