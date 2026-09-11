import { CustomerResponse } from '../schemas/contactSchemas';
import { PaginatedList } from '@/shared/types/pagination';
import { DataTable } from '@/shared/components/ui/DataTable';
import { formatCurrency } from '@/shared/utils/currency';
import { Edit2, Trash2, Eye } from 'lucide-react';
import { HasPermission } from '@/features/auth/components/HasPermission';
import { Permissions } from '@/features/auth/schemas/permissions';
interface CustomersTableProps {
  data?: PaginatedList<CustomerResponse>;
  isLoading: boolean;
  pageIndex: number;
  onNextPage: () => void;
  onPrevPage: () => void;
  onEdit: (customer: CustomerResponse) => void;
  onDelete: (customer: CustomerResponse) => void;
  onRowClick: (customer: CustomerResponse) => void;
}
export function CustomersTable({
  data,
  isLoading,
  pageIndex,
  onNextPage,
  onPrevPage,
  onEdit,
  onDelete,
  onRowClick
}: CustomersTableProps) {
  const columns = [
    {
      header: 'اسم العميل',
      cell: (row: CustomerResponse) => (
        <span className="font-bold text-gray-800">{row.name}</span>
      ),
    },
    {
      header: 'رقم الهاتف',
      cell: (row: CustomerResponse) => row.phone || <span className="text-gray-400">-</span>,
    },
    {
      header: 'المديونية (الرصيد)',
      cell: (row: CustomerResponse) => {
        const balance = row.debtBalance || 0;
        if (balance === 0) return <span className="text-gray-500 font-medium">0 ج.م</span>;
        if (balance > 0) return <span className="text-red-600 font-bold" dir="ltr">{formatCurrency(balance)}</span>;
        return <span className="text-green-600 font-bold" dir="ltr">{formatCurrency(Math.abs(balance))} (مقدم)</span>;
      },
    },
    {
      header: 'تاريخ الإضافة',
      cell: (row: CustomerResponse) => new Date(row.createdAt).toLocaleDateString('ar-EG'),
    },
    {
      header: 'إجراءات',
      cell: (row: CustomerResponse) => (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => onRowClick(row)}
            className="p-2.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
            title="كشف حساب / التفاصيل"
            aria-label="تفاصيل العميل"
          >
            <Eye size={18} />
          </button>
          <HasPermission permission={Permissions.CustomersWrite}>
            <button
              type="button"
              onClick={() => onEdit(row)}
              className="p-2.5 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
              title="تعديل"
              aria-label="تعديل العميل"
            >
              <Edit2 size={18} />
            </button>
            <button
              type="button"
              onClick={() => onDelete(row)}
              className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="حذف"
              aria-label="حذف العميل"
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
      pageIndex={pageIndex}
      totalPages={data?.totalPages || 1}
      totalCount={data?.totalCount || 0}
      pageSize={data?.pageSize || 10}
      onNextPage={onNextPage}
      onPrevPage={onPrevPage}
      onRowClick={onRowClick}
    />
  );
}