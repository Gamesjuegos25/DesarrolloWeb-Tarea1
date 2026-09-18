// src/pages/SucursalesDetailPage.tsx
import { Link, useParams } from 'react-router-dom';
import { useSucursal } from '../hooks/useSucursales';


const statusLabels: Record<string, string> = {
  active: 'Activo',
  inactive: 'Inactivo',
  on_leave: 'En permiso',
};

const roleLabels: Record<string, string> = {
  employee: 'Empleado',
  hr: 'Recursos Humanos',
  admin: 'Administrador',
};

function SucursalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const sucursalId = id ? Number(id) : null;

  const { data: sucursal, isLoading, isError, error } = useSucursal(sucursalId);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Link
        to="/sucursales"
        className="mb-6 inline-flex items-center gap-2 rounded-lg bg-blue-800 px-4 py-2 text-sm font-semibold text-black shadow-sm hover:bg-blue-900"
      >
        ← Volver a sucursal
      </Link>

      {isLoading && (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full mr-3" />
          <span>Cargando sucursal...</span>
        </div>
      )}

      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700 font-medium">Error al cargar la Sucursal</p>
          <p className="text-red-500 text-sm mt-1">
            {(error as Error)?.message || 'Error desconocido'}
          </p>
        </div>
      )}

      {!isLoading && !isError && sucursal && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{sucursal.name}</h2>
              <p className="text-slate-500">{sucursal.address}</p>
            </div>
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <dt className="text-xs font-semibold text-slate-500 uppercase">encargado</dt>
              <dd className="text-slate-900 mt-1">{sucursal.encargado}</dd>
            </div>

            <div>
              <dt className="text-xs font-semibold text-slate-500 uppercase">Teléfono</dt>
              <dd className="text-slate-900 mt-1">{sucursal.telefono || '—'}</dd>
            </div>

          

            <div>
              <dt className="text-xs font-semibold text-slate-500 uppercase">Rol</dt>
              <dd className="text-slate-900 mt-1">{roleLabels[sucursal.cantidad_empleados]}</dd>
            </div>

          

            <div>
              <dt className="text-xs font-semibold text-slate-500 uppercase">Estado</dt>
              <dd className="text-slate-900 mt-1">{statusLabels[sucursal.estado]}</dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}

export default SucursalDetailPage;