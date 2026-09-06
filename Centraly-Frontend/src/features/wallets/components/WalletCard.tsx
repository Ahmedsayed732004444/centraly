import { Wallet, Coins, ArrowUpFromLine, ArrowDownToLine } from 'lucide-react';
import { WalletResponse } from '../schemas/walletSchemas';

interface WalletCardProps {
  wallet: WalletResponse;
  onCashIn: (wallet: WalletResponse) => void;
  onCashOut: (wallet: WalletResponse) => void;
}

export function WalletCard({ wallet, onCashIn, onCashOut }: WalletCardProps) {
  return (
    <div 
      className="bg-white rounded-2xl border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all overflow-hidden flex flex-col p-4 sm:p-5 relative"
    >
      <div className="h-28 sm:h-36 flex items-center justify-center mb-3 mt-2">
        {wallet.imageUrl ? (
          <img src={wallet.imageUrl} alt={wallet.name} className="max-h-full max-w-full object-contain mix-blend-multiply" />
        ) : (
          <Wallet size={56} className="text-gray-200" />
        )}
      </div>
      
      <div className="flex flex-col flex-1 items-center text-center">
        <h3 className="font-bold text-gray-900 text-lg sm:text-xl mb-2 line-clamp-1 leading-snug">
          {wallet.name}
        </h3>
        <div className="bg-gray-50/80 px-4 py-2 rounded-xl mb-5 border border-gray-100 shadow-sm">
          <p className="text-[20px] sm:text-[22px] font-black text-[#0f8e4c] tracking-[0.15em]" dir="ltr">
            {wallet.phoneNumber}
          </p>
        </div>
        
        <div className="mt-auto mb-5 font-bold text-[16px] sm:text-[20px] text-[#0f8e4c] bg-[#e6f4ed] px-5 py-2 rounded-xl border border-[#0f8e4c]/20 flex items-center justify-center gap-2">
          <Coins size={22} className="text-[#0f8e4c]" />
          الرصيد: {Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(wallet.balance)}
        </div>

        <div className="w-full flex gap-2 sm:gap-3">
          <button 
            onClick={() => onCashOut(wallet)}
            className="flex-1 py-2 sm:py-3 rounded-xl text-sm sm:text-[15px] font-bold flex items-center justify-center gap-2 transition-all bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300 shadow-sm"
          >
            <ArrowUpFromLine size={18} />
            سحب
          </button>
          <button 
            onClick={() => onCashIn(wallet)}
            className="flex-1 py-2 sm:py-3 rounded-xl text-sm sm:text-[15px] font-bold flex items-center justify-center gap-2 transition-all bg-[#0f8e4c] hover:bg-[#0c7a40] text-white shadow-sm"
          >
            <ArrowDownToLine size={18} />
            إيداع
          </button>
        </div>
      </div>
    </div>
  );
}
