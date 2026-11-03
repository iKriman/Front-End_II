import { productTypes } from '../data/articles.js';

export function validateArticle(values) {
  const errors = {};
  if (!values.name?.trim()) errors.name = 'Ingresa el nombre del artículo.';
  else if (values.name.trim().length > 80) errors.name = 'El nombre admite hasta 80 caracteres.';
  if (!values.brand?.trim()) errors.brand = 'Ingresa la marca del artículo.';
  else if (values.brand.trim().length > 60) errors.brand = 'La marca admite hasta 60 caracteres.';
  if (!productTypes.includes(values.type)) errors.type = 'Selecciona un tipo de producto.';
  if (
    String(values.price ?? '').trim() === '' ||
    !Number.isSafeInteger(Number(values.price)) ||
    Number(values.price) < 1 ||
    Number(values.price) > 100000000
  ) {
    errors.price = 'Ingresa un precio entero entre $1 y $100.000.000.';
  }
  if (
    String(values.stock ?? '').trim() === '' ||
    !Number.isSafeInteger(Number(values.stock)) ||
    Number(values.stock) < 0 ||
    Number(values.stock) > 1000000
  ) {
    errors.stock = 'Ingresa existencias enteras entre 0 y 1.000.000.';
  }
  return errors;
}

export function isStoredArticle(article) {
  return (
    article &&
    typeof article.id === 'string' &&
    article.id.length > 0 &&
    typeof article.name === 'string' &&
    typeof article.brand === 'string' &&
    Number.isSafeInteger(article.price) &&
    Number.isSafeInteger(article.stock) &&
    Object.keys(validateArticle(article)).length === 0
  );
}

export function inventoryReducer(articles, action) {
  switch (action.type) {
    case 'article/added':
      if (
        !isStoredArticle(action.article) ||
        articles.some((article) => article.id === action.article.id)
      )
        return articles;
      return [...articles, { ...action.article }];
    case 'article/stockChanged':
      if (action.delta !== 1 && action.delta !== -1) return articles;
      return articles.map((article) => {
        if (article.id !== action.id) return article;
        const stock = article.stock + action.delta;
        return Number.isSafeInteger(stock) && stock >= 0 && stock <= 1000000
          ? { ...article, stock }
          : article;
      });
    default:
      return articles;
  }
}
