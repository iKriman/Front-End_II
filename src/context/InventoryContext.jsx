import React, { createContext, useContext, useEffect, useReducer, useState } from 'react';
import { initialArticles } from '../data/articles';
import { inventoryReducer, isStoredArticle, validateArticle } from './inventoryReducer';

const InventoryContext = createContext(null);
const storageKey = 'la-huerta-inventario-v2';

function loadArticles() {
  try {
    const current = localStorage.getItem(storageKey);
    if (current !== null) {
      const articles = JSON.parse(current);
      if (
        Array.isArray(articles) &&
        articles.every(isStoredArticle) &&
        new Set(articles.map((a) => a.id)).size === articles.length
      )
        return articles;
      return initialArticles;
    }
    // Conserva el inventario de la primera semana al abrir la nueva versión.
    const previous = JSON.parse(localStorage.getItem('la-huerta-inventario-v1'));
    if (Array.isArray(previous)) {
      const migrated = previous.map((article) => ({
        ...article,
        brand:
          typeof article.brand === 'string' && article.brand.trim()
            ? article.brand
            : 'Sin especificar',
        type: article.type || article.category,
      }));
      if (
        migrated.every(isStoredArticle) &&
        new Set(migrated.map((a) => a.id)).size === migrated.length
      )
        return migrated;
    }
  } catch {
    /* Un dato inválido no impide iniciar la aplicación. */
  }
  return initialArticles;
}

export function InventoryProvider({ children }) {
  const [articles, dispatch] = useReducer(inventoryReducer, undefined, loadArticles);
  const [storageError, setStorageError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(articles));
      setStorageError('');
    } catch {
      setStorageError(
        'No se pudieron guardar los cambios en este navegador. Se conservarán mientras la aplicación permanezca abierta.',
      );
    }
  }, [articles]);

  function addArticle(values) {
    const errors = validateArticle(values);
    if (Object.keys(errors).length) return { errors };
    const article = {
      id: crypto.randomUUID(),
      name: values.name.trim(),
      brand: values.brand.trim(),
      type: values.type,
      price: Number(values.price),
      stock: Number(values.stock),
      icon: '📦',
    };
    dispatch({ type: 'article/added', article });
    setNotice(`Se agregó ${article.name} al inventario.`);
    return { article, errors: {} };
  }

  function changeStock(id, delta) {
    dispatch({ type: 'article/stockChanged', id, delta });
  }

  return (
    <InventoryContext.Provider value={{ articles, addArticle, changeStock, storageError, notice }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) throw new Error('useInventory debe usarse dentro de InventoryProvider.');
  return context;
}
