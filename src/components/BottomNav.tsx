import { Bell, ChefHat, Home, Search, UserRound } from 'lucide-react';
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

      <NavLink to="/avisos" className={({ isActive }) => `nav-item nav-alerts ${isActive ? 'active' : ''}`}>
        <span className="nav-alert-icon"><Bell size={24} strokeWidth={1.8} /><i aria-hidden="true" /></span>
        <span>Avisos</span>
      </NavLink>

      <NavLink to="/ajustes" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <UserRound size={24} strokeWidth={1.75} />
        <span>Perfil</span>
      </NavLink>
    </nav>
  );
}
