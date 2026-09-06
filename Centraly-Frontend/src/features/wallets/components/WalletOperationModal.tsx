import { X, CreditCard, Banknote } from 'lucide-react';
import { tokens } from '@/shared/styles/tokens';
import { WalletResponse, WalletOperationType } from '../schemas/walletSchemas';
interface WalletOperationModalProps {
  isOpen: boolean;
  selectedWallet: WalletResponse | null;
  operationType: WalletOperationType;
  profit: number;
  form: any;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  isProcessing: boolean;
}
export function WalletOperationModal({
  isOpen,
  selectedWallet,
  operationType,
  profit,
  form,
  onSubmit,
  onClose,
  isProcessing
}: WalletOperationModalProps) {
  if (!isOpen || !selectedWallet) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto overflow-x-hidden animate-in fade-in zoom-in-95 duration-200"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="p-4 text-white flex justify-between items-center gap-3 bg-[#0f8e4c]">
          <h2 className="text-base sm:text-lg font-bold flex items-center gap-2 min-w-0">
            {operationType === WalletOperationType.CashIn ? <CreditCard size={20} className="shrink-0" /> : <Banknote size={20} className="shrink-0" />}
            <span className="truncate">
              {operationType === WalletOperationType.CashIn ? 'عملية إيداع' : 'عملية سحب'} - {selectedWallet.name}
            </span>
          </h2>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10 shrink-0">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-5 space-y-5">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                {operationType === WalletOperationType.CashIn ? 'هتحول كام للمحفظة؟ *' : 'الزبون حولك كام؟ *'}
              </label>
              <input
                type="number"
                step="0.01"
                {...form.register('transferredAmount')}
                onFocus={(e) => e.target.select()}
                className={tokens.input + " h-12 text-xl font-mono text-center focus:ring-[#0f8e4c] focus:border-[#0f8e4c] bg-gray-50"}
                placeholder="0.00"
              />
              {form.formState?.errors?.transferredAmount && (
                <p className="text-red-500 text-xs mt-1 text-center">{form.formState.errors.transferredAmount.message}</p>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                {operationType === WalletOperationType.CashIn ? 'أخدت كاش كام من الزبون؟ *' : 'هتدي للزبون كاش كام؟ *'}
              </label>
              <input
                type="number"
                step="0.01"
                {...form.register('physicalCashAmount')}
                onFocus={(e) => e.target.select()}
                className={tokens.input + " h-12 text-xl font-mono text-center focus:ring-[#0f8e4c] focus:border-[#0f8e4c] bg-gray-50"}
                placeholder="0.00"
              />
              {form.formState?.errors?.physicalCashAmount && (
                <p className="text-red-500 text-xs mt-1 text-center">{form.formState.errors.physicalCashAmount.message}</p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">رقم الموبايل / ملاحظات (اختياري)</label>
            <input
              {...form.register('notes')}
              className={tokens.input + " h-10 focus:ring-[#0f8e4c] focus:border-[#0f8e4c]"}
              placeholder="ملاحظات..."
            />
          </div>
          <div className={`p-3 rounded-xl border flex justify-between items-center gap-2 ${profit > 0 ? 'bg-[#e6f4ed] border-[#0f8e4c]/30 text-[#0f8e4c]' : profit < 0 ? 'bg-red-50 border-red-200 text-red-800' : 'bg-gray-50 border-gray-200 text-gray-800'}`}>
            <span className="font-bold text-sm shrink-0">صافي الربح:</span>
            <span className="text-xl font-black font-mono dir-ltr break-all text-right">{profit > 0 ? '+' : ''}{profit.toFixed(2)}</span>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors text-sm"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className={`flex-[2] px-4 py-3 text-white rounded-xl font-bold transition-colors disabled:opacity-60 text-sm bg-[#0f8e4c] hover:bg-[#0c7a40]`}
            >
              {isProcessing ? 'جاري التنفيذ...' : 'تأكيد العملية'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}