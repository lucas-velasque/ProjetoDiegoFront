'use client';

import React, { useState } from 'react';

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface Filter {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'number';
  options?: { value: string; label: string }[];
  placeholder?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  filters?: Filter[];
  loading?: boolean;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  onFilterChange?: (filtros: Record<string, any>) => void;
  onAdd?: () => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  actions?: boolean;
  addButtonText?: string;
}

export function DataTable<T extends { id: number | string }>({
  data,
  columns,
  filters = [],
  loading = false,
  pagination,
  onFilterChange,
  onAdd,
  onEdit,
  onDelete,
  actions = true,
  addButtonText = 'Adicionar',
}: DataTableProps<T>) {
  const [filtroValues, setFiltroValues] = useState<Record<string, any>>({});
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (key: string, value: any) => {
    const novosF iltros = { ...filtroValues, [key]: value };
    setFiltroValues(novosFiltros);
    if (onFilterChange) {
      onFilterChange(novosFiltros);
    }
  };

  const limparFiltros = () => {
    setFiltroValues({});
    if (onFilterChange) {
      onFilterChange({});
    }
  };

  return (
    <div className="w-full">
      {/* Header com botões de ação */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {filters.length > 0 && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="rounded bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
            >
              {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
            </button>
          )}
          {Object.keys(filtroValues).length > 0 && (
            <button
              onClick={limparFiltros}
              className="rounded bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
            >
              Limpar Filtros
            </button>
          )}
        </div>
        {onAdd && (
          <button
            onClick={onAdd}
            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            + {addButtonText}
          </button>
        )}
      </div>

      {/* Filtros */}
      {showFilters && filters.length > 0 && (
        <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filters.map((filter) => (
              <div key={filter.key}>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  {filter.label}
                </label>
                {filter.type === 'text' && (
                  <input
                    type="text"
                    value={filtroValues[filter.key] || ''}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    placeholder={filter.placeholder}
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                )}
                {filter.type === 'number' && (
                  <input
                    type="number"
                    value={filtroValues[filter.key] || ''}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    placeholder={filter.placeholder}
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                )}
                {filter.type === 'date' && (
                  <input
                    type="date"
                    value={filtroValues[filter.key] || ''}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                )}
                {filter.type === 'select' && filter.options && (
                  <select
                    value={filtroValues[filter.key] || ''}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Todos</option>
                    {filter.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabela */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-600"></div>
          </div>
        ) : data.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-gray-500">
            Nenhum registro encontrado
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      {column.label}
                    </th>
                  ))}
                  {actions && (onEdit || onDelete) && (
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Ações
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {data.map((item, index) => (
                  <tr key={item.id || index} className="hover:bg-gray-50">
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className="whitespace-nowrap px-6 py-4 text-sm text-gray-900"
                      >
                        {column.render
                          ? column.render(item)
                          : String((item as any)[column.key] || '-')}
                      </td>
                    ))}
                    {actions && (onEdit || onDelete) && (
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          {onEdit && (
                            <button
                              onClick={() => onEdit(item)}
                              className="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600"
                            >
                              Editar
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(item)}
                              className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                            >
                              Excluir
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Paginação */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Página {pagination.currentPage} de {pagination.totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="rounded bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="rounded bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Próximo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
