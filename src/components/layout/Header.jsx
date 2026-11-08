import React from 'react';
import { Link } from 'react-router';
import { useInventory } from '../../context/InventoryContext';
import { cartUnits } from '../../lib/inventory';
export default function Header() {
  const { cart } = useInventory();
  const units = cartUnits(cart);
  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-5 px-5 py-5 sm:px-8">
        <Link to="/" aria-label="La Huerta, inicio" className="flex shrink-0 items-center gap-3">
          <span
            aria-hidden="true"
            className="grid size-11 place-items-center rounded-xl bg-forest text-4xl text-lime-200"
          >
            ✳
          </span>
          <span className="text-2xl font-bold tracking-tight text-forest">
            la huerta
            <small className="mt-0.5 block text-[9px] font-normal tracking-[0.25em]">
              SUPERMERCADO
            </small>
          </span>
        </Link>
        <p className="hidden text-xs text-stone-500 sm:block">Todo en su lugar.</p>
        <Link
          to="/carrito"
          aria-label={`Carrito, ${units} unidades`}
          className="ml-auto inline-flex min-h-11 items-center gap-2 rounded-full border border-emerald-100 bg-sage px-4 text-xs font-semibold text-forest"
        >
          <span aria-hidden="true">🛒</span>
          <span className="hidden sm:inline">Carrito</span>
          <span className="rounded-full bg-forest px-2 py-0.5 text-white">{units}</span>
        </Link>
      </div>
    </header>
  );
}
