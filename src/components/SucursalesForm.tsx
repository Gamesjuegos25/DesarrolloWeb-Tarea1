// src/components/EmployeeForm.tsx
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { sucursalSchema, type SucursalFormData, type SucursalFormInput } from '../schemas/sucursalSchema';
import type { Sucursal } from '../types';

interface SucursalFormProps {
  sucursal?: Sucursal; // Si viene, es modo edición
  onSubmit: (data: SucursalFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  error?: string | null; // Error de la mutación (crear/actualizar falló), no de validación
}

// Componente reutilizable para un campo del formulario
function FormField({
  label,
  error,
  children,
  required = false,
}: {
  label: string;
  error?: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

const inputClass = (hasError: boolean) => `
  w-full px-3 py-2 border rounded-lg text-sm transition-colors
  focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
  ${hasError
    ? 'border-red-400 bg-red-50 focus:ring-red-400'
    : 'border-slate-300 bg-white'
  }
`;

function SucursalForm({ sucursal, onSubmit, onCancel, isLoading = false, error }: SucursalFormProps) {
  const isEditing = !!sucursal;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<SucursalFormInput, unknown, SucursalFormData>({
    resolver: zodResolver(sucursalSchema),
    defaultValues: {
      name: '',
      address: '',
      encargado:'',
      telefono: '',
      cantidad_empleados: 1,
      estado: 'active',
      
    },
  });

  // Si viene un empleado (modo edición), poblar el formulario
  useEffect(() => {
    if (sucursal) {
      reset({
        name: sucursal.name,
        address: sucursal.address,
        encargado: sucursal.encargado,
        telefono: sucursal.telefono,
        cantidad_empleados: sucursal.cantidad_empleados,
        
      });
    }
  }, [sucursal, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm" role="alert">
          {error}
        </div>
      )}

      {/* Fila 1: Nombre y Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Nombre completo" error={errors.name?.message} required>
          <input
            {...register('name')}
            type="text"
            placeholder="Sucursales Garcia"
            className={inputClass(!!errors.name)}
            aria-required="true"
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
        </FormField>

        <FormField label="direccion" error={errors.address?.message} required>
          <input
            {...register('address')}
            type="address"
            placeholder="av principal"
            className={inputClass(!!errors.address)}
            aria-required="true"
          />
        </FormField>
      </div>

      {/* Fila 2: Cargo y Departamento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="encargado" error={errors.encargado?.message} required>
          <input
            {...register('encargado')}
            type="text"
            placeholder="Juan Perez"
            className={inputClass(!!errors.encargado)}
            aria-required="true"
          />
        </FormField>

        <FormField label="telefono" error={errors.telefono?.message} required>
          <input
            {...register('telefono')}
            placeholder="12131415"
            className={inputClass(!!errors.telefono)}
            aria-required="true"
          >
         
          </input>
        </FormField>
      </div>

      {/* Fila 3: Salario y Fecha de ingreso */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Cantidad Empleados " error={errors.cantidad_empleados?.message} required>
          <input
            {...register('cantidad_empleados')}
            type="number"
            min="0"
            step="100"
            placeholder="100"
            className={inputClass(!!errors.cantidad_empleados)}
            aria-required="true"
          />
        </FormField>

     

        <FormField label="Estado" error={errors.estado?.message}>
          <select {...register('estado')} className={inputClass(!!errors.estado)}>
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
         
          </select>
        </FormField>
      </div>

  

      {/* Botones */}
      <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 border border-slate-300 hover:border-slate-400 rounded-lg transition-colors disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading || (!isDirty && isEditing)}
          className="px-4 py-2 text-sm font-medium text-black bg-brand-800 hover:bg-brand-700 rounded-lg transition-colors disabled:opacity-50 min-w-24"
        >
          {isLoading
            ? 'Guardando...'
            : isEditing ? 'Guardar cambios' : 'Crear Sucursal'
          }
        </button>
      </div>
    </form>
  );
}

export default SucursalForm;