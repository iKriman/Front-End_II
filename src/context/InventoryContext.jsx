import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
  useCallback,
  useRef,
} from 'react';
import { useLocation } from 'react-router';
import { inventoryReducer, createState } from './inventoryReducer';
import { validateArticle } from '../lib/inventory';
import { loadInventory, saveInventory } from '../lib/storage';
const InventoryContext = createContext(null);

export function InventoryProvider({ children }) {
  const [recovery] = useState(() =>
    loadInventory({ getItem: (key) => window.localStorage.getItem(key) }),
  );
  const [state, dispatch] = useReducer(inventoryReducer, recovery, (data) =>
    createState(data.articles, data.cart),
  );
  const [storageError, setStorageError] = useState('');
  const [recoveryVisible, setRecoveryVisible] = useState(true);
  const { pathname } = useLocation();
  const previousPath = useRef(pathname);
  useEffect(() => {
    const previous = previousPath.current;
    previousPath.current = pathname;
    if (previous !== pathname && state.notice?.path === previous) {
      dispatch({ type: 'notice/dismissed', id: state.notice.id });
    }
  }, [pathname, state.notice]);
  useEffect(() => {
    try {
      saveInventory(window.localStorage, state, recovery);
      setStorageError('');
    } catch {
      setStorageError(
        'No se pudieron guardar los cambios. Se conservarán mientras la aplicación permanezca abierta.',
      );
    }
  }, [state.articles, state.cart, recovery]);
  const dismissNotice = useCallback((id) => dispatch({ type: 'notice/dismissed', id }), []);
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
    dispatch({ type: 'article/added', article, path: '/inventario' });
    return { article, errors: {} };
  }
  function act(type, extra = {}) {
    dispatch({ type, path: pathname, ...extra });
  }
  return (
    <InventoryContext.Provider
      value={{
        ...state,
        addArticle,
        storageError,
        recoveryIssues: recoveryVisible ? recovery.issues : [],
        dismissRecovery: () => setRecoveryVisible(false),
        changeStock: (id, delta) => act('article/stockChanged', { id, delta }),
        addToCart: (id, quantity) => act('cart/added', { id, quantity }),
        changeCart: (id, delta) => act('cart/changed', { id, delta }),
        removeFromCart: (id) => act('cart/removed', { id }),
        clearCart: () => act('cart/cleared'),
        dismissNotice,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}
export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) throw new Error('useInventory debe usarse dentro de InventoryProvider.');
  return context;
}
