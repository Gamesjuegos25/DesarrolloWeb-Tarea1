// src/pages/EmployeeDetailPage.tsx
import { Link, useParams } from 'react-router-dom';
import { useEmployee } from '../hooks/useEmployees';

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

function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const employeeId = id ? Number(id) : null;

  const { data: employee, isLoading, isError, error } = useEmployee(employeeId);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Link
        to="/empleados"
        className="mb-6 inline-flex items-center gap-2 rounded-lg bg-blue-800 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-900"
      >
        ← Volver a empleados
      </Link>

      {isLoading && (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full mr-3" />
          <span>Cargando empleado...</span>
        </div>
      )}

      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700 font-medium">Error al cargar el empleado</p>
          <p className="text-red-500 text-sm mt-1">
            {(error as Error)?.message || 'Error desconocido'}
          </p>
        </div>
      )}

      {!isLoading && !isError && employee && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-2xl overflow-hidden flex-shrink-0">
              {employee.avatarUrl ? (
                <img src={employee.avatarUrl} alt={`Avatar de ${employee.name}`} className="w-full h-full object-cover" />
              ) : (
                employee.name.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{employee.name}</h2>
              <p className="text-slate-500">{employee.position}</p>
            </div>
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <dt className="text-xs font-semibold text-slate-500 uppercase">Email</dt>
              <dd className="text-slate-900 mt-1">{employee.email}</dd>
            </div>

            <div>
              <dt className="text-xs font-semibold text-slate-500 uppercase">Teléfono</dt>
              <dd className="text-slate-900 mt-1">{employee.phone || '—'}</dd>
            </div>

            <div>
              <dt className="text-xs font-semibold text-slate-500 uppercase">Departamento</dt>
              <dd className="text-slate-900 mt-1">{employee.department}</dd>
            </div>

            <div>
              <dt className="text-xs font-semibold text-slate-500 uppercase">Rol</dt>
              <dd className="text-slate-900 mt-1">{roleLabels[employee.role]}</dd>
            </div>

            <div>
              <dt className="text-xs font-semibold text-slate-500 uppercase">Salario mensual</dt>
              <dd className="text-slate-900 mt-1">
                {employee.salary.toLocaleString('es-GT', { style: 'currency', currency: 'GTQ' })}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold text-slate-500 uppercase">Fecha de ingreso</dt>
              <dd className="text-slate-900 mt-1">
                {new Date(employee.hireDate + 'T00:00:00').toLocaleDateString('es-GT', {
                  year: 'numeric', month: 'long', day: 'numeric',
                })}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold text-slate-500 uppercase">Estado</dt>
              <dd className="text-slate-900 mt-1">{statusLabels[employee.status]}</dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}

export default EmployeeDetailPage;