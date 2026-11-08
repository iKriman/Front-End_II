import React from 'react';
import { NavLink } from 'react-router';
export function InventoryMenu() {
  return (
    <nav
      aria-label="Gestión de inventario"
      className="mb-8 flex flex-wrap gap-2 border-b border-stone-200 pb-4"
    >
      {[
        ['/articulos/nuevo', '＋', 'Ingresar artículo'],
        ['/inventario', '▦', 'Listado de artículos'],
      ].map(([to, icon, label]) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `inventory-tab ${isActive ? 'inventory-tab-active' : ''}`}
        >
          <span aria-hidden="true">{icon}</span>
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
