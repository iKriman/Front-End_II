import test from 'node:test';
import assert from 'node:assert/strict';
import { inventoryReducer, createState } from '../src/context/inventoryReducer.js';
import { validateArticle, selectArticles, MAX_STOCK, reservedUnits } from '../src/lib/inventory.js';

const article = {
  id: 'a',
  name: 'Café molido',
  brand: 'Café del Sur',
  type: 'Abarrotes',
  price: 3990,
  stock: 8,
};
const action = (type, extra = {}) => ({ type, path: '/inventario', ...extra });
function freeze(value) {
  Object.freeze(value);
  Object.values(value).forEach((item) => {
    if (item && typeof item === 'object' && !Object.isFrozen(item)) freeze(item);
  });
  return value;
}

test('registro válido e inmutable; rechaza duplicados e inválidos', () => {
  const before = freeze(createState());
  const after = inventoryReducer(before, action('article/added', { article }));
  assert.equal(before.articles.length, 0);
  assert.deepEqual(after.articles, [article]);
  assert.notEqual(after.articles[0], article);
  assert.equal(inventoryReducer(after, action('article/added', { article })), after);
  assert.equal(
    inventoryReducer(
      after,
      action('article/added', { article: { ...article, id: 'b', brand: '' } }),
    ),
    after,
  );
});

test('solo permite dígitos decimales simples en precio y existencias', () => {
  assert.deepEqual(validateArticle(article), {});
  for (const value of [
    '',
    ' ',
    ' 12',
    '12 ',
    '1e2',
    '0x10',
    '+2',
    '-1',
    '1.5',
    '1,5',
    'Infinity',
    null,
    true,
  ]) {
    assert.ok(validateArticle({ ...article, stock: value }).stock, String(value));
    assert.ok(validateArticle({ ...article, price: value }).price, String(value));
  }
  assert.deepEqual(validateArticle({ ...article, price: '0001', stock: '0' }), {});
  assert.ok(validateArticle({ ...article, price: '0' }).price);
  assert.ok(validateArticle({ ...article, stock: '1000001' }).stock);
  assert.ok(validateArticle({ ...article, name: ' ', brand: ' ' }).name);
  assert.ok(validateArticle({ ...article, type: 'Otra' }).type);
});

test('filtrar por categoría, marca y estado no altera ni elimina inventario', () => {
  const articles = freeze([
    article,
    { ...article, id: 'b', name: 'Leche', brand: 'Colun', type: 'Lácteos', stock: 0 },
  ]);
  assert.equal(selectArticles(articles, { category: 'Lácteos' }).length, 1);
  assert.equal(selectArticles(articles, { search: 'CAFE DEL SUR' })[0].id, 'a');
  assert.equal(selectArticles(articles, { category: 'Abarrotes', status: 'Agotado' }).length, 0);
  assert.equal(selectArticles(articles).length, 2);
  assert.equal(articles[0].stock, 8);
});

test('agregar al carrito descuenta inventario y agrupa artículos repetidos', () => {
  const before = freeze(createState([article]));
  const next = inventoryReducer(before, action('cart/added', { id: 'a', quantity: '3' }));
  assert.equal(next.articles[0].stock, 5);
  assert.deepEqual(next.cart, [{ articleId: 'a', quantity: 3 }]);
  assert.equal(before.articles[0].stock, 8);
  const twice = inventoryReducer(next, action('cart/added', { id: 'a', quantity: 2 }));
  assert.equal(twice.articles[0].stock, 3);
  assert.deepEqual(twice.cart, [{ articleId: 'a', quantity: 5 }]);
});

test('no permite comprar más stock del disponible ni cantidades inválidas', () => {
  const before = createState([article]);
  for (const quantity of [9, '1e2', 0, -1, '2.5', ' 2']) {
    const next = inventoryReducer(before, action('cart/added', { id: 'a', quantity }));
    assert.deepEqual(next.articles, before.articles);
    assert.deepEqual(next.cart, []);
  }
  const missing = inventoryReducer(before, action('cart/added', { id: 'missing', quantity: 1 }));
  assert.equal(missing, before);
});

