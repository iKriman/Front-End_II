import React from 'react';
import ArticleRow from './ArticleRow';
export default function InventoryTable({ articles }) {
  return (
    <div
      className="overflow-x-auto"
      role="region"
      aria-label="Tabla de inventario con desplazamiento horizontal"
      tabIndex={0}
    >
      <table className="w-full min-w-[850px] text-left text-sm">
        <caption className="sr-only">
          Artículos del inventario con nombre, marca, categoría, precio, estado y existencias
          disponibles
        </caption>
        <thead className="border-y border-stone-200 bg-stone-50 text-xs text-stone-600">
          <tr>
            {['Artículo', 'Marca', 'Categoría', 'Precio', 'Estado', 'Disponibles'].map(
              (heading) => (
                <th key={heading} scope="col" className="px-5 py-4 font-medium">
                  {heading}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {articles.map((article) => (
            <ArticleRow key={article.id} article={article} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
