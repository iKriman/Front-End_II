import React, { useEffect, useRef } from 'react';
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import NewArticle from './pages/NewArticle';
import Inventory from './pages/Inventory';
import About from './pages/About';
import Stores from './pages/Stores';
import { InventoryMenu } from './components/InventoryMenu';
import { useInventory } from './context/InventoryContext';

export default function App() {
  const { pathname } = useLocation();
  const main = useRef(null);
  const { storageError } = useInventory();
  useEffect(() => {
    const titles = {
      '/': 'Inicio',
      '/articulos/nuevo': 'Ingresar artículo',
      '/inventario': 'Inventario',
      '/quienes-somos': 'Quiénes somos',
      '/nuestras-tiendas': 'Nuestras tiendas',
    };
    document.title = `La Huerta · ${titles[pathname] || 'Página no encontrada'}`;
    main.current?.focus();
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <>
      <a
        href="#contenido"
        onClick={(event) => {
          event.preventDefault();
          main.current?.focus();
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:p-4"
      >
        Saltar al contenido
      </a>
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-5 py-5 sm:px-8">
          <Link to="/" aria-label="La Huerta, inicio" className="flex items-center gap-3">
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
          <span className="ml-auto rounded-full border border-stone-200 bg-sage px-3 py-2 text-[10px] text-forest sm:text-xs">
            Panel de inventario
          </span>
        </div>
      </header>
      <main
        ref={main}
        id="contenido"
        tabIndex={-1}
        className="mx-auto min-h-[calc(100vh-90px)] max-w-7xl px-5 pb-32 pt-7 outline-none sm:px-8 sm:pt-10"
      >
        <InventoryMenu />
        {storageError && (
          <p
            role="alert"
            className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
          >
            {storageError}
          </p>
        )}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/articulos/nuevo" element={<NewArticle />} />
          <Route path="/inventario" element={<Inventory />} />
          <Route path="/quienes-somos" element={<About />} />
          <Route path="/nuestras-tiendas" element={<Stores />} />
          <Route
            path="*"
            element={
              <section className="py-16 text-center">
                <p className="eyebrow">ERROR 404</p>
                <h1 className="text-3xl font-bold text-forest">Página no encontrada</h1>
                <p className="my-5 text-stone-600">
                  Esta dirección no existe en nuestro supermercado.
                </p>
                <Link to="/" className="button-primary">
                  Volver al inicio
                </Link>
              </section>
            }
          />
        </Routes>
        <footer className="mt-10 flex flex-col justify-between gap-2 border-t border-stone-200 pt-5 text-xs text-stone-500 sm:flex-row">
          <span>La Huerta · Proyecto académico PFY2202</span>
          <span>Información y productos de demostración</span>
        </footer>
      </main>
      <nav
        aria-label="Navegación principal"
        className="fixed inset-x-0 bottom-0 z-20 flex justify-center gap-1 border-t border-stone-200 bg-white/95 px-2 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur sm:gap-4"
      >
        {[
          ['/', '▦', 'Inicio'],
          ['/quienes-somos', '♧', 'Quiénes somos'],
          ['/nuestras-tiendas', '⌂', 'Nuestras tiendas'],
        ].map(([to, icon, label]) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `bottom-link ${isActive ? 'bottom-link-active' : ''}`}
          >
            <span aria-hidden="true" className="text-lg">
              {icon}
            </span>
            {label}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
