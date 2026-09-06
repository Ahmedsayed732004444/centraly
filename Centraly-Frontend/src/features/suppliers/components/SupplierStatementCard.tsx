import { formatCurrency } from '@/shared/utils/currency';
import { tokens } from '@/shared/styles/tokens';
import { SupplierStatementItemResponse } from '../schemas/supplierSchemas';
interface SupplierStatementCardProps {
  statement?: SupplierStatementItemResponse[];
  isLoading: boolean;
}
const translateTxType = (type: string) => {
  const map: Record<string, string> = {
    'PurchaseInvoice': 'فاتورة مشتريات (استلام بضاعة)',
    'InvoicePayment': 'سداد من فاتورة',
    'Payment': 'دفعة نقدية (سند صرف للمورد)',
    'Return': 'مرتجع مشتريات (ترجيع بضاعة)',
    'OpeningBalance': 'رصيد افتتاحي',
  };
  return map[type] || type;
};
export function SupplierStatementCard({ statement, isLoading }: SupplierStatementCardProps) {
  return (
    <div className={`${tokens.card} bg-white overflow-hidden`}>
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-800">كشف الحساب (حركة المورد)</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-right">
          <thead className="bg-gray-50/50 text-gray-500 font-medium">
            <tr>
              <th className="px-4 py-3 whitespace-nowrap">تاريخ الحركة</th>
              <th className="px-4 py-3 whitespace-nowrap">البيان (نوع الحركة)</th>
              <th className="px-4 py-3 whitespace-nowrap">خصم من حسابه (دفعنا له)</th>
              <th className="px-4 py-3 whitespace-nowrap">أضيف لحسابه (اشترينا منه)</th>
              <th className="px-4 py-3 whitespace-nowrap">صافي الحساب (بعد الحركة)</th>
              <th className="px-4 py-3 whitespace-nowrap">ملاحظات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  جاري تحميل كشف الحساب...
                </td>
              </tr>
            ) : statement && statement.length > 0 ? (
              statement.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap" dir="ltr">
                    {new Intl.DateTimeFormat('ar-EG', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(item.date))}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-semibold">
                      {translateTxType(item.transactionType)}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-bold text-red-600 whitespace-nowrap">
                    {item.debit > 0 ? formatCurrency(item.debit) : '-'}
                  </td>
                  <td className="px-4 py-3 font-bold text-green-600 whitespace-nowrap">
                    {item.credit > 0 ? formatCurrency(item.credit) : '-'}
                  </td>
                  <td className="px-4 py-3 font-bold whitespace-nowrap" dir="ltr">
                    {formatCurrency(item.balanceAfter)}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 max-w-[220px] break-words">{item.notes || '---'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  لا توجد حركات مسجلة لهذا المورد حتى الآن.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}