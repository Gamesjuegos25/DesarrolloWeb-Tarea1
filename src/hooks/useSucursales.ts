// src/hooks/useSucursales.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sucursalService, type SucursalFilters } from '../services/sucursalesService';
import type {  CreateSucursalDto, UpdateSucursalDto } from '../types';

export const sucursalesKeys = {
  all: ['sucursales'] as const,
  list: (filters: SucursalFilters) => ['sucursales', 'list', filters] as const,
  detail: (id: number) => ['sucursales', id] as const,
};

export function useSucursales(filters: SucursalFilters = {}) {
  return useQuery({
    queryKey: sucursalesKeys.list(filters),
    queryFn: () => sucursalService.getAll(filters),
  });
}

export function useSucursal(id: number | null) {
  return useQuery({
    queryKey: sucursalesKeys.detail(id!),
    queryFn: () => sucursalService.getById(id!),
    enabled: !!id,
  });
}

export function useCreateSucursal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSucursalDto) => sucursalService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sucursalesKeys.all });
    },
  });
}

export function useUpdateSucursal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSucursalDto }) =>
      sucursalService.update(id, data),
    onSuccess: (UpdateSucursalDto) => {
      queryClient.setQueryData(sucursalesKeys.detail(UpdateSucursalDto.id), UpdateSucursalDto);
      queryClient.invalidateQueries({ queryKey: sucursalesKeys.all });
    },
  });
}

export function useDeleteSucursal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => sucursalService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sucursalesKeys.all });
    },
  });
}