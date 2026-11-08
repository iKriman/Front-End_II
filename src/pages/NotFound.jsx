import React from 'react';
import { Link } from 'react-router';
export default function NotFound({ article = false }) {
  return (
    <section className="py-16 text-center">
      <p className="eyebrow">{article ? 'ARTÍCULO NO DISPONIBLE' : 'ERROR 404'}</p>
      <h1 className="text-3xl font-bold text-forest">
        {article ? 'No encontramos este artículo' : 'Página no encontrada'}
      </h1>
      <p className="my-5 text-sm text-stone-600">
        {article
          ? 'El artículo no existe en este inventario o ya no está disponible en los datos guardados.'
          : 'Esta dirección no existe en nuestro supermercado.'}
      </p>
      <Link className="button-primary" to={article ? '/inventario' : '/'}>
        {article ? 'Volver al inventario' : 'Volver al inicio'}
      </Link>
    </section>
  );
}
