import React from 'react';
import { Link } from 'react-router';
import { useInventory } from '../context/InventoryContext';
import { currency } from '../data/articles';
import { cartUnits } from '../lib/inventory';
import { PageIntro } from '../components/PageIntro';
import CartItem from '../components/CartItem';
export default function Cart() {
  const { articles, cart, clearCart } = useInventory();
  const lines = cart.map((line) => ({
    ...line,
    article: articles.find((article) => article.id === line.articleId),
  }));
  const total = lines.reduce((sum, line) => sum + line.article.price * line.quantity, 0);
  return (
    <>
      <PageIntro
        eyebrow="CARRITO DE COMPRAS"
        title="Tu selección, bajo control."
        description="Aumenta o disminuye las cantidades. Cada cambio actualiza las existencias disponibles del inventario."
      />
      {!lines.length ? (
        <section className="panel px-6 py-16 text-center">
          <span aria-hidden="true" className="text-5xl">
            🛒
          </span>
          <h2 className="mt-5 text-xl font-semibold text-forest">Tu carrito está vacío</h2>
          <p className="mt-3 text-sm text-stone-600">
            Abre un artículo del inventario para agregar las unidades que necesitas.
          </p>
          <Link to="/inventario" className="button-primary mt-6">
            Explorar inventario
          </Link>
        </section>
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-[1.7fr_1fr]">
          <section className="panel" aria-label="Artículos del carrito">
            <div className="flex items-center justify-between gap-3 border-b border-stone-100 p-6">
              <h2 className="text-lg font-semibold text-forest">Artículos seleccionados</h2>
              <span className="text-xs text-stone-500">{cartUnits(cart)} unidades</span>
            </div>
            {lines.map((line) => (
              <CartItem key={line.articleId} line={line} article={line.article} />
            ))}
          </section>
          <aside className="panel p-6">
            <h2 className="text-lg font-semibold text-forest">Resumen del carrito</h2>
            <dl className="my-6 space-y-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-stone-500">Artículos distintos</dt>
                <dd>{lines.length}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-stone-500">Unidades seleccionadas</dt>
                <dd>{cartUnits(cart)}</dd>
              </div>
              <div className="flex justify-between border-t border-stone-200 pt-4 text-lg font-semibold text-forest">
                <dt>Total</dt>
                <dd>{currency(total)}</dd>
              </div>
            </dl>
            <p className="text-xs leading-6 text-stone-500">
              Las unidades del carrito ya están descontadas del inventario. Disminuir la cantidad o
              quitar un artículo devuelve esas unidades.
            </p>
            <Link className="button-primary mt-6 w-full" to="/inventario">
              Seguir agregando
            </Link>
            <button className="button-secondary mt-3 w-full" onClick={clearCart}>
              Vaciar carrito y devolver unidades
            </button>
          </aside>
        </div>
      )}
    </>
  );
}
