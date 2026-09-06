import { formatCurrency } from '@/shared/utils/currency';
import { formatDate } from '@/shared/utils/date';
import { CheckCircle } from 'lucide-react';

export const getDrawerHistoryColumns = () => [
  {
    header: 'النوع',
    cell: (item: any) => (
      <span className="font-semibold text-gray-700">
        {item.type === 1 ? 'مبيعات' : item.type === 2 ? 'صيانة' : 'غير محدد'}
      </span>
    )
  },
  {
    header: 'الحالة',
    cell: (item: any) => item.isClosed ? (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-700">
        <CheckCircle className="w-4 h-4" /> مغلقة
      </span>
    ) : (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-sm font-medium bg-green-100 text-green-700">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> جارية الآن
      </span>
    )
  },
  {
    header: 'وقت الفتح',
    cell: (item: any) => <span dir="ltr">{formatDate(item.openedAt)}</span>
  },
  {
    header: 'وقت الإغلاق',
    cell: (item: any) => item.closedAt ? <span dir="ltr">{formatDate(item.closedAt)}</span> : '-'
  },
  {
    header: 'الرصيد الافتتاحي',
    cell: (item: any) => <span dir="ltr" className="font-medium text-gray-700">{formatCurrency(item.openingBalance)}</span>
  },
  {
    header: 'إجمالي المبيعات/الداخل',
    cell: (item: any) => <span dir="ltr" className="font-semibold text-green-600">+{formatCurrency(item.totalIncome || 0)}</span>
  },
  {
    header: 'صافي أرباح الوردية',
    cell: (item: any) => <span dir="ltr" className="font-bold text-blue-600">{formatCurrency(item.totalProfit ?? 0)}</span>
  },
  {
    header: 'الرصيد النهائي للصندوق',
    cell: (item: any) => <span dir="ltr" className="font-bold text-blue-700">{formatCurrency(item.closingBalance || 0)}</span>
  }
];
