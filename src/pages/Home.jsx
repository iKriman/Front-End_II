import React from 'react';
import { Link } from 'react-router';
import { useInventory } from '../context/InventoryContext';
import { PageIntro } from '../components/PageIntro';
import { Summary } from '../components/Summary';

export default function Home() {
  const { articles } = useInventory();
  const lowStock = articles.filter((article) => article.stock < 10);
  return (
    <>
      <PageIntro
        eyebrow="GESTIÓN DEL SUPERMERCADO"
        title="Un inventario al día."
        description="Registra tus artículos, revisa las existencias y prepara la próxima reposición."
      >
        <Link to="/articulos/nuevo" className="button-primary">
          ＋ Ingresar artículo
        </Link>
      </PageIntro>
      <Summary articles={articles} />
      <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <article className="panel p-6 sm:p-8">
          <p className="eyebrow">TODO EN SU LUGAR</p>
          <h2 className="text-2xl font-semibold tracking-tight text-forest">
            El próximo paso, a un clic.
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-7 text-stone-600">
            Cada artículo reúne su nombre, marca y tipo de producto. Mantén el catálogo ordenado y
            consulta los mismos datos en todas las secciones.
          </p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <Link to="/articulos/nuevo" className="action-card">
              <span className="mb-3 block text-2xl text-forest" aria-hidden="true">
                ＋
              </span>
              <h3 className="font-semibold text-forest">Registrar un artículo</h3>
              <p className="mt-2 text-xs leading-6 text-stone-600">
                Agrega un producto con su precio y existencias.
              </p>
              <span className="mt-4 block text-sm font-semibold text-forest">
                Ir al formulario →
              </span>
            </Link>
            <Link to="/inventario" className="action-card">
              <span className="mb-3 block text-2xl text-forest" aria-hidden="true">
                ▦
              </span>
              <h3 className="font-semibold text-forest">Consultar el inventario</h3>
              <p className="mt-2 text-xs leading-6 text-stone-600">
                Busca artículos y actualiza sus existencias.
              </p>
              <span className="mt-4 block text-sm font-semibold text-forest">Ver listado →</span>
            </Link>
          </div>
        </article>
        <article className="panel p-6 sm:p-8">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-forest">Para la próxima reposición</h2>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs text-amber-800">
              {lowStock.length} artículos
            </span>
          </div>
          {lowStock.length ? (
            <ul className="mt-5 divide-y divide-stone-100">
              {lowStock.map((article) => (
                <li key={article.id} className="flex items-center gap-3 py-4">
                  <span
                    aria-hidden="true"
                    className="grid size-10 shrink-0 place-items-center rounded-xl bg-sage text-xl"
                  >
                    {article.icon || '📦'}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="break-words text-sm font-medium text-forest">{article.name}</p>
                    <p className="text-xs text-stone-500">{article.brand}</p>
                  </div>
                  <span
                    className={`shrink-0 text-xs font-semibold ${article.stock === 0 ? 'text-red-700' : 'text-amber-800'}`}
                  >
                    {article.stock} uds.
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-8 text-sm text-stone-600">
              Todos los artículos tienen al menos 10 unidades disponibles.
            </p>
          )}
          <Link
            to="/inventario"
            className="mt-4 inline-block text-sm font-semibold text-forest underline underline-offset-4"
          >
            Revisar inventario completo →
          </Link>
        </article>
      </section>
    </>
  );
}
