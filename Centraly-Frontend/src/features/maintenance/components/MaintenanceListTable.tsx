import { MaintenanceSummary } from '../schemas/maintenanceSchemas';
import { ChevronLeft, ChevronRight, Clock, User, Phone, Wrench, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
interface Props {
  tickets: MaintenanceSummary[];
  isLoading: boolean;
  onRowClick: (id: string) => void;
  pageIndex: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onNextPage: () => void;
  onPrevPage: () => void;
}
const statusConfig: Record<string, { label: string; color: string }> = {
  Pending: { label: 'قيد الانتظار', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  Delivered: { label: 'تم التسليم', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  Returned: { label: 'مرتجع', color: 'bg-slate-100 text-slate-800 border-slate-200' },
};
function formatDateInfo(dateStr?: string, status?: string) {
  if (!dateStr) {
    return {
      primary: 'غير محدد',
      secondary: '',
      color: 'text-slate-500',
      isUrgent: false,
    };
  }
  const d = new Date(dateStr);
  const now = new Date();
  const dayName = d.toLocaleDateString('ar-EG', { weekday: 'long' });
  const timeStr = d.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', hour12: true });
  const dayMonth = d.toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' });
  const fullSecondary = `${timeStr} · ${dayMonth}`;
  if (status !== 'Pending') {
    return {
      primary: dayName,
      secondary: fullSecondary,
      color: 'text-slate-500',
      isUrgent: false,
    };
  }
  const diffMs = d.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  const hoursLeft = Math.floor(Math.abs(diffHours));
  if (diffHours < 0) {
    const timeText = hoursLeft === 0 ? 'أقل من ساعة' : `${hoursLeft} ساعة`;
    return {
      primary: `${dayName} (متأخر بـ ${timeText})`,
      secondary: fullSecondary,
      color: 'text-red-600 font-bold',
      isUrgent: true,
    };
  } else if (diffHours <= 24) {
    const timeText = hoursLeft === 0 ? 'أقل من ساعة' : `${hoursLeft} ساعة`;
    const color = diffHours <= 3 ? 'text-amber-600 font-bold' : 'text-blue-600 font-bold';
    return {
      primary: `${dayName} (باقي ${timeText})`,
      secondary: fullSecondary,
      color,
      isUrgent: diffHours <= 3,
    };
  }
  return {
    primary: `${dayName} (باقي ${Math.floor(diffHours / 24)} يوم)`,
    secondary: fullSecondary,
    color: 'text-slate-700 font-semibold',
    isUrgent: false,
  };
}
export function MaintenanceListTable({
  tickets,
  isLoading,
  onRowClick,
  pageIndex,
  totalPages,
  totalCount,
  pageSize,
  onNextPage,
  onPrevPage
}: Props) {
  if (isLoading) {
    return (
      <div className="p-12 text-center text-slate-400">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-10 w-10 bg-slate-200 rounded-full mb-3"></div>
          <div className="text-lg">جاري التحميل...</div>
        </div>
      </div>
    );
  }
  if (tickets.length === 0) {
    return (
      <div className="p-8 sm:p-16 text-center flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-5">
          <Wrench className="w-10 h-10 text-slate-300" />
        </div>
        <h3 className="text-xl font-bold text-slate-700 mb-2">لا توجد تذاكر صيانة</h3>
        <p className="text-slate-400 text-base">لم يتم العثور على أي تذاكر مطابقة للفلتر الحالي.</p>
      </div>
    );
  }
  return (
    <div>
      {/* Desktop / tablet table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-right">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500">
              <th className="px-6 py-4 text-[14px] font-bold whitespace-nowrap">رقم / حالة</th>
              <th className="px-6 py-4 text-[14px] font-bold whitespace-nowrap">العميل</th>
              <th className="px-6 py-4 text-[14px] font-bold">الجهاز والمشكلة</th>
              <th className="px-6 py-4 text-[14px] font-bold whitespace-nowrap text-center">الماليات</th>
              <th className="px-6 py-4 text-[14px] font-bold whitespace-nowrap">موعد التسليم</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tickets.map((t) => {
              const cfg = statusConfig[t.status] ?? { label: t.status, color: 'bg-slate-100 text-slate-700' };
              const dateInfo = formatDateInfo(t.deliveryDate, t.status);
              return (
                <tr
                  key={t.id}
                  onClick={() => onRowClick(t.id)}
                  className={cn(
                    "hover:bg-blue-50/60 cursor-pointer transition-colors group",
                    dateInfo.isUrgent && "bg-red-50/40 hover:bg-red-50/80"
                  )}
                >
                  {}
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-2.5 items-start">
                      <span className="text-xs font-mono font-medium text-slate-400 bg-slate-100/80 px-2 py-1 rounded-md">
                        #{t.id.slice(0, 8)}
                      </span>
                      <span className={cn('px-3 py-1.5 rounded-lg text-sm font-bold border shadow-sm', cfg.color)}>
                        {cfg.label}
                      </span>
                    </div>
                  </td>
                  {}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-full bg-blue-100/80 text-blue-600 flex items-center justify-center shrink-0">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-extrabold text-slate-800 text-base">{t.customerName}</div>
                        {t.customerPhone && (
                          <div className="text-sm font-medium text-slate-500 flex items-center gap-1.5 mt-1">
                            <Phone className="w-3.5 h-3.5" />
                            <span className="dir-ltr">{t.customerPhone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  {}
                  <td className="px-6 py-5 max-w-[280px]">
                    <div className="font-extrabold text-slate-800 text-base mb-1.5 truncate">
                      {t.deviceDescription || 'غير محدد'}
                    </div>
                    {t.problem && (
                      <div className="text-[13px] text-slate-500 truncate" title={t.problem}>
                        {t.problem}
                      </div>
                    )}
                  </td>
                  {}
                  <td className="px-6 py-5 text-center">
                    <div className="inline-flex flex-col items-center justify-center">
                      <div className="font-black text-slate-900 text-lg">
                        {t.totalPrice.toLocaleString('ar-EG')} ج.م
                      </div>
                      <div className="text-[13px] mt-1.5 flex gap-2.5 items-center">
                        <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md" title="المدفوع">
                          {t.paidAmount > 0 ? `+${t.paidAmount.toLocaleString('ar-EG')}` : '0'}
                        </span>
                        {t.remainingAmount > 0 ? (
                          <span className="text-red-500 font-extrabold bg-red-50 px-2 py-0.5 rounded-md" title="الباقي">
                            باقي {t.remainingAmount.toLocaleString('ar-EG')}
                          </span>
                        ) : (
                          <span className="text-emerald-600 font-extrabold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md">
                            <CheckCircle2 className="w-3.5 h-3.5" /> مسدد
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  {}
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1.5">
                      <div className={cn("flex items-center gap-2 text-[15px]", dateInfo.color)}>
                        {dateInfo.isUrgent ? (
                          <AlertCircle className="w-5 h-5 shrink-0" />
                        ) : (
                          <Clock className="w-5 h-5 shrink-0" />
                        )}
                        <span>{dateInfo.primary}</span>
                      </div>
                      {dateInfo.secondary && (
                        <div className="text-sm font-medium text-slate-400 mr-7">
                          {dateInfo.secondary}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile card list — each card is a single tappable button, not just a control inside it */}
      <div className="sm:hidden divide-y divide-slate-100">
        {tickets.map((t) => {
          const cfg = statusConfig[t.status] ?? { label: t.status, color: 'bg-slate-100 text-slate-700' };
          const dateInfo = formatDateInfo(t.deliveryDate, t.status);
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onRowClick(t.id)}
              className={cn(
                "w-full text-right p-4 flex flex-col gap-2.5 active:bg-blue-50/70 transition-colors",
                dateInfo.isUrgent && "bg-red-50/40"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-blue-100/80 text-blue-600 flex items-center justify-center shrink-0">
                    <User className="w-4.5 h-4.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-extrabold text-slate-800 text-[15px] truncate">{t.customerName}</div>
                    {t.customerPhone && (
                      <div className="text-xs font-medium text-slate-500 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 shrink-0" />
                        <span className="dir-ltr">{t.customerPhone}</span>
                      </div>
                    )}
                  </div>
                </div>
                <span className={cn('px-2.5 py-1 rounded-lg text-xs font-bold border shadow-sm shrink-0 whitespace-nowrap', cfg.color)}>
                  {cfg.label}
                </span>
              </div>

              <div className="min-w-0">
                <div className="font-bold text-slate-800 text-sm truncate">
                  {t.deviceDescription || 'غير محدد'}
                </div>
                {t.problem && (
                  <div className="text-xs text-slate-500 truncate">{t.problem}</div>
                )}
              </div>

              <div className="flex items-end justify-between gap-2">
                <div className={cn("flex items-center gap-1.5 text-sm min-w-0", dateInfo.color)}>
                  {dateInfo.isUrgent ? (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  ) : (
                    <Clock className="w-4 h-4 shrink-0" />
                  )}
                  <span className="truncate">{dateInfo.primary}</span>
                </div>
                <div className="text-left shrink-0">
                  <div className="font-black text-slate-900 text-[15px]">
                    {t.totalPrice.toLocaleString('ar-EG')} ج.م
                  </div>
                  {t.remainingAmount > 0 ? (
                    <span className="text-red-500 font-bold text-xs">باقي {t.remainingAmount.toLocaleString('ar-EG')}</span>
                  ) : (
                    <span className="text-emerald-600 font-bold text-xs flex items-center gap-1 justify-end">
                      <CheckCircle2 className="w-3 h-3" /> مسدد
                    </span>
                  )}
                </div>
              </div>

              <span className="text-[11px] font-mono text-slate-400">#{t.id.slice(0, 8)}</span>
            </button>
          );
        })}
      </div>

      {}
      <div className="p-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
        <span className="text-center sm:text-right">
          إظهار {(pageIndex - 1) * pageSize + 1} إلى {Math.min(pageIndex * pageSize, totalCount)} من أصل {totalCount} سجل
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevPage}
            disabled={pageIndex <= 1 || isLoading}
            className="px-3 py-2 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-40 flex items-center gap-1 transition-colors"
          >
            <ChevronRight size={15} />
            السابق
          </button>
          <span className="px-3 py-2 border border-blue-600 bg-blue-50 text-blue-600 rounded-md font-semibold min-w-[60px] text-center">
            {pageIndex} / {totalPages || 1}
          </span>
          <button
            onClick={onNextPage}
            disabled={pageIndex >= totalPages || isLoading}
            className="px-3 py-2 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-40 flex items-center gap-1 transition-colors"
          >
            التالي
            <ChevronLeft size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}