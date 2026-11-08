import React, { useState } from 'react';
import { Link, useParams } from 'react-router';
import { useInventory } from '../context/InventoryContext';
import { currency } from '../data/articles';
import { isDecimalInteger, reservedUnits } from '../lib/inventory';
import { PageIntro } from '../components/PageIntro';
import StockBadge from '../components/StockBadge';
import NotFound from './NotFound';
export default function ArticleDetail() {
  const { articleId } = useParams();
  const { articles, cart, addToCart } = useInventory();
  const [quantity, setQuantity] = useState('1');
  const [error, setError] = useState('');
  const article = articles.find((item) => item.id === articleId);
  if (!article) return <NotFound article />;
  const reserved = reservedUnits(cart, article.id);
  function submit(event) {
    event.preventDefault();
    if (!isDecimalInteger(quantity, 1, article.stock)) {
      setError(`Ingresa una cantidad entera entre 1 y ${article.stock}.`);
      return;
    }
    setError('');
    addToCart(article.id, quantity);
  }
  return (
    <>
      <Link
        to="/inventario"
        className="mb-6 inline-block text-sm font-semibold text-forest underline underline-offset-4"
      >
        ← Volver al inventario
      </Link>
      <PageIntro
        eyebrow="DETALLE DEL ARTÍCULO"
        title={article.name}
        description={`${article.brand} · ${article.type}`}
      />
      <section className="grid gap-6 md:grid-cols-[1fr_1.2fr]">
        <div className="panel grid min-h-64 place-items-center bg-sage p-12" aria-hidden="true">
          <span className="text-9xl">{article.icon || '📦'}</span>
        </div>
        <div className="panel p-6 sm:p-8">
          <StockBadge stock={article.stock} />
          <p className="mt-5 text-4xl font-bold tracking-tight text-forest">
            {currency(article.price)}
            <span className="ml-2 text-xs font-normal text-stone-500">por unidad</span>
          </p>
          <dl className="my-6 grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-xs text-stone-500">Marca</dt>
              <dd className="mt-1 font-medium">{article.brand}</dd>
            </div>
            <div>
              <dt className="text-xs text-stone-500">Categoría</dt>
              <dd className="mt-1 font-medium">{article.type}</dd>
            </div>
            <div>
              <dt className="text-xs text-stone-500">Disponibles</dt>
              <dd className="mt-1 font-medium">{article.stock} unidades</dd>
            </div>
            <div>
              <dt className="text-xs text-stone-500">En tu carrito</dt>
              <dd className="mt-1 font-medium">{reserved} unidades</dd>
            </div>
          </dl>
          {article.stock > 0 ? (
            <form noValidate onSubmit={submit} className="border-t border-stone-100 pt-6">
              <label htmlFor="quantity">Cantidad para agregar</label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="quantity"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]+"
                  className="sm:max-w-28"
                  value={quantity}
                  onChange={(event) => {
                    setQuantity(event.target.value);
                    setError('');
                  }}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? 'quantity-error' : 'quantity-help'}
                />
                <button type="submit" className="button-primary">
                  Agregar al carrito
                </button>
              </div>
              {error ? (
                <p id="quantity-error" role="alert" className="mt-2 text-xs text-red-700">
                  {error}
                </p>
              ) : (
                <p id="quantity-help" className="mt-3 text-xs leading-6 text-stone-500">
                  Al agregar, las unidades se descuentan del inventario. Puedes devolverlas desde el
                  carrito.
                </p>
              )}
            </form>
          ) : (
            <p className="border-t border-stone-100 pt-5 text-sm text-red-800">
              Este artículo está agotado. No se pueden agregar más unidades.
            </p>
          )}
          <Link
            to="/carrito"
            className="mt-6 inline-block text-sm font-semibold text-forest underline underline-offset-4"
          >
            Ver carrito →
          </Link>
        </div>
      </section>
    </>
  );
}
