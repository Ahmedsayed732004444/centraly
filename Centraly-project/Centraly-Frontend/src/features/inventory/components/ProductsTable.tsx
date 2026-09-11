import { Trash2, Package } from 'lucide-react';
import { DataTable } from '@/shared/components/ui/DataTable';
import { ProductStatusBadge } from './ProductStatusBadge';
import { ProductResponse } from '@/features/inventory/schemas/inventorySchemas';
import { PaginatedList } from '@/shared/types/pagination';
import { HasPermission } from '@/features/auth/components/HasPermission';
import { Permissions } from '@/features/auth/schemas/permissions';

interface ProductsTableProps {
  data?: PaginatedList<ProductResponse>;
  isLoading: boolean;
  pageIndex: number;
  onNextPage: () => void;
  onPrevPage: () => void;
  onDelete?: (product: ProductResponse) => void;
  onRowClick?: (product: ProductResponse) => void;
}

export function ProductsTable({
  data,
  isLoading,
  pageIndex,
  onNextPage,
  onPrevPage,
  onDelete,
  onRowClick,
}: ProductsTableProps) {
  const columns = [
    {
      header: 'الصورة',
      cell: (row: ProductResponse) => (
        <div className="flex items-center">
          {row.imageUrl ? (
            <img src={row.imageUrl} alt={row.name} className="w-12 h-12 rounded-lg object-cover border border-gray-200 shadow-sm" />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-200 text-gray-400 text-sm font-bold shadow-sm">
              {row.name ? row.name.charAt(0).toUpperCase() : '?'}
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'اسم المنتج',
      cell: (row: ProductResponse) => (
        <span className="text-base font-bold text-gray-900">{row.name}</span>
      ),
    },
    {
      header: 'الباركود',
      cell: (row: ProductResponse) => (
        <span className="text-sm font-semibold text-gray-600 font-mono bg-gray-50 px-2 py-1 rounded border border-gray-100">
          {row.barcode || '---'}
        </span>
      ),
    },
    {
      header: 'القسم',
      cell: (row: ProductResponse) => (
        <div className="flex flex-col gap-1.5 items-start">
          {row.department?.name && (
            <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-xs font-bold border border-blue-100">
              {row.department.name}
            </span>
          )}
          <span className="bg-gray-50 text-gray-700 px-2.5 py-1 rounded-md text-xs font-semibold border border-gray-200">
            {row.category?.name || '---'}
          </span>
        </div>
      ),
    },
    {
      header: 'النوع',
      cell: (row: ProductResponse) => {
        let label = 'غير محدد';
        let color = 'bg-gray-100 text-gray-700';
        if (row.usage === 1) {
          label = 'بيع فقط';
          color = 'bg-emerald-50 text-emerald-700 border-emerald-100';
        } else if (row.usage === 2) {
          label = 'صيانة فقط';
          color = 'bg-orange-50 text-orange-700 border-orange-100';
        } else if (row.usage === 3) {
          label = 'بيع وصيانة';
          color = 'bg-purple-50 text-purple-700 border-purple-100';
        }
        return (
          <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${color}`}>
            {label}
          </span>
        );
      },
    },
    {
      header: 'الكمية',
      cell: (row: ProductResponse) => (
        <span className="text-base font-bold text-gray-800">{row.totalQuantity}</span>
      ),
    },
    {
      header: 'الدفعات',
      cell: (row: ProductResponse) => (
        <div className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md border border-indigo-100 w-fit">
          <Package size={14} />
          <span className="text-sm font-bold">{row.batches?.length || 0}</span>
        </div>
      ),
    },
    {
      header: 'موقع التخزين',
      cell: (row: ProductResponse) => (
        <span className="text-sm font-semibold text-gray-700">{row.storageLocation || '---'}</span>
      ),
    },
    {
      header: 'حالة المخزون',
      cell: (row: ProductResponse) => (
        <ProductStatusBadge quantity={row.totalQuantity} reorderLevel={row.minQuantityAlert} />
      ),
    },
    {
      header: 'الإجراءات',
      cell: (row: ProductResponse) => (
        <div className="flex justify-center gap-3 text-gray-400">
          <HasPermission permission={Permissions.InventoryWrite}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(row);
              }}
              className="hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"
              title="حذف"
              aria-label="حذف المنتج"
            >
              <Trash2 size={18} />
            </button>
          </HasPermission>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data?.items || []}
      isLoading={isLoading}
      pageIndex={data?.pageNumber || pageIndex}
      totalPages={data?.totalPages || 1}
      totalCount={data?.totalCount || 0}
      pageSize={10}
      onNextPage={onNextPage}
      onPrevPage={onPrevPage}
      onRowClick={onRowClick}
    />
  );
}
