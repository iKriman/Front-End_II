import React, { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router';
import Header from './Header';
import Footer from './Footer';
import BottomNavigation from './BottomNavigation';
import { InventoryMenu } from '../InventoryMenu';
import Notice from '../Notice';
import { useInventory } from '../../context/InventoryContext';
export default function SiteLayout() {
  const main = useRef(null);
  const { pathname } = useLocation();
  const { storageError, recoveryIssues, dismissRecovery } = useInventory();
  useEffect(() => {
    const titles = {
      '/': 'Inicio',
      '/inventario': 'Inventario',
      '/articulos/nuevo': 'Ingresar artículo',
      '/carrito': 'Carrito',
      '/quienes-somos': 'Quiénes somos',
      '/nuestras-tiendas': 'Nuestras tiendas',
    };
    document.title = `La Huerta · ${titles[pathname] || (pathname.startsWith('/articulos/') ? 'Detalle de artículo' : 'Página no encontrada')}`;
    main.current?.focus();
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-white focus:p-4"
        onClick={(event) => {
          event.preventDefault();
          main.current?.focus();
        }}
      >
        Saltar al contenido
      </a>
      <Header />
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
            className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
          >
            {storageError}
          </p>
        )}
        {recoveryIssues.length > 0 && (
          <section
            role="status"
            aria-label="Revisión de datos guardados"
            className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
          >
            <h2 className="font-semibold">Revisa el inventario recuperado</h2>
            {recoveryIssues.map((issue) => (
              <p className="mt-2" key={issue}>
                {issue}
              </p>
            ))}
            <button onClick={dismissRecovery} className="mt-3 underline underline-offset-4">
              Entendido
            </button>
          </section>
        )}
        <Notice />
        <Outlet />
        <Footer />
      </main>
      <BottomNavigation />
    </>
  );
}
