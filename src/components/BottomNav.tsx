import { ChefHat, CookingPot, Home, PackageOpen, Search } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import '../navigation-v04.css';

export function BottomNav() {
  return (
    <nav className="bottom-nav bottom-nav-consistent" aria-label="Navegación principal">
      <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Home size={23} strokeWidth={1.9} fill="currentColor" />
        <span>Inicio</span>
      </NavLink>

      <NavLink to="/buscar" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Search size={24} strokeWidth={1.8} />
        <span>Buscar</span>
      </NavLink>

      <NavLink to="/antojo" className={({ isActive }) => `nav-item chef-nav ${isActive ? 'active' : ''}`} aria-label="Abrir El Chef">
        <span className="chef-nav-circle"><ChefHat size={31} strokeWidth={1.7} /></span>
        <span className="chef-nav-label">Chef</span>
      </NavLink>

      <NavLink to="/nevera" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <PackageOpen size={24} strokeWidth={1.8} />
        <span>Despensa</span>
      </NavLink>

      <NavLink to="/tecnicas" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <CookingPot size={24} strokeWidth={1.8} />
        <span>Técnicas</span>
      </NavLink>
    </nav>
  );
}
