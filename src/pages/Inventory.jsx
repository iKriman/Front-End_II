import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useInventory } from '../context/InventoryContext';
import { productTypes, currency, stockState, normalize } from '../data/articles';
import { PageIntro } from '../components/PageIntro';

export default function Inventory() {
  const { articles, changeStock, notice } = useInventory();
  const [search, setSearch] = useState('');
  const [type, setType] = useState('Todos');
  const [status, setStatus] = useState('Todos');
  const [message, setMessage] = useState('');
  const filtered = articles.filter(
    (article) =>
      normalize(`${article.name} ${article.brand}`).includes(normalize(search)) &&
      (type === 'Todos' || article.type === type) &&
      (status === 'Todos' || stockState(article.stock) === status),
  );
  function updateStock(article, delta) {
    changeStock(article.id, delta);
    setMessage(`${article.name}: ${article.stock + delta} unidades.`);
  }
  return (
    <>
      <PageIntro
        eyebrow="LISTADO DE ARTÍCULOS"
        title="Tu inventario, en una sola vista."
        description="Consulta nombre, marca y tipo de producto, y mantén sus existencias actualizadas."
      >
        <Link to="/articulos/nuevo" className="button-primary">
          ＋ Ingresar artículo
        </Link>
      </PageIntro>
      {notice && (
        <p
          role="status"
          className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
        >
          {notice}
        </p>
      )}
      <section className="panel">
        <div className="flex flex-wrap items-center justify-between gap-3 p-6">
          <h2 className="text-lg font-semibold text-forest">Artículos del supermercado</h2>
          <span className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-600">
            {filtered.length} de {articles.length} artículos
          </span>
        </div>
        <div className="grid gap-4 px-6 pb-6 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <label htmlFor="search">Buscar por nombre o marca</label>
            <input
              id="search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Ej. leche, Colun…"
            />
          </div>
          <div>
            <label htmlFor="filter-type">Tipo de producto</label>
            <select id="filter-type" value={type} onChange={(event) => setType(event.target.value)}>
              <option>Todos</option>
              {productTypes.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="filter-status">Disponibilidad</label>
            <select
              id="filter-status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              {['Todos', 'Disponible', 'Stock bajo', 'Agotado'].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
        </div>
        <p role="status" className="sr-only">
          {message}
        </p>
        <div
          className="overflow-x-auto"
          role="region"
          aria-label="Tabla de inventario con desplazamiento horizontal"
          tabIndex={0}
        >
          <table className="w-full min-w-[850px] text-left text-sm">
            <caption className="sr-only">
              Todos los artículos del inventario con nombre, marca, tipo, precio, estado y
              existencias
            </caption>
            <thead className="border-y border-stone-200 bg-stone-50 text-xs text-stone-600">
              <tr>
                {['Artículo', 'Marca', 'Tipo de producto', 'Precio', 'Estado', 'Existencias'].map(
                  (heading) => (
                    <th key={heading} scope="col" className="px-5 py-4 font-medium">
                      {heading}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((article) => (
                <tr key={article.id} className="hover:bg-stone-50/70">
                  <td className="max-w-72 px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className="grid size-10 shrink-0 place-items-center rounded-xl bg-sage text-xl"
                      >
                        {article.icon || '📦'}
                      </span>
                      <span className="break-words font-medium text-forest">{article.name}</span>
                    </div>
                  </td>
                  <td className="max-w-44 break-words px-5 py-4 text-stone-600">{article.brand}</td>
                  <td className="px-5 py-4 text-stone-600">{article.type}</td>
                  <td className="whitespace-nowrap px-5 py-4">{currency(article.price)}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`whitespace-nowrap rounded-md px-2 py-1 text-xs ${article.stock === 0 ? 'bg-red-50 text-red-800' : article.stock < 10 ? 'bg-amber-50 text-amber-800' : 'bg-emerald-50 text-emerald-800'}`}
                    >
                      {stockState(article.stock)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="stock-button"
                        aria-label={`Disminuir existencias de ${article.name}`}
                        disabled={article.stock === 0}
                        onClick={() => updateStock(article, -1)}
                      >
                        −
                      </button>
                      <span className="min-w-7 text-center font-medium">{article.stock}</span>
                      <button
                        className="stock-button"
                        aria-label={`Aumentar existencias de ${article.name}`}
                        disabled={article.stock >= 1000000}
                        onClick={() => updateStock(article, 1)}
                      >
                        +
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!filtered.length && (
          <div className="px-6 py-12 text-center">
            <h3 className="font-semibold text-forest">No se encontraron artículos</h3>
            <p className="mt-2 text-sm text-stone-600">
              Prueba otra búsqueda o registra un nuevo artículo.
            </p>
            <button
              className="button-secondary mt-5"
              onClick={() => {
                setSearch('');
                setType('Todos');
                setStatus('Todos');
              }}
            >
              Limpiar filtros
            </button>
          </div>
        )}
        <p className="border-t border-stone-100 px-6 py-4 text-xs text-stone-500">
          Stock bajo: entre 1 y 9 unidades. Los artículos sin existencias se muestran como agotados.
        </p>
      </section>
    </>
  );
}
