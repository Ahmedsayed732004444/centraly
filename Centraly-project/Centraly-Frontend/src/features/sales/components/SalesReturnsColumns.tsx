import { formatCurrency } from '@/shared/utils/currency';
import { formatDate } from '@/shared/utils/date';
import { ReturnReason, SalesReturnResponse } from '../schemas/salesSchemas';

const getReasonLabel = (reason: ReturnReason) => {
  switch (reason) {
    case ReturnReason.Defect: return 'تالف / عيب صناعة';
    case ReturnReason.ChangedMind: return 'تغيير رأي العميل';
    case ReturnReason.Other: return 'أخرى';
    default: return 'غير معروف';
  }
};

export const getSalesReturnsColumns = () => [
  {
    header: 'تاريخ المرتجع',
    cell: (row: SalesReturnResponse) => formatDate(row.returnDate),
  },
  {
    header: 'رقم الفاتورة الأصلية',
    cell: (row: SalesReturnResponse) => row.invoiceNumber || row.invoiceId?.substring(0, 8) || '-',
  },
  {
    header: 'السبب',
    cell: (row: SalesReturnResponse) => getReasonLabel(row.reason),
  },
  {
    header: 'طريقة الاسترداد',
    cell: (row: SalesReturnResponse) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.isCashRefund ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}`}>
        {row.isCashRefund ? 'نقدي (كاش)' : 'خصم من المديونية'}
      </span>
    ),
  },
  {
    header: 'إجمالي المرتجع',
    cell: (row: SalesReturnResponse) => (
      <span className="font-bold text-red-600">
        {formatCurrency(row.totalReturnedAmount)}
      </span>
    ),
  }
];
