import React from 'react';
import { Link } from 'react-router';
import { useInventory } from '../context/InventoryContext';
import { currency } from '../data/articles';
export default function CartItem({ line, article }) {
  const { changeCart, removeFromCart } = useInventory();
  return (
    <article className="flex flex-col gap-5 border-b border-stone-100 p-5 last:border-0 sm:flex-row sm:items-center sm:p-6">
      <span
        aria-hidden="true"
        className="grid size-14 shrink-0 place-items-center rounded-xl bg-sage text-3xl"
      >
        {article.icon || '📦'}
      </span>
      <div className="min-w-0 flex-1">
        <Link
          to={`/articulos/${encodeURIComponent(article.id)}`}
          className="break-words font-semibold text-forest hover:underline"
        >
          {article.name}
        </Link>
        <p className="mt-1 text-xs text-stone-500">
          {article.brand} · {article.type}
        </p>
        <p className="mt-2 text-sm">{currency(article.price)} por unidad</p>
        <p className="mt-1 text-xs text-stone-500">{article.stock} disponibles en inventario</p>
      </div>
      <div className="flex items-center justify-between gap-5 sm:flex-col sm:items-end">
        <div className="flex items-center gap-3">
          <button
            className="stock-button"
            aria-label={`Disminuir cantidad de ${article.name}`}
            onClick={() => changeCart(article.id, -1)}
          >
            −
          </button>
          <span
            className="min-w-6 text-center font-medium"
            aria-label={`Cantidad de ${article.name}`}
          >
            {line.quantity}
          </span>
          <button
            className="stock-button"
            aria-label={`Aumentar cantidad de ${article.name}`}
            disabled={article.stock === 0}
            onClick={() => changeCart(article.id, 1)}
          >
            +
          </button>
        </div>
        <div className="text-right">
          <p className="font-semibold text-forest">{currency(article.price * line.quantity)}</p>
          <button
            className="mt-2 text-xs text-red-800 underline underline-offset-4"
            onClick={() => removeFromCart(article.id)}
            aria-label={`Quitar ${article.name} del carrito`}
          >
            Quitar artículo
          </button>
        </div>
      </div>
    </article>
  );
}
