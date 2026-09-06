import { formatCurrency } from '@/shared/utils/currency';
import { formatDate } from '@/shared/utils/date';
import { SafeTransactionResponse } from '../schemas/financeSchemas';
interface SafeTransactionsTableProps {
  transactions: SafeTransactionResponse[] | any;
}
export function SafeTransactionsTable({ transactions }: SafeTransactionsTableProps) {
  const txList = Array.isArray(transactions) ? transactions : (transactions?.items || []);
  if (!txList || txList.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-gray-100 px-4">
        <p className="text-gray-500">لا توجد حركات مسجلة في هذه الخزينة حتى الآن.</p>
      </div>
    );
  }
  return (
    <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 -webkit-overflow-scrolling-touch">
      <table className="w-full min-w-[820px] text-right border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-4 py-3 text-sm font-semibold text-gray-600 whitespace-nowrap">التاريخ</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600 whitespace-nowrap">النوع</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600 whitespace-nowrap">التصنيف</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600 whitespace-nowrap">المبلغ</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600 whitespace-nowrap">الرصيد بعد الحركة</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">ملاحظات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {txList.map((tx: SafeTransactionResponse) => {
            const isIncome = tx.transactionType === 'Income' || tx.amount > 0;
            return (
              <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap" dir="ltr">
                  {formatDate(tx.createdAt)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${isIncome ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {tx.transactionType === 'Income' ? 'إيداع' : (tx.transactionType === 'Withdrawal' ? 'سحب' : tx.transactionType)}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                  {tx.category || '-'}
                </td>
                <td className="px-4 py-3 font-semibold text-gray-800 whitespace-nowrap" dir="ltr">
                  <span className={isIncome ? 'text-green-600' : 'text-red-600'}>
                    {isIncome ? '+' : '-'} {formatCurrency(Math.abs(tx.amount))}
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold text-gray-800 whitespace-nowrap" dir="ltr">
                  {formatCurrency(tx.balanceAfter)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500 max-w-[220px] truncate" title={tx.notes || '-'}>
                  {tx.notes || '-'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}