import React from 'react';
import { productTypes } from '../../data/articles';
export default function InventoryFilters({ filters, onChange }) {
  return (
    <div className="grid gap-4 px-6 pb-6 md:grid-cols-[2fr_1fr_1fr]">
      <div>
        <label htmlFor="search">Buscar por nombre o marca</label>
        <input
          id="search"
          type="search"
          value={filters.search}
          onChange={(event) => onChange('search', event.target.value)}
          placeholder="Ej. leche, Colun…"
        />
      </div>
      <div>
        <label htmlFor="filter-category">Categoría</label>
        <select
          id="filter-category"
          value={filters.category}
          onChange={(event) => onChange('category', event.target.value)}
        >
          <option>Todas</option>
          {productTypes.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="filter-status">Disponibilidad</label>
        <select
          id="filter-status"
          value={filters.status}
          onChange={(event) => onChange('status', event.target.value)}
        >
          {['Todos', 'Disponible', 'Stock bajo', 'Agotado'].map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
