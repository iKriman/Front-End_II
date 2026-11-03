import React from 'react';

export function Summary({ articles }) {
  const metrics = [
    { label: 'Artículos registrados', value: articles.length, detail: 'En el catálogo' },
    {
      label: 'Unidades disponibles',
      value: articles.reduce((sum, article) => sum + article.stock, 0),
      detail: 'Existencias totales',
    },
    {
      label: 'Requieren atención',
      value: articles.filter((article) => article.stock < 10).length,
      detail: 'Stock bajo o agotado',
      warning: true,
    },
  ];
  return (
    <section aria-label="Resumen del inventario" className="mb-8 grid gap-4 md:grid-cols-3">
      {metrics.map((metric) => (
        <article
          key={metric.label}
          className={`rounded-2xl border p-5 ${metric.warning ? 'border-amber-200 bg-amber-50' : 'border-stone-200 bg-white'}`}
        >
          <p className="text-sm text-stone-600">{metric.label}</p>
          <strong
            className={`my-2 block text-4xl tracking-tight ${metric.warning ? 'text-amber-800' : 'text-forest'}`}
          >
            {String(metric.value).padStart(2, '0')}
          </strong>
          <p className="text-xs text-stone-500">{metric.detail}</p>
        </article>
      ))}
    </section>
  );
}
