import test from 'node:test';
import assert from 'node:assert/strict';
import { loadInventory, recoverSnapshot, saveInventory, STORAGE_KEY } from '../src/lib/storage.js';
import { createState } from '../src/context/inventoryReducer.js';
const article = {
  id: 'a',
  name: 'Arroz',
  brand: 'Tucapel',
  type: 'Abarrotes',
  price: 1590,
  stock: 5,
};
function storage(entries = {}) {
  const values = new Map(Object.entries(entries));
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
}

test('primera visita carga datos iniciales; inventario vacío guardado se respeta', () => {
  assert.ok(loadInventory(storage()).articles.length > 0);
  assert.deepEqual(
    loadInventory(
      storage({ [STORAGE_KEY]: JSON.stringify({ version: 3, articles: [], cart: [] }) }),
    ).articles,
    [],
  );
});

test('recupera registros válidos, omite duplicados e informa inconsistencias', () => {
  const data = recoverSnapshot({
    version: 3,
    articles: [article, { ...article, id: 'b', stock: -1 }, article, null],
    cart: [],
  });
  assert.deepEqual(data.articles, [{ ...article, icon: '📦' }]);
  assert.ok(data.issues.length);
});

test('JSON ilegible y estructura incorrecta nunca se reemplazan con artículos de muestra', () => {
  for (const raw of ['{broken', '{}', 'null']) {
    const result = loadInventory(storage({ [STORAGE_KEY]: raw }));
    assert.deepEqual(result.articles, []);
    assert.ok(result.issues.length);
    assert.equal(result.sourceRaw, raw);
  }
});

test('guarda una copia de recuperación antes de persistir datos recuperados', () => {
  const raw = JSON.stringify({ version: 3, articles: [article, null], cart: [] });
  const store = storage({ [STORAGE_KEY]: raw });
  const recovered = loadInventory(store);
  saveInventory(store, createState(recovered.articles, recovered.cart), recovered);
  assert.equal(JSON.parse(store.getItem(`${STORAGE_KEY}-recuperacion`)).raw, raw);
  assert.equal(JSON.parse(store.getItem(STORAGE_KEY)).articles.length, 1);
});

test('si falla la copia de recuperación no sobrescribe el original', () => {
  const store = {
    getItem: () => null,
    setItem: () => {
      throw new Error('sin espacio');
    },
  };
  assert.throws(() =>
    saveInventory(store, createState(), { needsBackup: true, sourceRaw: 'original' }),
  );
});

test('migración de semanas anteriores conserva artículos y categoría', () => {
  const legacy = { ...article, brand: undefined, type: undefined, category: 'Abarrotes' };
  const result = loadInventory(
    storage({ 'la-huerta-inventario-v1': JSON.stringify([legacy, null]) }),
  );
  assert.equal(result.articles.length, 1);
  assert.equal(result.articles[0].brand, 'Sin especificar');
  assert.equal(result.articles[0].type, 'Abarrotes');
  assert.ok(result.issues.length);
});

test('persistencia conserva juntos carrito y existencias, sin volver a descontar', () => {
  const store = storage();
  const state = createState([article], [{ articleId: 'a', quantity: 3 }]);
  saveInventory(store, state, { needsBackup: false });
  const reloaded = loadInventory(store);
  assert.equal(reloaded.articles[0].stock, 5);
  assert.equal(reloaded.cart[0].quantity, 3);
});

test('carrito inconsistente recupera líneas válidas e informa líneas omitidas', () => {
  const result = recoverSnapshot({
    version: 3,
    articles: [article],
    cart: [
      { articleId: 'a', quantity: 2 },
      { articleId: 'missing', quantity: 2 },
      { articleId: 'a', quantity: 4 },
    ],
  });
  assert.deepEqual(result.cart, [{ articleId: 'a', quantity: 2 }]);
  assert.ok(result.issues.length);
});

test('almacenamiento bloqueado se informa y no impide usar la aplicación', () => {
  const result = loadInventory({
    getItem: () => {
      throw new Error('bloqueado');
    },
  });
  assert.ok(result.articles.length);
  assert.ok(result.issues.length);
});
