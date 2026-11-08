import React from 'react';
import { Link } from 'react-router';
export default function InventoryEmpty({ onReset, isEmpty }) {
  return (
    <div className="px-6 py-12 text-center">
      <h3 className="font-semibold text-forest">
        {isEmpty ? 'Tu inventario está vacío' : 'No se encontraron artículos'}
      </h3>
      <p className="mt-2 text-sm text-stone-600">
        {isEmpty
          ? 'Registra el primer artículo para comenzar.'
          : 'Prueba otra búsqueda o limpia los filtros para ver todo el catálogo.'}
      </p>
      {isEmpty ? (
        <Link className="button-primary mt-5" to="/articulos/nuevo">
          Ingresar artículo
        </Link>
      ) : (
        <button className="button-secondary mt-5" onClick={onReset}>
          Limpiar filtros
        </button>
      )}
    </div>
  );
}
