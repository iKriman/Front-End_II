import React from 'react';
import { NavLink } from 'react-router';
export default function BottomNavigation() {
  return (
    <nav
      aria-label="Navegación principal"
      className="fixed inset-x-0 bottom-0 z-20 flex justify-center gap-1 border-t border-stone-200 bg-white/95 px-2 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur sm:gap-4"
    >
      {[
        ['/', '▦', 'Inicio'],
        ['/quienes-somos', '♧', 'Quiénes somos'],
        ['/nuestras-tiendas', '⌂', 'Nuestras tiendas'],
        ['/carrito', '🛒', 'Carrito'],
      ].map(([to, icon, label]) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) => `bottom-link ${isActive ? 'bottom-link-active' : ''}`}
        >
          <span aria-hidden="true" className="text-lg">
            {icon}
          </span>
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