test('cantidad del carrito + y - sincroniza stock; llegar a cero elimina la línea', () => {
  let state = inventoryReducer(
    createState([article]),
    action('cart/added', { id: 'a', quantity: 1 }),
  );
  state = inventoryReducer(state, action('cart/changed', { id: 'a', delta: 1 }));
  assert.equal(state.cart[0].quantity, 2);
  assert.equal(state.articles[0].stock, 6);
  state = inventoryReducer(state, action('cart/changed', { id: 'a', delta: -1 }));
  assert.equal(state.cart[0].quantity, 1);
  assert.equal(state.articles[0].stock, 7);
  state = inventoryReducer(state, action('cart/changed', { id: 'a', delta: -1 }));
  assert.equal(state.cart.length, 0);
  assert.equal(state.articles[0].stock, 8);
});

test('quitar y vaciar devuelven exactamente las unidades reservadas', () => {
  const second = { ...article, id: 'b', stock: 20 };
  let state = createState([article, second]);
  state = inventoryReducer(state, action('cart/added', { id: 'a', quantity: 3 }));
  state = inventoryReducer(state, action('cart/added', { id: 'b', quantity: 4 }));
  const removed = inventoryReducer(state, action('cart/removed', { id: 'a' }));
  assert.equal(removed.articles[0].stock, 8);
  assert.equal(removed.articles[1].stock, 16);
  assert.deepEqual(removed.cart, [{ articleId: 'b', quantity: 4 }]);
  const cleared = inventoryReducer(state, action('cart/cleared'));
  assert.deepEqual(cleared.articles, [article, second]);
  assert.deepEqual(cleared.cart, []);
  assert.equal(inventoryReducer(cleared, action('cart/cleared')), cleared);
});

test('clics consecutivos nunca usan cantidades anteriores en los avisos', () => {
  let state = createState([article]);
  for (let i = 0; i < 15; i++)
    state = inventoryReducer(state, action('cart/added', { id: 'a', quantity: 1 }));
  assert.equal(state.articles[0].stock, 0);
  assert.equal(state.cart[0].quantity, 8);
  assert.match(state.notice.text, /Quedan 0 unidades/);
  const before = state;
  state = inventoryReducer(state, action('article/stockChanged', { id: 'a', delta: 1 }));
  assert.match(state.notice.text, /1 unidades disponibles/);
  state = inventoryReducer(state, action('notice/dismissed', { id: before.notice.id }));
  assert.ok(state.notice);
  state = inventoryReducer(state, action('notice/dismissed', { id: state.notice.id }));
  assert.equal(state.notice, null);
});

test('límite superior incluye unidades reservadas para garantizar su devolución', () => {
  let state = createState([{ ...article, stock: MAX_STOCK }]);
  state = inventoryReducer(state, action('cart/added', { id: 'a', quantity: 1 }));
  assert.equal(
    inventoryReducer(state, action('article/stockChanged', { id: 'a', delta: 1 })),
    state,
  );
  state = inventoryReducer(state, action('cart/removed', { id: 'a' }));
  assert.equal(state.articles[0].stock, MAX_STOCK);
});

test('500 operaciones de carrito conservan stock + reserva y no mutan estados', () => {
  let state = createState([article]);
  let seed = 12345;
  for (let i = 0; i < 500; i++) {
    seed = (seed * 16807) % 2147483647;
    const type = seed % 5;
    const event = [
      action('cart/added', { id: 'a', quantity: (seed % 4) + 1 }),
      action('cart/changed', { id: 'a', delta: 1 }),
      action('cart/changed', { id: 'a', delta: -1 }),
      action('cart/removed', { id: 'a' }),
      action('cart/cleared'),
    ][type];
    freeze(state);
    state = inventoryReducer(state, event);
    assert.equal(state.articles[0].stock + reservedUnits(state.cart, 'a'), 8);
    assert.ok(state.articles[0].stock >= 0);
    assert.ok(state.cart.every((line) => line.quantity > 0));
    assert.ok(state.cart.length <= 1);
  }
});

test('actualizar cantidades conserva el orden de las líneas del carrito', () => {
  let state = createState([article, { ...article, id: 'b' }]);
  state = inventoryReducer(state, action('cart/added', { id: 'a', quantity: 1 }));
  state = inventoryReducer(state, action('cart/added', { id: 'b', quantity: 1 }));
  state = inventoryReducer(state, action('cart/changed', { id: 'a', delta: 1 }));
  assert.deepEqual(
    state.cart.map((line) => line.articleId),
    ['a', 'b'],
  );
});
