import { isStoredArticle, MAX_STOCK, isDecimalInteger, reservedUnits } from '../lib/inventory.js';

export const createState = (articles = [], cart = []) => ({
  articles,
  cart,
  notice: null,
  sequence: 0,
});
function notify(state, action, text, tone = 'success') {
  const sequence = state.sequence + 1;
  return { ...state, sequence, notice: { id: sequence, text, tone, path: action.path } };
}
function transfer(state, action, quantity) {
  const article = state.articles.find((item) => item.id === action.id);
  if (!article || !Number.isSafeInteger(quantity)) return state;
  const current = reservedUnits(state.cart, article.id);
  if (quantity < 0 || quantity > MAX_STOCK) return state;
  const delta = quantity - current;
  if (delta > article.stock)
    return notify(
      state,
      action,
      `No hay suficientes existencias de ${article.name}. Quedan ${article.stock} unidades.`,
      'error',
    );
  if (delta === 0) return state;
  const stock = article.stock - delta;
  if (stock < 0 || stock > MAX_STOCK) return state;
  const cart =
    quantity === 0
      ? state.cart.filter((line) => line.articleId !== article.id)
      : current > 0
        ? state.cart.map((line) => (line.articleId === article.id ? { ...line, quantity } : line))
        : [...state.cart, { articleId: article.id, quantity }];
  return notify(
    {
      ...state,
      articles: state.articles.map((item) => (item.id === article.id ? { ...item, stock } : item)),
      cart,
    },
    action,
    `${article.name}: ${quantity} en el carrito y ${stock} disponibles.`,
  );
}

export function inventoryReducer(state, action) {
  switch (action.type) {
    case 'article/added': {
      if (
        !isStoredArticle(action.article) ||
        state.articles.some((article) => article.id === action.article.id)
      )
        return state;
      return notify(
        { ...state, articles: [...state.articles, { ...action.article }] },
        action,
        `Se agregó ${action.article.name} al inventario.`,
      );
    }
    case 'article/stockChanged': {
      if (action.delta !== 1 && action.delta !== -1) return state;
      const article = state.articles.find((item) => item.id === action.id);
      if (!article) return state;
      const stock = article.stock + action.delta;
      if (stock < 0 || stock + reservedUnits(state.cart, article.id) > MAX_STOCK) return state;
      return notify(
        {
          ...state,
          articles: state.articles.map((item) =>
            item.id === article.id ? { ...item, stock } : item,
          ),
        },
        action,
        `${article.name}: ${stock} unidades disponibles.`,
      );
    }
    case 'cart/added': {
      if (!isDecimalInteger(action.quantity, 1, MAX_STOCK)) return state;
      return transfer(
        state,
        action,
        reservedUnits(state.cart, action.id) + Number(action.quantity),
      );
    }
    case 'cart/changed': {
      if (action.delta !== 1 && action.delta !== -1) return state;
      const current = reservedUnits(state.cart, action.id);
      if (!current) return state;
      return transfer(state, action, current + action.delta);
    }
    case 'cart/removed':
      return transfer(state, action, 0);
    case 'cart/cleared': {
      if (!state.cart.length) return state;
      return notify(
        {
          ...state,
          articles: state.articles.map((article) => ({
            ...article,
            stock: article.stock + reservedUnits(state.cart, article.id),
          })),
          cart: [],
        },
        action,
        'Carrito vaciado. Las unidades se devolvieron al inventario.',
      );
    }
    case 'notice/dismissed':
      return state.notice?.id === action.id ? { ...state, notice: null } : state;
    default:
      return state;
  }
}
