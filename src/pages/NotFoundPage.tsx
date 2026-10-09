// src/pages/NotFoundPage.tsx
import { Link } from 'react-router-dom';
import { usePageNotFound } from '../hooks/usePageNotFound';

function NotFoundPage() {
  usePageNotFound();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 max-w-md w-full text-center">
        <p className="text-7xl font-extrabold text-blue-800 mb-2">404</p>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Página no encontrada</h2>
        <p className="text-slate-500 text-sm mb-6">
          La dirección que buscas no existe o fue movida a otro lugar.
        </p>
        <Link
          to="/dashboard"
          className="inline-block px-5 py-2 bg-blue-800 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Volver al dashboard
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
