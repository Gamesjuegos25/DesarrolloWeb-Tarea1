// src/hooks/usePageNotFound.ts
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Registra en consola la URL que no se encontró cada vez que cambia
export function usePageNotFound() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    console.warn(`[404] Página no encontrada: ${pathname}${search}`);
  }, [pathname, search]);
}
