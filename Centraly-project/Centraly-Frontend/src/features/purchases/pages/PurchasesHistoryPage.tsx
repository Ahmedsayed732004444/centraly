import { toUtcStartOfDayISOString, toUtcEndOfDayISOString } from '@/shared/utils/date';
import { useState } from 'react';
import { usePurchases } from '../hooks/usePurchases';
import { PurchasesTable } from '../components/PurchasesTable';
import { PurchasesFilters } from '../components/PurchasesFilters';
import { tokens } from '@/shared/styles/tokens';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

export function PurchasesHistoryPage() {
  const navigate = useNavigate();
  const [pageIndex, setPageIndex] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { data, isLoading } = usePurchases({
    pageNumber: pageIndex,
    pageSize: 10,
    searchValue: searchTerm || undefined,
    supplierId: supplierId || undefined,
    startDate: startDate ? toUtcStartOfDayISOString(startDate) : undefined,
    endDate: endDate ? toUtcEndOfDayISOString(endDate) : undefined,
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-end items-center">
        <button 
          onClick={() => navigate('/purchases/new')}
          className={`${tokens.btn.primary} flex items-center gap-2`}
        >
          <Plus size={18} />
          <span>فاتورة مشتريات جديدة</span>
        </button>
      </div>

      <PurchasesFilters 
        onSearch={(t) => { setSearchTerm(t); setPageIndex(1); }}
        onSupplierChange={(s) => { setSupplierId(s); setPageIndex(1); }}
        onDateChange={(start, end) => { setStartDate(start); setEndDate(end); setPageIndex(1); }}
      />

      <PurchasesTable
        data={data}
        isLoading={isLoading}
        pageIndex={pageIndex}
        onNextPage={() => setPageIndex(p => p + 1)}
        onPrevPage={() => setPageIndex(p => p - 1)}
        onRowClick={(invoice) => {
          navigate(`/purchases/${invoice.purchaseInvoiceId}`);
        }}
      />
    </div>
  );
}
