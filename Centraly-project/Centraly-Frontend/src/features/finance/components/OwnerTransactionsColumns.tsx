import { formatCurrency } from '@/shared/utils/currency';
import { formatDate } from '@/shared/utils/date';
import { OwnerTransactionResponse } from '../schemas/financeSchemas';

export const getOwnerTransactionsColumns = () => [
  {
    header: 'النوع',
    cell: (row: OwnerTransactionResponse) => (
      <span className={row.category === 10 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
        {row.category === 10 ? 'إيداع رأس مال' : 'سحب أرباح'}
      </span>
    ),
  },
  {
    header: 'المبلغ',
    cell: (row: OwnerTransactionResponse) => (
      <span dir="ltr" className="font-semibold text-gray-800 inline-block">
        {formatCurrency(row.amount)}
      </span>
    ),
  },
  {
    header: 'المصدر',
    cell: (row: OwnerTransactionResponse) => (
      <span className="text-gray-600 text-sm">
        {row.paymentSource === 1 ? 'الدرج' : 'الخزينة'}
      </span>
    ),
  },
  {
    header: 'التاريخ',
    cell: (row: OwnerTransactionResponse) => (
      <span className="text-gray-600 text-sm">
        {formatDate(row.createdAt)}
      </span>
    ),
  },
  {
    header: 'ملاحظات',
    cell: (row: OwnerTransactionResponse) => (
      <span className="text-gray-500 text-sm">
        {row.notes || '-'}
      </span>
    ),
  },
];
