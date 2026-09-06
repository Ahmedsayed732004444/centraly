import { formatCurrency } from '@/shared/utils/currency';
import { formatDate } from '@/shared/utils/date';
import { DrawerTransactionResponse } from '../schemas/financeSchemas';
interface DrawerTransactionsTableProps {
  transactions: DrawerTransactionResponse[];
}
export function DrawerTransactionsTable({ transactions }: DrawerTransactionsTableProps) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-gray-100 px-4">
        <p className="text-gray-500">لا توجد حركات مسجلة في هذه الوردية حتى الآن.</p>
      </div>
    );
  }
  const getCategoryLabel = (category: number) => {
    switch (category) {
      case 1: return 'مبيعات';
      case 2: return 'موردين';
      case 3: return 'صيانة';
      case 4: return 'مرتجعات';
      case 5: return 'تسديد مديونية عميل';
      case 6: return 'حركة يدوية';
      case 7: return 'واردات (مشتريات)';
      case 8: return 'إرجاع لمورد';
      case 10: return 'عملية محفظة';
      default: return 'أخرى';
    }
  };
  return (
    <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 -webkit-overflow-scrolling-touch">
      <table className="w-full min-w-[720px] text-right border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-4 py-3 text-sm font-semibold text-gray-600 whitespace-nowrap">الوقت</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600 whitespace-nowrap">النوع</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600 whitespace-nowrap">المبلغ</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600 whitespace-nowrap">الرصيد بعد الحركة</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">المصدر / الملاحظات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {transactions.map((tx) => {
            const isIncome = tx.type === 1;
            return (
              <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap" dir="ltr">
                  {formatDate(tx.createdAt)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                    isIncome ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                  }`}>
                    {getCategoryLabel(tx.category)}
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold text-gray-800 whitespace-nowrap" dir="ltr">
                  <span className={isIncome ? 'text-green-600' : 'text-red-600'}>
                    {isIncome ? '+' : '-'} {formatCurrency(tx.amount)}
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold text-gray-800 whitespace-nowrap" dir="ltr">
                  {formatCurrency(tx.balance)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500 max-w-[220px] truncate" title={tx.notes || tx.source || '-'}>
                  {tx.notes || tx.source || '-'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}