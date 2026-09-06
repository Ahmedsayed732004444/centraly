import { formatCurrency } from '@/shared/utils/currency';
import { formatDate } from '@/shared/utils/date';
import { ExpenseResponse } from '../schemas/financeSchemas';
interface ExpensesTableProps {
  expenses: ExpenseResponse[] | any;
}
export function ExpensesTable({ expenses }: ExpensesTableProps) {
  const expenseList = Array.isArray(expenses) ? expenses : (expenses?.items || []);
  if (!expenseList || expenseList.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-gray-100 px-4">
        <p className="text-gray-500">لا توجد مصروفات مسجلة في هذا السجل حتى الآن.</p>
      </div>
    );
  }
  const getPaymentSourceLabel = (source: string | number) => {
    if (source === '1' || source === 1 || source === 'Drawer') return 'الدرج (درج المبيعات)';
    if (source === '2' || source === 2 || source === 'Safe') return 'الخزينة (الخزينة الرئيسية)';
    return source;
  };
  return (
    <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 -webkit-overflow-scrolling-touch">
      <table className="w-full min-w-[720px] text-right border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-4 py-3 text-sm font-semibold text-gray-600 whitespace-nowrap">تاريخ المصروف</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600 whitespace-nowrap">بند المصروف</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600 whitespace-nowrap">المبلغ</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600 whitespace-nowrap">مصدر الدفع</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">البيان / الملاحظات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {expenseList.map((expense: ExpenseResponse) => (
            <tr key={expense.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap" dir="ltr">
                {formatDate(expense.expenseDate)}
              </td>
              <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">
                {expense.categoryName}
              </td>
              <td className="px-4 py-3 font-bold text-red-600 whitespace-nowrap" dir="ltr">
                - {formatCurrency(expense.amount)}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                  {getPaymentSourceLabel(expense.paymentSource)}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-500 max-w-[220px] truncate" title={expense.notes || '-'}>
                {expense.notes || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}