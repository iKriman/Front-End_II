import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router';
import SiteLayout from '../components/layout/SiteLayout';
const Home = lazy(() => import('../pages/Home'));
const Inventory = lazy(() => import('../pages/Inventory'));
const NewArticle = lazy(() => import('../pages/NewArticle'));
const ArticleDetail = lazy(() => import('../pages/ArticleDetail'));
const Cart = lazy(() => import('../pages/Cart'));
const About = lazy(() => import('../pages/About'));
const Stores = lazy(() => import('../pages/Stores'));
const NotFound = lazy(() => import('../pages/NotFound'));
export default function AppRoutes() {
  return (
    <Suspense
      fallback={
        <p role="status" className="p-8 text-center text-forest">
          Cargando página…
        </p>
      }
    >
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<Home />} />
          <Route path="inventario" element={<Inventory />} />
          <Route path="articulos/nuevo" element={<NewArticle />} />
          <Route path="articulos/:articleId" element={<ArticleDetail />} />
          <Route path="carrito" element={<Cart />} />
          <Route path="quienes-somos" element={<About />} />
          <Route path="nuestras-tiendas" element={<Stores />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
