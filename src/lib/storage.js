import { initialArticles } from '../data/articles.js';
import { isStoredArticle, isDecimalInteger, MAX_STOCK } from './inventory.js';

export const STORAGE_KEY = 'la-huerta-inventario-v3';

export function recoverSnapshot(value, legacy = false) {
  const issues = [];
  const raw = legacy ? value : value?.version === 3 ? value.articles : null;
  if (!Array.isArray(raw))
    return {
      articles: [],
      cart: [],
      issues: [
        'La estructura del inventario guardado no es válida. Se abrió un inventario vacío para evitar reemplazar datos con productos de muestra.',
      ],
    };
  const ids = new Set();
  let discarded = 0;
  const articles = [];
  for (const item of raw) {
    const article =
      legacy && item && typeof item === 'object'
        ? {
            ...item,
            type: item.type || item.category,
            brand:
              typeof item.brand === 'string' && item.brand.trim() ? item.brand : 'Sin especificar',
          }
        : item;
    if (!isStoredArticle(article) || ids.has(article.id)) {
      discarded++;
      continue;
    }
    ids.add(article.id);
    articles.push({
      id: article.id,
      name: article.name.trim(),
      brand: article.brand.trim(),
      type: article.type,
      price: article.price,
      stock: article.stock,
      icon: typeof article.icon === 'string' ? article.icon : '📦',
    });
  }
  if (discarded)
    issues.push(
      `Se recuperaron ${articles.length} artículos válidos y se omitieron ${discarded} registros inválidos o duplicados.`,
    );
  const cart = [];
  const cartIds = new Set();
  let invalidLines = 0;
  const lines = legacy ? [] : value.cart;
  if (!Array.isArray(lines))
    issues.push('El carrito guardado no es válido. Revisa las existencias antes de continuar.');
  else
    for (const line of lines) {
      const article = articles.find((item) => item.id === line?.articleId);
      if (
        !article ||
        cartIds.has(line.articleId) ||
        typeof line.quantity !== 'number' ||
        !isDecimalInteger(line.quantity, 1, MAX_STOCK) ||
        article.stock + line.quantity > MAX_STOCK
      ) {
        invalidLines++;
        continue;
      }
      cartIds.add(line.articleId);
      cart.push({ articleId: line.articleId, quantity: line.quantity });
    }
  if (invalidLines)
    issues.push(
      `Se omitieron ${invalidLines} líneas inconsistentes del carrito. Revisa las existencias, ya que sus cantidades no se pueden reconstruir con certeza.`,
    );
  return { articles, cart, issues };
}

export function loadInventory(storage) {
  try {
    for (const key of [STORAGE_KEY, 'la-huerta-inventario-v2', 'la-huerta-inventario-v1']) {
      const raw = storage.getItem(key);
      if (raw === null) continue;
      try {
        const recovered = recoverSnapshot(JSON.parse(raw), key !== STORAGE_KEY);
        return {
          ...recovered,
          sourceKey: key,
          sourceRaw: raw,
          needsBackup: recovered.issues.length > 0,
        };
      } catch {
        return {
          articles: [],
          cart: [],
          issues: [
            'No se pudo leer el inventario guardado. Se conservó su contenido para recuperación; no se cargaron productos de muestra.',
          ],
          sourceKey: key,
          sourceRaw: raw,
          needsBackup: true,
        };
      }
    }
    return {
      articles: initialArticles.map((article) => ({ ...article })),
      cart: [],
      issues: [],
      needsBackup: false,
    };
  } catch {
    return {
      articles: initialArticles.map((article) => ({ ...article })),
      cart: [],
      issues: [
        'No se pudo acceder al almacenamiento. Los cambios permanecerán durante esta sesión.',
      ],
      needsBackup: false,
    };
  }
}

export function saveInventory(storage, state, recovery) {
  if (recovery.needsBackup) {
    const backupKey = `${STORAGE_KEY}-recuperacion`;
    if (storage.getItem(backupKey) === null)
      storage.setItem(
        backupKey,
        JSON.stringify({ sourceKey: recovery.sourceKey, raw: recovery.sourceRaw }),
      );
  }
  storage.setItem(
    STORAGE_KEY,
    JSON.stringify({ version: 3, articles: state.articles, cart: state.cart }),
  );
}
