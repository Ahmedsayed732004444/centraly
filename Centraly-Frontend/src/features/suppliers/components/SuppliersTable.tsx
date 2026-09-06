import { formatCurrency } from '@/shared/utils/currency';
import { Trash2, Edit, CreditCard } from 'lucide-react';
import { DataTable } from '@/shared/components/ui/DataTable';
import { SupplierResponse } from '../schemas/supplierSchemas';
import { PaginatedList } from '@/shared/types/pagination';
import { HasPermission } from '@/features/auth/components/HasPermission';
import { Permissions } from '@/features/auth/schemas/permissions';
interface SuppliersTableProps {
  data?: PaginatedList<SupplierResponse>;
  isLoading: boolean;
  pageIndex: number;
  onNextPage: () => void;
  onPrevPage: () => void;
  onEdit?: (supplier: SupplierResponse) => void;
  onDelete?: (supplier: SupplierResponse) => void;
  onPay?: (supplier: SupplierResponse) => void;
  onRowClick?: (supplier: SupplierResponse) => void;
}
export function SuppliersTable({
  data,
  isLoading,
  pageIndex,
  onNextPage,
  onPrevPage,
  onEdit,
  onDelete,
  onPay,
  onRowClick,
}: SuppliersTableProps) {
  const columns = [
    {
      header: 'اسم المورد',
      cell: (row: SupplierResponse) => (
        <span className="text-base font-bold text-gray-900 whitespace-nowrap">{row.name}</span>
      ),
    },
    {
      header: 'الهاتف',
      cell: (row: SupplierResponse) => (
        <span className="text-sm font-semibold text-gray-600 font-mono bg-gray-50 px-2 py-1 rounded border border-gray-100 whitespace-nowrap" dir="ltr">
          {row.phone || '---'}
        </span>
      ),
    },
    {
      header: 'الرصيد المستحق',
      cell: (row: SupplierResponse) => (
        <div className="flex flex-wrap items-center gap-2">
          <span className={`text-base font-bold whitespace-nowrap ${row.debtBalance > 0 ? 'text-green-600' : row.debtBalance < 0 ? 'text-red-600' : 'text-gray-900'}`}>
            {formatCurrency(row.debtBalance)}
          </span>
          {row.debtBalance !== 0 && onPay && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPay(row);
              }}
              className={`text-xs px-2 py-1 rounded flex items-center gap-1 border transition-colors whitespace-nowrap ${
                row.debtBalance > 0
                  ? 'bg-green-50 text-green-700 hover:bg-green-100 border-green-200'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200'
              }`}
              title={row.debtBalance > 0 ? "تسديد دفعة" : "استلام دفعة"}
            >
              <CreditCard size={14} />
              {row.debtBalance > 0 ? 'تسديد' : 'استلام'}
            </button>
          )}
        </div>
      ),
    },
    {
      header: 'عدد الفواتير',
      cell: (row: SupplierResponse) => (
        <span className="text-sm font-bold text-gray-800">{row.purchaseInvoicesCount}</span>
      ),
    },
    {
      header: 'عدد المرتجعات',
      cell: (row: SupplierResponse) => (
        <span className="text-sm font-bold text-gray-800">{row.returnsCount}</span>
      ),
    },
    {
      header: 'الإجراءات',
      cell: (row: SupplierResponse) => (
        <div className="flex justify-center gap-1 text-gray-400">
          <HasPermission permission={Permissions.SuppliersWrite}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(row);
              }}
              className="hover:text-blue-500 transition-colors p-2.5 rounded-lg hover:bg-blue-50"
              title="تعديل"
              aria-label="تعديل المورد"
            >
              <Edit size={18} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(row);
              }}
              className="hover:text-red-500 transition-colors p-2.5 rounded-lg hover:bg-red-50"
              title="حذف"
              aria-label="حذف المورد"
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