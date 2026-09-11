import { Printer, CheckCircle, Clock } from 'lucide-react';
import { tokens } from '@/shared/styles/tokens';
interface PurchaseInvoiceHeaderProps {
  invoiceDate: string;
  isPaid: boolean;
  onPrint: () => void;
}
export function PurchaseInvoiceHeader({ invoiceDate, isPaid, onPrint }: PurchaseInvoiceHeaderProps) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-3">
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-gray-500 text-sm">
          {new Intl.DateTimeFormat('ar-EG', { dateStyle: 'full', timeStyle: 'short' }).format(new Date(invoiceDate))}
        </span>
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${
          isPaid ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
        }`}>
          {isPaid
            ? <><CheckCircle size={13} /> مدفوعة بالكامل</>
            : <><Clock size={13} /> متبقي دفع</>
          }
        </span>
      </div>
      <button
        className={`${tokens.btn.secondary} flex items-center gap-2`}
        onClick={onPrint}
      >
        <Printer size={16} />
        <span>طباعة</span>
      </button>
    </div>
  );
}