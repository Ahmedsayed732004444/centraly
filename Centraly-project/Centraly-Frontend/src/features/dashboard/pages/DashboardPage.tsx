import { Link } from 'react-router-dom';
import { Wallet, PackageX, PackageMinus, Wrench, ArrowLeft } from 'lucide-react';
import { useActiveDrawer } from '@/features/finance/hooks/useFinance';
import { useProducts } from '@/features/inventory/hooks/useInventory';
import { useMaintenanceList } from '@/features/maintenance/api/queries';
import { formatCurrency } from '@/shared/utils/currency';

interface WidgetCardProps {
  to: string;
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  children: React.ReactNode;
  linkLabel: string;
}

function WidgetCard({ to, icon, iconBg, title, children, linkLabel }: WidgetCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>{icon}</div>
        <h3 className="font-bold text-gray-800">{title}</h3>
      </div>
      <div className="flex-1">{children}</div>
      <Link
        to={to}
        className="mt-4 flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
      >
        {linkLabel} <ArrowLeft className="w-4 h-4" />
      </Link>
    </div>
  );
}

// Every role defined in this app (Admin/Manager/Salesperson/Technician) already has
// route access to /finance/drawer, /inventory/products and /maintenance (see App.tsx),
// so these four widgets don't need their own permission gating - they mirror what the
// sidebar already shows each role.
export function DashboardPage() {
  const { data: activeDrawer, isError: drawerError } = useActiveDrawer(1);
  const { data: lowStock } = useProducts({ pageNumber: 1, pageSize: 5, stockStatus: 'LowStock' });
  const { data: outOfStock } = useProducts({ pageNumber: 1, pageSize: 1, stockStatus: 'OutOfStock' });
  const { data: pendingMaintenance } = useMaintenanceList({ pageNumber: 1, pageSize: 50, status: 'Pending' });

  const currentBalance = activeDrawer
    ? activeDrawer.transactions[0]?.balance ?? activeDrawer.openingBalance
    : null;

  const overdueTickets = (pendingMaintenance?.items ?? []).filter(
    (t) => t.deliveryDate && new Date(t.deliveryDate) < new Date()
  );

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 sm:px-6 py-4">
        <h1 className="text-lg sm:text-xl font-bold text-gray-800">لوحة القيادة</h1>
        <p className="text-sm text-gray-400 mt-0.5">نظرة سريعة على أهم ما يحتاج انتباهك الآن</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <WidgetCard
          to="/finance/drawer"
          icon={<Wallet className="w-5 h-5 text-blue-600" />}
          iconBg="bg-blue-50"
          title="رصيد الدرج الحالي"
          linkLabel="فتح الدرج"
        >
          {drawerError || !activeDrawer ? (
            <p className="text-sm text-gray-400">لا توجد وردية مفتوحة حالياً</p>
          ) : (
            <p className="text-2xl font-black text-gray-800" dir="ltr">{formatCurrency(currentBalance ?? 0)}</p>
          )}
        </WidgetCard>

        <WidgetCard
          to="/inventory/products"
          icon={<PackageX className="w-5 h-5 text-red-600" />}
          iconBg="bg-red-50"
          title="منتجات نفدت من المخزون"
          linkLabel="عرض المنتجات"
        >
          <p className="text-2xl font-black text-gray-800">{outOfStock?.totalCount ?? 0}</p>
          <p className="text-xs text-gray-400 mt-1">منتج يحتاج إعادة توريد فوراً</p>
        </WidgetCard>

        <WidgetCard
          to="/inventory/products"
          icon={<PackageMinus className="w-5 h-5 text-amber-600" />}
          iconBg="bg-amber-50"
          title="اقترب نفاده من المخزون"
          linkLabel="عرض المنتجات"
        >
          <p className="text-2xl font-black text-gray-800">{lowStock?.totalCount ?? 0}</p>
          {lowStock && lowStock.items.length > 0 && (
            <p className="text-xs text-gray-400 mt-1 truncate">
              منها: {lowStock.items.slice(0, 3).map((p) => p.name).join('، ')}
            </p>
          )}
        </WidgetCard>

        <WidgetCard
          to="/maintenance"
          icon={<Wrench className="w-5 h-5 text-orange-600" />}
          iconBg="bg-orange-50"
          title="تذاكر صيانة تجاوزت الموعد"
          linkLabel="عرض التذاكر"
        >
          <p className="text-2xl font-black text-gray-800">{overdueTickets.length}</p>
          {overdueTickets.length > 0 && (
            <p className="text-xs text-gray-400 mt-1 truncate">
              منها: {overdueTickets.slice(0, 3).map((t) => t.customerName).join('، ')}
            </p>
          )}
        </WidgetCard>
      </div>
    </div>
  );
}
