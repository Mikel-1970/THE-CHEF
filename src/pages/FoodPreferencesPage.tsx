import {AppShell} from '../components/AppShell';
import {TopBar} from '../components/TopBar';
import {FoodPreferencesSettings} from '../components/FoodPreferencesSettings';

export function FoodPreferencesPage(){
 return <AppShell><TopBar eyebrow="TU PERFIL DE COCINA" title="Alimentación"/><div className="page-content nav-safe settings-v03">
  <section className="editorial-card"><h2>Preferencias globales</h2><p>Estas preferencias se reutilizan en recetas, Foto Receta, Nevera, importaciones y plan nutricional para no preguntarlas cada vez.</p></section>
  <FoodPreferencesSettings/>
 </div></AppShell>;
}
