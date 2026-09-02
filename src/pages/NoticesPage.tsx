import { Bell, CheckCircle2 } from 'lucide-react';
import { AppShell } from '../components/AppShell';
import { TopBar } from '../components/TopBar';

export function NoticesPage() {
  return (
    <AppShell>
      <TopBar eyebrow="TU ACTIVIDAD" title="Avisos" />
      <main className="page-content nav-safe">
        <section className="editorial-card olive-intro notices-intro">
          <Bell size={28} strokeWidth={1.7} />
          <div>
            <h2>Avisos pendientes</h2>
            <p>Aquí aparecerán recordatorios, novedades y avisos relacionados con tus recetas y actividad.</p>
          </div>
        </section>

        <section className="notices-empty" aria-live="polite">
          <span><CheckCircle2 size={34} strokeWidth={1.6} /></span>
          <h2>Todo al día</h2>
          <p>No tienes avisos pendientes en este momento.</p>
        </section>
      </main>
    </AppShell>
  );
}
