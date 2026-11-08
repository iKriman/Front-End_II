import React from 'react';
import { useInventory } from '../../context/InventoryContext';
import { MAX_STOCK, reservedUnits } from '../../lib/inventory';
export default function StockControls({ article }) {
  const { changeStock, cart } = useInventory();
  return (
    <div className="flex items-center gap-2">
      <button
        className="stock-button"
        aria-label={`Disminuir existencias de ${article.name}`}
        disabled={article.stock === 0}
        onClick={() => changeStock(article.id, -1)}
      >
        −
      </button>
      <span className="min-w-7 text-center font-medium">{article.stock}</span>
      <button
        className="stock-button"
        aria-label={`Aumentar existencias de ${article.name}`}
        disabled={article.stock + reservedUnits(cart, article.id) >= MAX_STOCK}
        onClick={() => changeStock(article.id, 1)}
      >
        +
      </button>
    </div>
  );
}
