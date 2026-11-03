import React from 'react';
import { NavLink } from 'react-router-dom';

export function InventoryMenu() {
  return (
    <nav
      aria-label="Gestión de inventario"
      className="mb-8 flex flex-wrap gap-2 border-b border-stone-200 pb-4"
    >
      <NavLink
        to="/articulos/nuevo"
        className={({ isActive }) => `inventory-tab ${isActive ? 'inventory-tab-active' : ''}`}
      >
        <span aria-hidden="true">＋</span> Ingresar artículo
      </NavLink>
      <NavLink
        to="/inventario"
        className={({ isActive }) => `inventory-tab ${isActive ? 'inventory-tab-active' : ''}`}
      >
        <span aria-hidden="true">▦</span> Listado de artículos
      </NavLink>
    </nav>
  );
}
