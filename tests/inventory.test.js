import test from 'node:test';
import assert from 'node:assert/strict';
import { inventoryReducer, validateArticle } from '../src/context/inventoryReducer.js';

const article = {
  id: 'test-1',
  name: 'Café molido',
  brand: 'Café del Sur',
  type: 'Abarrotes',
  price: 3990,
  stock: 0,
};

test('agrega artículos sin modificar el arreglo original', () => {
  const before = Object.freeze([]);
  const after = inventoryReducer(before, { type: 'article/added', article });
  assert.equal(before.length, 0);
  assert.deepEqual(after, [article]);
  assert.notEqual(after[0], article);
});

test('no admite registros incompletos ni identificadores repetidos', () => {
  const before = [article];
  assert.equal(inventoryReducer(before, { type: 'article/added', article }), before);
  assert.equal(
    inventoryReducer(before, {
      type: 'article/added',
      article: { ...article, id: '2', brand: '' },
    }),
    before,
  );
});

test('rechaza cantidades negativas, decimales y entradas numéricas vacías', () => {
  assert.deepEqual(validateArticle(article), {});
  for (const stock of [-1, 1.5, '', ' ']) assert.ok(validateArticle({ ...article, stock }).stock);
  for (const price of [0, -1, 1.5, '', ' '])
    assert.ok(validateArticle({ ...article, price }).price);
  assert.ok(validateArticle({ ...article, brand: '  ' }).brand);
  assert.ok(validateArticle({ ...article, type: 'Otro' }).type);
});

test('actualiza existencias sin cambiar otras propiedades ni mutar el estado', () => {
  const before = Object.freeze([Object.freeze({ ...article, stock: 8 })]);
  const after = inventoryReducer(before, {
    type: 'article/stockChanged',
    id: article.id,
    delta: 1,
  });
  assert.equal(before[0].stock, 8);
  assert.deepEqual(after[0], { ...article, stock: 9 });
});

test('mantiene las existencias dentro de los límites', () => {
  assert.equal(
    inventoryReducer([article], { type: 'article/stockChanged', id: article.id, delta: -1 })[0]
      .stock,
    0,
  );
  const maximum = [{ ...article, stock: 1000000 }];
  assert.equal(
    inventoryReducer(maximum, { type: 'article/stockChanged', id: article.id, delta: 1 })[0].stock,
    1000000,
  );
  assert.equal(
    inventoryReducer(maximum, { type: 'article/stockChanged', id: article.id, delta: 2 }),
    maximum,
  );
});
