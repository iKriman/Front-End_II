export const productTypes = ['Frutas y verduras', 'Abarrotes', 'Lácteos', 'Panadería', 'Limpieza'];

export const initialArticles = [
  {
    id: '1',
    name: 'Manzana roja',
    brand: 'Huerto del Valle',
    type: 'Frutas y verduras',
    price: 1490,
    stock: 42,
    icon: '🍎',
  },
  {
    id: '2',
    name: 'Leche entera 1 L',
    brand: 'Colun',
    type: 'Lácteos',
    price: 1190,
    stock: 8,
    icon: '🥛',
  },
  {
    id: '3',
    name: 'Arroz grado 1 · 1 kg',
    brand: 'Tucapel',
    type: 'Abarrotes',
    price: 1590,
    stock: 35,
    icon: '🌾',
  },
  {
    id: '4',
    name: 'Pan de molde',
    brand: 'Ideal',
    type: 'Panadería',
    price: 2290,
    stock: 0,
    icon: '🍞',
  },
  {
    id: '5',
    name: 'Detergente 1 L',
    brand: 'Quix',
    type: 'Limpieza',
    price: 3490,
    stock: 16,
    icon: '🧴',
  },
  {
    id: '6',
    name: 'Palta hass',
    brand: 'Huerto del Valle',
    type: 'Frutas y verduras',
    price: 3990,
    stock: 6,
    icon: '🥑',
  },
];

export const currency = (value) =>
  new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(value);
export const stockState = (stock) =>
  stock === 0 ? 'Agotado' : stock < 10 ? 'Stock bajo' : 'Disponible';
export const normalize = (value) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
