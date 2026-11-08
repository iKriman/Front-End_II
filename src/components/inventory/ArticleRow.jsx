import React from 'react';
import { Link } from 'react-router';
import { currency } from '../../data/articles';
import StockBadge from '../StockBadge';
import StockControls from './StockControls';
export default function ArticleRow({ article }) {
  return (
    <tr className="hover:bg-stone-50/70">
      <td className="max-w-72 px-5 py-4">
        <Link
          to={`/articulos/${encodeURIComponent(article.id)}`}
          className="flex items-center gap-3 rounded font-medium text-forest hover:underline"
        >
          <span
            aria-hidden="true"
            className="grid size-10 shrink-0 place-items-center rounded-xl bg-sage text-xl"
          >
            {article.icon || '📦'}
          </span>
          <span className="break-words">
            {article.name}
            <span className="mt-1 block text-[10px] font-normal text-stone-500">Ver detalle →</span>
          </span>
        </Link>
      </td>
      <td className="max-w-44 break-words px-5 py-4 text-stone-600">{article.brand}</td>
      <td className="px-5 py-4 text-stone-600">{article.type}</td>
      <td className="whitespace-nowrap px-5 py-4">{currency(article.price)}</td>
      <td className="px-5 py-4">
        <StockBadge stock={article.stock} />
      </td>
      <td className="px-5 py-4">
        <StockControls article={article} />
      </td>
    </tr>
  );
}
