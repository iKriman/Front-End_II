import React, { useEffect } from 'react';
import { useLocation } from 'react-router';
import { useInventory } from '../context/InventoryContext';
export default function Notice() {
  const { notice, dismissNotice } = useInventory();
  const { pathname } = useLocation();

  useEffect(() => {
    if (!notice) return;
    if (notice.path !== pathname) {
      return;
    }

    const timer = window.setTimeout(() => dismissNotice(notice.id), 6000);
    return () => window.clearTimeout(timer);
  }, [notice, pathname, dismissNotice]);
  const visible = notice && notice.path === pathname;
  return (
    <div aria-live="polite" aria-atomic="true">
      {visible && (
        <div
          className={`mb-6 flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${notice.tone === 'error' ? 'border-red-200 bg-red-50 text-red-900' : 'border-emerald-200 bg-emerald-50 text-emerald-900'}`}
        >
          <span>{notice.text}</span>
          <button
            type="button"
            className="shrink-0 rounded px-2 py-1 text-xl"
            aria-label="Cerrar aviso"
            onClick={() => dismissNotice(notice.id)}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
