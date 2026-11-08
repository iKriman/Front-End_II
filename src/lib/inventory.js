import { productTypes } from '../data/articles.js';
export const MAX_STOCK = 1000000;
export const MAX_PRICE = 100000000;

export function isDecimalInteger(value, minimum, maximum) {
  if (typeof value !== 'string' && typeof value !== 'number') return false;
  return (
    /^\d+$/.test(String(value)) &&
    Number.isSafeInteger(Number(value)) &&
    Number(value) >= minimum &&
    Number(value) <= maximum
  );
}

export function validateArticle(values = {}) {
  const errors = {};
  if (typeof values.name !== 'string' || !values.name.trim())
    errors.name = 'Ingresa el nombre del artículo.';
  else if (values.name.trim().length > 80) errors.name = 'El nombre admite hasta 80 caracteres.';
  if (typeof values.brand !== 'string' || !values.brand.trim())
    errors.brand = 'Ingresa la marca del artículo.';
  else if (values.brand.trim().length > 60) errors.brand = 'La marca admite hasta 60 caracteres.';
  if (!productTypes.includes(values.type)) errors.type = 'Selecciona una categoría.';
  if (!isDecimalInteger(values.price, 1, MAX_PRICE))
    errors.price = 'Ingresa solo dígitos: precio entre $1 y $100.000.000.';
  if (!isDecimalInteger(values.stock, 0, MAX_STOCK))
    errors.stock = 'Ingresa solo dígitos: existencias entre 0 y 1.000.000.';
  return errors;
}

export function isStoredArticle(article) {
  return Boolean(
    article &&
    typeof article.id === 'string' &&
    article.id.trim() &&
    typeof article.price === 'number' &&
    typeof article.stock === 'number' &&
    Object.keys(validateArticle(article)).length === 0,
  );
}

export const cartUnits = (cart) => cart.reduce((sum, line) => sum + line.quantity, 0);
export const reservedUnits = (cart, id) =>
  cart.find((line) => line.articleId === id)?.quantity || 0;
export function selectArticles(
  articles,
  { search = '', category = 'Todas', status = 'Todos' } = {},
) {
  const norm = (value) =>
    value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  return articles.filter(
    (article) =>
      norm(`${article.name} ${article.brand}`).includes(norm(search)) &&
      (category === 'Todas' || article.type === category) &&
      (status === 'Todos' ||
        (article.stock === 0 ? 'Agotado' : article.stock < 10 ? 'Stock bajo' : 'Disponible') ===
          status),
  );
}
