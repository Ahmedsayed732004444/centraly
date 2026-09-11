import { ArrowDownLeft, ArrowUpRight, Calendar, ReceiptText } from 'lucide-react';
import { formatCurrency } from '@/shared/utils/currency';
import { CustomerStatementResponse } from '../schemas/contactSchemas';

export const getCustomerStatementColumns = () => [
  {
    header: 'التاريخ',
    cell: (row: CustomerStatementResponse) => (
      <div className="flex items-center gap-2 text-gray-600">
        <Calendar size={16} />
        {new Date(row.date).toLocaleDateString('ar-EG', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </div>
    ),
  },
  {
    header: 'نوع العملية',
    cell: (row: CustomerStatementResponse) => {
      const isInvoice = row.transactionType.includes('Invoice') || row.transactionType === 'فاتورة';
      const isPayment = row.transactionType.includes('Payment') || row.transactionType === 'دفعة';
      const isReturn = row.transactionType.includes('Return') || row.transactionType === 'مرتجع';
      
      if (isInvoice) return (
        <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 cursor-pointer hover:bg-orange-200 transition-colors">
          فاتورة مبيعات
          <ReceiptText size={12} className="opacity-70" />
        </span>
      );
      if (isPayment) return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold">سداد مديونية</span>;
      if (isReturn) return <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold">مرتجع مبيعات</span>;
      
      return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-bold">{row.transactionType}</span>;
    },
  },
  {
    header: 'البيان',
    cell: (row: CustomerStatementResponse) => (
      <span className="text-gray-600 max-w-[200px] truncate block" title={row.notes || '-'}>
        {row.notes || '-'}
      </span>
    ),
  },
  {
    header: 'مدين (عليه)',
    cell: (row: CustomerStatementResponse) => row.debit > 0 ? (
      <span className="text-red-600 font-bold flex items-center gap-1" dir="ltr">
        <ArrowUpRight size={16} /> {formatCurrency(row.debit)}
      </span>
    ) : <span className="text-gray-400">-</span>,
  },
  {
    header: 'دائن (له)',
    cell: (row: CustomerStatementResponse) => row.credit > 0 ? (
      <span className="text-green-600 font-bold flex items-center gap-1" dir="ltr">
        <ArrowDownLeft size={16} /> {formatCurrency(row.credit)}
      </span>
    ) : <span className="text-gray-400">-</span>,
  },
  {
    header: 'الرصيد بعد العملية',
    cell: (row: CustomerStatementResponse) => {
      if (row.balanceAfter === 0) return <span className="text-gray-500 font-bold">0 ج.م</span>;
      if (row.balanceAfter > 0) return <span className="text-red-600 font-bold" dir="ltr">{formatCurrency(row.balanceAfter)}</span>;
      return <span className="text-green-600 font-bold" dir="ltr">{formatCurrency(Math.abs(row.balanceAfter))} (مقدم)</span>;
    },
  }
];
