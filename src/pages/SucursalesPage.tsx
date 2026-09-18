// src/pages/SucursalesPage.tsx
import { useState, useCallback, useMemo } from 'react';
import type { Sucursal, SucursalesStatus } from '../types';
import SucursalCard from '../components/SucursalesCard';
import StatsBadge from '../components/StatsBadge';
import FormField from '../components/FormField';
import Modal from '../components/Modal';
import SucursalForm from '../components/SucursalesForm';
import { useSucursales, useCreateSucursal, useUpdateSucursal, useDeleteSucursal } from '../hooks/useSucursales';
import type { SucursalFormData } from '../schemas/sucursalSchema';

const formFieldClass = 'w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';

// Ciclo de estados al hacer clic en la insignia de una tarjeta
const nextStatus: Record<SucursalesStatus, SucursalesStatus> = {
  active: 'inactive',
  inactive: 'active',
};
  
function SucursalesPage() {
  // Estado de los filtros — estado LOCAL (de la UI), no del servidor
  const [search, setSearch] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<SucursalesStatus | ''>('');

  // Estado del SERVIDOR: la lista de sucursales, filtrada.
  const { data, isLoading: loading, isError, error: queryError } = useSucursales({
    search: search || undefined,
    status: selectedStatus || undefined,
  });
  const sucursales = data?.data || [];

  // Segunda query, sin filtros — estadísticas sobre el TOTAL, no sobre el filtro activo
  const { data: allData } = useSucursales({});
  const allSucursales = useMemo(() => allData?.data ?? [], [allData]);
  const totalSucursales = allSucursales.length;
  const activeSucursales = allSucursales.filter(s => s.estado === 'active').length;
  const inactiveSucursales = allSucursales.filter(s => s.estado === 'inactive').length;

  const createSucursal = useCreateSucursal();
  const updateSucursal = useUpdateSucursal();
  const deleteSucursal = useDeleteSucursal();

  // Estado del modal de creación/edición
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingSucursal, setEditingSucursal] = useState<Sucursal | undefined>();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSelectSucursal = useCallback((sucursal: Sucursal) => {
    alert(`Sucursal: ${sucursal.name}\nEncargado: ${sucursal.encargado}\nDirección: ${sucursal.address}`);
  }, []);

  const handleDeleteSucursal = useCallback((id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta sucursal?')) return;
    deleteSucursal.mutate(id);
  }, [deleteSucursal]);

  // Actualiza el estado de una sucursal (ciclo Activa → Inactiva → Activa)
  const handleToggleStatus = useCallback((sucursal: Sucursal) => {
    updateSucursal.mutate({ id: sucursal.id, data: { estado: nextStatus[sucursal.estado] } });
  }, [updateSucursal]);

  const handleOpenCreate = useCallback(() => {
    setEditingSucursal(undefined);
    setSubmitError(null);
    setModalOpen(true);
  }, []);

  const handleOpenEdit = useCallback((sucursal: Sucursal) => {
    setEditingSucursal(sucursal);
    setSubmitError(null);
    setModalOpen(true);
  }, []);

  const handleSubmit = useCallback(async (formData: SucursalFormData) => {
    setSubmitError(null);
    try {
      if (editingSucursal) {
        await updateSucursal.mutateAsync({ id: editingSucursal.id, data: formData });
      } else {
        await createSucursal.mutateAsync(formData);
      }
      setModalOpen(false);
    } catch {
      setSubmitError('No se pudo guardar la sucursal. Intenta de nuevo.');
    }
  }, [editingSucursal, createSucursal, updateSucursal]);

  const statuses: SucursalesStatus[] = ['active', 'inactive'];
  const statusLabels: Record<SucursalesStatus, string> = {
    active: 'Activa',
    inactive: 'Inactiva',
  };

  return (
    <div className="p-6">
      {/* Encabezado */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gestión de Sucursales</h2>
          <p className="text-slate-500 mt-1">
            {loading ? 'Cargando...' : `${sucursales.length} de ${totalSucursales} sucursales`}
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 bg-brand-800 hover:bg-brand-700 text-black rounded-lg text-sm font-medium transition-colors"
        >
          + Nueva sucursal
        </button>
      </div>

      {/* Estadísticas */}
      <div className="flex flex-wrap gap-4 mb-6">
        <StatsBadge label="Total de sucursales" value={totalSucursales} variant="blue" />
        <StatsBadge label="Sucursales activas" value={activeSucursales} variant="green" />
        <StatsBadge label="Sucursales inactivas" value={inactiveSucursales} variant="red" />
      </div>

      {/* Barra de filtros */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 flex flex-wrap items-end gap-3">
        <FormField label="Buscar" className="flex-1 min-w-[220px]">
          <input
            type="text"
            placeholder="Buscar por nombre o encargado..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={formFieldClass}
          />
        </FormField>

        <FormField label="Estado" className="min-w-[160px]">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as SucursalesStatus | '')}
            className={formFieldClass}
          >
            <option value="">Todos los estados</option>
            {statuses.map(status => (
              <option key={status} value={status}>{statusLabels[status]}</option>
            ))}
          </select>
        </FormField>

        {(search || selectedStatus) && (
          <button
            onClick={() => { setSearch(''); setSelectedStatus(''); }}
            className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg text-sm transition-colors"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Estado de carga */}
      {loading && (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full mr-3" />
          <span>Cargando sucursales...</span>
        </div>
      )}

      {/* Estado de error */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700 font-medium">Error al cargar las sucursales</p>
          <p className="text-red-500 text-sm mt-1">
            {(queryError as Error)?.message || 'Error desconocido'}
          </p>
        </div>
      )}

      {/* Sin resultados */}
      {!loading && !isError && sucursales.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <p>No se encontraron sucursales con los filtros aplicados.</p>
        </div>
      )}

      {/* Lista de sucursales */}
      {!loading && !isError && sucursales.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sucursales.map(sucursal => (
            <div key={sucursal.id} className="relative">
              <div className="absolute -top-2.5 -right-2.5 z-10 flex gap-1">
                <button
                  onClick={() => handleOpenEdit(sucursal)}
                  aria-label="Editar sucursal"
                  title="Editar sucursal"
                  className="w-6 h-6 rounded-full border-2 border-white bg-brand-600 text-white cursor-pointer text-xs leading-5 shadow-md"
                >
                  ✎
                </button>
                <button
                  onClick={() => handleDeleteSucursal(sucursal.id)}
                  aria-label="Eliminar sucursal"
                  title="Eliminar sucursal"
                  className="w-6 h-6 rounded-full border-2 border-white bg-red-500 text-white cursor-pointer text-sm leading-5 shadow-md"
                >
                  ×
                </button>
              </div>
              <SucursalCard
                sucursal={sucursal}
                onSelect={handleSelectSucursal}
                onToggleStatus={handleToggleStatus}
              />
            </div>
          ))}
        </div>
      )}

      {/* Modal de creación/edición — React Hook Form + Zod */}
      <Modal
        isOpen={modalOpen}
        title={editingSucursal ? `Editar: ${editingSucursal.name}` : 'Nueva sucursal'}
        onClose={() => setModalOpen(false)}
      >
        <SucursalForm
          sucursal={editingSucursal}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          isLoading={createSucursal.isPending || updateSucursal.isPending}
          error={submitError}
        />
      </Modal>
    </div>
  );
}

export default SucursalesPage;