// src/services/sucursalService.ts
import { apiClient } from './api';
import type { Sucursal, CreateSucursalDto, UpdateSucursalDto, PaginatedResponse } from '../types';

export interface SucursalFilters {
  search?: string;
  encargado?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export const sucursalService = {
  getAll: async (filters: SucursalFilters = {}): Promise<PaginatedResponse<Sucursal>> => {
    const params = new URLSearchParams();
    if (filters.search) params.set('q', filters.search);
    if (filters.encargado) params.set('encargado', filters.encargado);
    if (filters.status) params.set('status', filters.status);
    if (filters.page) params.set('_page', String(filters.page));
    if (filters.pageSize) params.set('_limit', String(filters.pageSize));

    const response = await apiClient.get<Sucursal[]>(`/sucursales?${params}`);
    const total = parseInt(response.headers['x-total-count'] || String(response.data.length), 10);
    return {
      data: response.data,
      total,
      page: filters.page || 1,
      pageSize: filters.pageSize || total,
      totalPages: Math.ceil(total / (filters.pageSize || total || 1)),
    };
  },

  getById: async (id: number): Promise<Sucursal> => {
    const response = await apiClient.get<Sucursal>(`/sucursales/${id}`);
    return response.data;
  },

  create: async (data: CreateSucursalDto): Promise<Sucursal> => {
    const response = await apiClient.post<Sucursal>('/sucursales', data);
    return response.data;
  },

  update: async (id: number, data: UpdateSucursalDto): Promise<Sucursal> => {
    const response = await apiClient.patch<Sucursal>(`/sucursales/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/sucursales/${id}`);
  },
};