import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDrawerHistory } from '../hooks/useFinance';
import { FinanceFilters } from '../schemas/financeSchemas';
import { PageLoader } from '@/shared/components/ui/PageLoader';
import { DataTable } from '@/shared/components/ui/DataTable';
import { getDrawerHistoryColumns } from '../components/DrawerHistoryColumns';
import { DrawerHistoryHeader } from '../components/DrawerHistoryHeader';
import { useAuth } from '@/features/auth/hooks/useAuth';

export function DrawerHistoryPage() {
  const { hasRole, hasAnyRole } = useAuth();
  
  const isTechnician = hasRole('Technician');
  const canSeeBoth = hasAnyRole(['Admin', 'Manager']);
  const isSalesperson = hasRole('Salesperson');

  const [filters, setFilters] = useState<FinanceFilters>({ 
    pageNumber: 1, 
    pageSize: 50,
    type: isTechnician && !canSeeBoth ? 2 : (isSalesperson && !canSeeBoth ? 1 : undefined)
  });
  
  const navigate = useNavigate();
  const { data: pagedData, isLoading } = useDrawerHistory(filters);

  if (isLoading) {
    return <PageLoader />;
  }

  const sessions = pagedData?.items || [];

  return (
    <div className="space-y-6">
      <DrawerHistoryHeader
        canSeeBoth={canSeeBoth}
        currentType={filters.type}
        onTypeChange={(type) => setFilters(prev => ({ ...prev, type, pageNumber: 1 }))}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <DataTable
          data={sessions}
          columns={getDrawerHistoryColumns()}
          isLoading={isLoading}
          totalCount={pagedData?.totalCount || 0}
          pageSize={filters.pageSize || 50}
          pageIndex={filters.pageNumber || 1}
          totalPages={pagedData?.totalPages || 1}
          onNextPage={() => setFilters(prev => ({ ...prev, pageNumber: (prev.pageNumber || 1) + 1 }))}
          onPrevPage={() => setFilters(prev => ({ ...prev, pageNumber: Math.max((prev.pageNumber || 1) - 1, 1) }))}
          onRowClick={(row: any) => navigate(`/finance/drawer/history/${row.id}`)}
        />
      </div>
    </div>
  );
}
