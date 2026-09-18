// src/schemas/employeeSchema.ts
import { z } from 'zod';

export const sucursalSchema = z.object ({
name: z
.string ( { error: 'El nombre es requerido' })
.min (2, 'Minimo 2 caracteres')
.max (100, 'Maximo 100 caracteres'),

address: z
.string ( { error: 'La direccion es requerida' }),

encargado: z
.string ( { error: 'El encargado es requerido' })
.min (15, 'Minimo 15 caracteres'),


cantidad_empleados: z.coerce
. number ( { error: 'La cantidad de empleados es requerida' })
.min (1, 'La cantidad de empleados debe ser mayor a 0'),



estado: z.enum(['active', 'inactive' ] ) .default ('active'),

telefono: z
.string ()
.regex (/^\+?[\d\s\-()]{7,15}$/, 'Formato de teléfono inválido')
.optional ()
.or (z. literal ( '' ) ) ,



});

export type SucursalFormData = z.infer<typeof sucursalSchema>;

// Tipo de ENTRADA del schema (antes de que Zod corra z.coerce y los .default ()) -
// react-hook-form necesita este tipo para el formulario en sí, distinto del tipo
// de SALIDA (EmployeeFormData) que recibe onSubmit una vez que el resolver ya validó.
export type SucursalFormInput = z.input<typeof sucursalSchema>;