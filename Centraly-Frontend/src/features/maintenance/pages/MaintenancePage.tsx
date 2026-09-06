import { useState } from 'react';
import { useMaintenanceList } from '../api/queries';
import { MaintenanceQuickCreateDrawer } from '../components/MaintenanceQuickCreateDrawer';
import { MaintenanceDetailDrawer } from '../components/MaintenanceDetailDrawer';
import { MaintenanceListTable } from '../components/MaintenanceListTable';
import { Wrench, Plus } from 'lucide-react';
export function MaintenancePage() {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchValue, setSearchValue] = useState<string>('');
  const [pageIndex, setPageIndex] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data, isLoading } = useMaintenanceList({
    pageNumber: pageIndex,
    pageSize: 10,
    status: statusFilter || undefined,
    searchValue: searchValue || undefined,
  });
  const tickets = data?.items || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = data?.totalPages || 1;
  const pageSize = data?.pageSize || 10;
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm px-4 sm:px-6 py-4">
        <div className="flex items-center gap-3 flex-wrap min-w-0">
          <Wrench className="w-6 h-6 text-blue-600 shrink-0" />
          <h1 className="text-lg sm:text-xl font-bold text-gray-800 truncate">الصيانة</h1>
          <span className="text-sm text-gray-400 whitespace-nowrap">({totalCount} تذكرة)</span>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          تذكرة جديدة
        </button>
      </div>
      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4 justify-between">
        <div className="flex bg-slate-100/70 p-1.5 rounded-xl w-full sm:w-fit overflow-x-auto">
          {(['', 'Pending', 'Delivered', 'Returned'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
                statusFilter === s
                  ? 'bg-white text-blue-700 shadow-sm border border-gray-200/60'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              {s === '' ? 'الكل' : s === 'Pending' ? 'قيد الانتظار' : s === 'Delivered' ? 'تم التسليم' : 'مرتجع'}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="بحث باسم العميل أو رقم الهاتف..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>
      {}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <MaintenanceListTable
          tickets={tickets}
          isLoading={isLoading}
          onRowClick={(id) => setSelectedId(id)}
          pageIndex={pageIndex}
          totalPages={totalPages}
          totalCount={totalCount}
          pageSize={pageSize}
          onNextPage={() => setPageIndex(p => p + 1)}
          onPrevPage={() => setPageIndex(p => p - 1)}
        />
      </div>
      {}
      <MaintenanceQuickCreateDrawer
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
      {}
      <MaintenanceDetailDrawer
        id={selectedId}
        onClose={() => setSelectedId(null)}
      />
    </div>
  );
}