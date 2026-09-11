import { useState, useEffect } from 'react';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { useSalesInvoices } from '../hooks/useSales';
import { DataTable } from '@/shared/components/ui/DataTable';
import { InvoiceDetailsModal } from '../components/InvoiceDetailsModal';
import { getSalesHistoryColumns } from '../components/SalesHistoryColumns';
import { SalesHistorySearchBar } from '../components/SalesHistorySearchBar';
import { useNavigate } from 'react-router-dom';
import { printThermalReceipt } from '../utils/thermalReceiptPrint';
import { salesRepository } from '../api/salesApi';
import { toast } from 'sonner';

export function SalesHistoryPage() {
  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 10;
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearch = useDebounce(searchValue, 500);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    setPageIndex(1);
  }, [debouncedSearch]);
  const { data, isLoading } = useSalesInvoices({
    pageNumber: pageIndex,
    pageSize,
    searchValue: debouncedSearch,
  });
  const columns = getSalesHistoryColumns(
    (invoiceNumber) => {
      navigate(`/sales/returns/new?invoiceId=${invoiceNumber}`);
    },
    async (invoice) => {
      try {
        const toastId = toast.loading('جاري تحضير الفاتورة للطباعة...');
        const fullInvoice = await salesRepository.getInvoice(invoice.id);
        toast.dismiss(toastId);
        printThermalReceipt(fullInvoice);
      } catch (error) {
        toast.dismiss();
        toast.error('حدث خطأ أثناء جلب تفاصيل الفاتورة');
      }
    }
  );
  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-500">
      {}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {}
        <SalesHistorySearchBar
          searchValue={searchValue}
          onSearchChange={setSearchValue}
        />
        {}
        <div className="p-3 sm:p-5 overflow-x-auto">
          <DataTable
            columns={columns}
            data={data?.items || []}
            isLoading={isLoading}
            totalCount={data?.totalCount || 0}
            pageSize={pageSize}
            pageIndex={pageIndex}
            totalPages={data?.totalPages || 1}
            onNextPage={() => setPageIndex(p => Math.min(p + 1, data?.totalPages || 1))}
            onPrevPage={() => setPageIndex(p => Math.max(p - 1, 1))}
            onRowClick={(row) => setSelectedInvoiceId(row.id)}
          />
        </div>
      </div>
      {}
      <InvoiceDetailsModal
        isOpen={!!selectedInvoiceId}
        onClose={() => setSelectedInvoiceId(null)}
        invoiceId={selectedInvoiceId}
      />
    </div>
  );
}