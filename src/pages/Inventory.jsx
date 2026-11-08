import React from 'react';
import { Link, useSearchParams } from 'react-router';
import { useInventory } from '../context/InventoryContext';
import { selectArticles } from '../lib/inventory';
import { PageIntro } from '../components/PageIntro';
import InventoryFilters from '../components/inventory/InventoryFilters';
import InventoryTable from '../components/inventory/InventoryTable';
import InventoryEmpty from '../components/inventory/InventoryEmpty';
export default function Inventory() {
  const { articles } = useInventory();
  const [params, setParams] = useSearchParams();
  const filters = {
    search: params.get('buscar') || '',
    category: params.get('categoria') || 'Todas',
    status: params.get('estado') || 'Todos',
  };
  const filtered = selectArticles(articles, filters);
  function changeFilter(key, value) {
    const names = { search: 'buscar', category: 'categoria', status: 'estado' };
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        if (!value || value === 'Todas' || value === 'Todos') next.delete(names[key]);
        else next.set(names[key], value);
        return next;
      },
      { replace: true },
    );
  }
  return (
    <>
      <PageIntro
        eyebrow="LISTADO DE ARTÍCULOS"
        title="Tu inventario, en una sola vista."
        description="Filtra por categoría o marca. Abre un artículo para consultar su detalle y agregarlo al carrito."
      >
        <Link className="button-primary" to="/articulos/nuevo">
          ＋ Ingresar artículo
        </Link>
      </PageIntro>
      <section className="panel">
        <div className="flex flex-wrap items-center justify-between gap-3 p-6">
          <h2 className="text-lg font-semibold text-forest">Artículos del supermercado</h2>
          <span
            role="status"
            className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-600"
          >
            {filtered.length} de {articles.length} artículos
          </span>
        </div>
        <InventoryFilters filters={filters} onChange={changeFilter} />
        <InventoryTable articles={filtered} />
        {!filtered.length && (
          <InventoryEmpty isEmpty={!articles.length} onReset={() => setParams({})} />
        )}
        <p className="border-t border-stone-100 px-6 py-4 text-xs leading-6 text-stone-500">
          Las existencias disponibles descuentan las unidades del carrito. Los controles + y −
          ajustan existencias del inventario. Filtrar solo cambia la vista y conserva los datos
          originales.
        </p>
      </section>
    </>
  );
}
