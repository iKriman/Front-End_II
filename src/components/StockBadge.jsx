import React from 'react';
import { stockState } from '../data/articles';
export default function StockBadge({ stock }) {
  return (
    <span
      className={`whitespace-nowrap rounded-md px-2 py-1 text-xs ${stock === 0 ? 'bg-red-50 text-red-800' : stock < 10 ? 'bg-amber-50 text-amber-800' : 'bg-emerald-50 text-emerald-800'}`}
    >
      {stockState(stock)}
    </span>
  );
}
