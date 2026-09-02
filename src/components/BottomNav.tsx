import { BookOpen, ChefHat, Home, Search, ShoppingBasket } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export function BottomNav() {
  return (
    <nav className="bottom-nav bottom-nav-v03" aria-label="Navegación principal">
      <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Home size={22} strokeWidth={1.9} />
        <span>Inicio</span>
      </NavLink>
      <NavLink to="/buscar" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Search size={22} strokeWidth={1.9} />
        <span>Buscar</span>
      </NavLink>
      <NavLink to="/antojo" className={({ isActive }) => `nav-item chef-nav ${isActive ? 'active' : ''}`}>
        <span className="chef-nav-circle"><ChefHat size={30} strokeWidth={1.75} /></span>
        <span className="chef-nav-label">Chef</span>
      </NavLink>
      <NavLink to="/lista-compra" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <ShoppingBasket size={22} strokeWidth={1.9} />
        <span>Lista</span>
      </NavLink>
      <NavLink to="/mis-recetas" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <BookOpen size={22} strokeWidth={1.9} />
        <span>Recetas</span>
      </NavLink>
    </nav>
  );
}
