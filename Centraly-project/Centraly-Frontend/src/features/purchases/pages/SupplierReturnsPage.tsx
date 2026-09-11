import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHeaderStore } from '@/shared/hooks/useHeaderStore';
import { useSupplierReturns } from '../hooks/useSupplierReturns';
import { SupplierReturnsFilters } from '../components/SupplierReturnsFilters';
import { SupplierReturnsTable } from '../components/SupplierReturnsTable';

export function SupplierReturnsPage() {
  const [pageIndex, setPageIndex] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  
  const navigate = useNavigate();
  const { setTitle, setBackButton } = useHeaderStore();

  useEffect(() => {
    setTitle('مرتجعات الموردين');
    setBackButton(false);
  }, [setTitle, setBackButton]);

  const { data, isLoading } = useSupplierReturns({
    pageNumber: pageIndex,
    pageSize: 10,
    searchValue: searchTerm || undefined,
  });

  return (
    <div className="space-y-4 w-full">
      <SupplierReturnsFilters
        onSearch={(val) => { setSearchTerm(val); setPageIndex(1); }}
        onNewReturn={() => navigate('/purchases/returns/new')}
      />

      <SupplierReturnsTable
        data={data?.items || []}
        isLoading={isLoading}
        pageIndex={data?.pageNumber || 1}
        totalPages={data?.totalPages || 1}
        totalCount={data?.totalCount || 0}
        pageSize={data?.pageSize || 10}
        onNextPage={() => setPageIndex((p) => p + 1)}
        onPrevPage={() => setPageIndex((p) => p - 1)}
        onRowClick={(row) => navigate(`/purchases/returns/${row.supplierReturnId}`)}
      />
    </div>
  );
}
