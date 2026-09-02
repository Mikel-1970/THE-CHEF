import { ChefHat, Home, ListChecks, Search, UserRound } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export function BottomNav() {
  return (
    <nav className="bottom-nav bottom-nav-v03" aria-label="Navegación principal">
      <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Home size={22} strokeWidth={1.9} />
        <span>Inicio</span>
      </NavLink>
      <NavLink to="/antojo" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Search size={22} strokeWidth={1.9} />
        <span>Buscar</span>
      </NavLink>
      <NavLink to="/nevera" className={({ isActive }) => `nav-item chef-nav ${isActive ? 'active' : ''}`}>
        <span className="chef-nav-circle"><ChefHat size={30} strokeWidth={1.75} /></span>
        <span className="chef-nav-label">Chef</span>
      </NavLink>
      <NavLink to="/mis-recetas" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <ListChecks size={22} strokeWidth={1.9} />
        <span>Lista</span>
      </NavLink>
      <NavLink to="/ajustes" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <UserRound size={22} strokeWidth={1.9} />
        <span>Perfil</span>
      </NavLink>
    </nav>
  );
}
