import { Search } from 'lucide-react';
import { tokens } from '@/shared/styles/tokens';
interface SalesHistorySearchBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
}
export function SalesHistorySearchBar({ searchValue, onSearchChange }: SalesHistorySearchBarProps) {
  return (
    <div className="p-3 sm:p-5 border-b border-gray-100 bg-gray-50 flex items-center gap-4">
      <div className="relative w-full md:w-96">
        <input
          type="text"
          placeholder="ابحث برقم الفاتورة أو اسم العميل..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className={`${tokens.input} pl-10`}
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
      </div>
    </div>
  );
}