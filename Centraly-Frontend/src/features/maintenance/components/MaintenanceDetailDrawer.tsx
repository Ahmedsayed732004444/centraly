import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateMaintenanceSchema, UpdateMaintenanceRequest, } from '../schemas/maintenanceSchemas';
import { useMaintenanceDetail, useUpdateMaintenance, useDeliverMaintenance, useReturnMaintenance} from '../api/queries';
import { useProducts } from '@/features/inventory/hooks/useInventory';
import { RightDrawer as Drawer } from '@/shared/components/ui/RightDrawer';
import { Input } from '@/shared/components/ui/Input';
import { tokens } from '@/shared/styles/tokens';
import { Save, CheckCircle, RotateCcw, Plus, Minus } from 'lucide-react';
import { PageLoader } from '@/shared/components/ui/PageLoader';
import { isMaintenanceProduct } from '@/features/inventory/schemas/inventorySchemas';
import { toast } from 'sonner';
import { MaintenanceProductPicker } from './MaintenanceProductPicker';
interface Props {
  id: string | null;
  onClose: () => void;
}
export function MaintenanceDetailDrawer({ id, onClose }: Props) {
  const { data: ticket, isLoading } = useMaintenanceDetail(id);
  const { mutate: updateTicket, isPending: isUpdating } = useUpdateMaintenance();
  const { mutate: deliverTicket, isPending: isDelivering } = useDeliverMaintenance();
  const { mutate: returnTicket, isPending: isReturning } = useReturnMaintenance();
const [isPickerOpen, setIsPickerOpen] = useState(false);
  const { data: productsData } = useProducts({ pageSize: 1000 });
  const maintenanceProducts = productsData?.items.filter(
    p => isMaintenanceProduct(p.usage)
  ) || [];
  const { register, control, handleSubmit, reset, watch, formState: { isDirty } } = useForm<UpdateMaintenanceRequest>({
    resolver: zodResolver(updateMaintenanceSchema) as any
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'productsUsed'
  });
  useEffect(() => {
    if (ticket) {
      reset({
        customerName: ticket.customerName,
        customerPhone: ticket.customerPhone || '',
        customerId: ticket.customerId || '',
        deviceDescription: ticket.deviceDescription || '',
        problem: ticket.problem || '',
        solution: ticket.solution || '',
        servicePrice: ticket.servicePrice,
        paidAmount: ticket.paidAmount,
        deliveryDate: ticket.deliveryDate ? ticket.deliveryDate.slice(0, 16) : '',
        productsUsed: ticket.productsUsed.map(p => ({
          productId: p.productId,
          quantity: p.quantity,
          maintenancePrice: p.maintenancePrice
        }))
      });
    }
  }, [ticket, reset]);
  const watchProductsUsed = watch('productsUsed') || [];
  const watchServicePrice = watch('servicePrice') || 0;
  const totalParts = watchProductsUsed.reduce((acc, curr) => acc + ((curr.maintenancePrice || 0) * (curr.quantity || 0)), 0);
  const currentTotal = Number(watchServicePrice) + totalParts;
  const currentPaid = watch('paidAmount') || 0;
  const remaining = currentTotal - currentPaid;
  const onSubmit = (data: UpdateMaintenanceRequest) => {
    if (!id) return;
    if (!data.deliveryDate) delete data.deliveryDate;
    updateTicket({ id, data }, {
      onSuccess: () => toast.success('تم الحفظ بنجاح')
    });
  };
  const handleDeliver = () => {
    if (!id) return;
    if (window.confirm(`هل أنت متأكد من تسليم الجهاز؟\nسيتم سحب قطع الغيار من المخزن، وإضافة المتبقي (${remaining} ج.م) للدرج.`)) {
      deliverTicket(id, { onSuccess: onClose });
    }
  };
  const handleReturn = () => {
    if (!id) return;
    if (window.confirm('هل أنت متأكد من إرجاع الجهاز بدون إصلاح؟')) {
      returnTicket(id, { onSuccess: onClose });
    }
  };
if (!id) return null;
  return (
    <Drawer
      isOpen={!!id}
      onClose={onClose}
      title={`تفاصيل الصيانة`}
      width="w-[700px] max-w-full"
    >
      {isLoading ? (
        <PageLoader />
      ) : !ticket ? (
        <div className="p-5 text-red-500">حدث خطأ في تحميل التذكرة</div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit as any)} className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
            {}
            <div className={`p-4 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 ${
              ticket.status === 'Pending' ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' :
              ticket.status === 'Delivered' ? 'bg-green-50 text-green-800 border border-green-200' :
              'bg-red-50 text-red-800 border border-red-200'
            }`}>
              <div className="font-bold text-lg">
                الحالة: {ticket.status === 'Pending' ? 'قيد الانتظار' : ticket.status === 'Delivered' ? 'تم التسليم' : 'مرتجع'}
              </div>
              <div className="text-sm opacity-80">
                تاريخ الإنشاء: {new Date(ticket.createdAt).toLocaleDateString('ar-EG')}
              </div>
            </div>
            {}
            <div className="bg-gray-50 p-4 sm:p-5 rounded-xl border border-gray-100 space-y-4">
              <h3 className="font-bold text-gray-800 mb-3 border-b border-gray-200 pb-2">بيانات العميل والجهاز</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">اسم العميل *</label>
                  <Input {...register('customerName')}  disabled={ticket.status !== 'Pending'} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
                  <Input {...register('customerPhone')}  disabled={ticket.status !== 'Pending'} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">اسم الجهاز / الموديل</label>
                  <Input {...register('deviceDescription')}  disabled={ticket.status !== 'Pending'} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">موعد التسليم</label>
                  <Input type="datetime-local" {...register('deliveryDate')}  disabled={ticket.status !== 'Pending'} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">المشكلة (من العميل)</label>
                  <textarea {...register('problem')} className={tokens.input + " min-h-[80px] py-2 resize-y"} disabled={ticket.status !== 'Pending'} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الحل / التقرير الفني</label>
                  <textarea {...register('solution')} className={tokens.input + " min-h-[80px] py-2 resize-y"} disabled={ticket.status !== 'Pending'} />
                </div>
              </div>
            </div>
            {}
            <div className="bg-gray-50 p-4 sm:p-5 rounded-xl border border-gray-100">
              <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2 gap-2">
                <h3 className="font-bold text-gray-800">قطع الغيار المستخدمة</h3>
                {ticket.status === 'Pending' && (
                  <button type="button" onClick={() => setIsPickerOpen(true)} className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-medium bg-blue-50 px-3 py-1.5 rounded-lg shrink-0">
                    <Plus className="w-4 h-4" /> <span className="hidden xs:inline">إضافة قطعة</span>
                  </button>
                )}
              </div>
              <div className="space-y-3">
                {fields.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-4">لم يتم إضافة قطع غيار</p>
                ) : (
                  fields.map((field, index) => {
                    const pId = watchProductsUsed[index]?.productId;
                    const prodName = maintenanceProducts.find(p => p.productId === pId)?.name || 'قطعة غيار';
                    return (
                      <div key={field.id} className="flex flex-wrap items-end gap-3 bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                        <div className="flex-1 min-w-[140px]">
                          <label className="block text-xs font-medium text-gray-600 mb-1">المنتج</label>
                          <div className="font-bold text-sm text-gray-800 bg-gray-50/50 border border-gray-100 rounded-lg px-3 py-2 truncate">
                            {prodName}
                          </div>
                        </div>
                        <div className="w-20 sm:w-24">
                          <label className="block text-xs font-medium text-gray-600 mb-1">الكمية</label>
                          <Input
                            type="number"
                            min="1"
                            {...register(`productsUsed.${index}.quantity`)}
                            disabled={ticket.status !== 'Pending'}
                            onFocus={(e) => e.target.select()}
                          />
                        </div>
                        <div className="w-24 sm:w-32 bg-gray-50/50 border border-gray-100 rounded-lg p-2 text-center">
                          <label className="block text-xs font-medium text-gray-500 mb-0.5">سعر الصيانة</label>
                          <div className="font-bold text-emerald-600 text-sm">
                            {watchProductsUsed[index]?.maintenancePrice?.toLocaleString('ar-EG')} ج.م
                          </div>
                          <input type="hidden" {...register(`productsUsed.${index}.maintenancePrice`)} />
                        </div>
                        <div className="w-24 sm:w-32 bg-gray-50 border border-gray-200 rounded-lg p-2 text-center">
                          <label className="block text-xs font-medium text-gray-500 mb-0.5">الإجمالي</label>
                          <div className="font-bold text-gray-800 text-sm">
                            {((watchProductsUsed[index]?.quantity || 0) * (watchProductsUsed[index]?.maintenancePrice || 0)).toLocaleString('ar-EG')}
                          </div>
                        </div>
                        {ticket.status === 'Pending' && (
                          <button type="button" onClick={() => remove(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100">
                            <Minus className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            {}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 sm:p-5 rounded-xl border border-gray-100 space-y-4">
                <h3 className="font-bold text-gray-800 mb-3 border-b border-gray-200 pb-2">الرسوم</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">أجرة الصيانة / الخدمة</label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      {...register('servicePrice')}
                      disabled={ticket.status !== 'Pending'}
                      onFocus={(e) => e.target.select()}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الدفعة المقدمة / المدفوع</label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      {...register('paidAmount')}
                      disabled={ticket.status !== 'Pending'}
                      onFocus={(e) => e.target.select()}
                    />
                  </div>
                </div>
              </div>
              <div className="bg-blue-900 text-white p-5 sm:p-6 rounded-xl shadow-lg flex flex-col justify-center">
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-white font-bold border-b border-blue-800 pb-3">
                    <span>الإجمالي الكلي:</span>
                    <span className="text-xl">{currentTotal.toLocaleString('ar-EG')} ج.م</span>
                  </div>
                  <div className="flex justify-between text-emerald-400 font-bold border-b border-blue-800 pb-3 pt-1">
                    <span>المدفوع (مقدم):</span>
                    <span className="text-lg">{Number(currentPaid).toLocaleString('ar-EG')} ج.م</span>
                  </div>
                </div>
                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm mt-auto">
                  <div className="text-blue-200 text-sm mb-1">المبلغ المتبقي للتحصيل عند التسليم</div>
                  <div className={`text-3xl font-black ${remaining > 0 ? 'text-red-300' : 'text-green-300'}`}>
                    {remaining.toLocaleString('ar-EG')} <span className="text-base font-normal opacity-80">ج.م</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {}
          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <div className="flex flex-col sm:flex-row gap-3">
              {ticket.status === 'Pending' && (
                <>
                  <button
                    type="submit"
                    disabled={isUpdating || !isDirty || isDelivering || isReturning}
                    className={tokens.btn.secondary + " flex items-center justify-center gap-2 w-full sm:w-auto"}
                  >
                    <Save className="w-5 h-5" /> حفظ التعديلات
                  </button>
                  <button
                    type="button"
                    onClick={handleReturn}
                    disabled={isReturning || isDirty || isUpdating || isDelivering} title={isDirty ? "يجب حفظ التعديلات أولا" : ""}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors w-full sm:w-auto"
                  >
                    <RotateCcw className="w-5 h-5" /> إرجاع بدون إصلاح
                  </button>
                  <button
                    type="button"
                    onClick={handleDeliver}
                    disabled={isDelivering || isDirty || isUpdating || isReturning} title={isDirty ? "يجب حفظ التعديلات أولا" : ""}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold flex items-center justify-center gap-2 shadow-md transition-colors w-full sm:w-auto sm:mr-auto"
                  >
                    <CheckCircle className="w-5 h-5" /> تسليم للعميل وتحصيل
                  </button>
                </>
              )}
              {ticket.status !== 'Pending' && (
                <button type="button" onClick={onClose} className={tokens.btn.primary + " w-full sm:w-auto"}>
                  إغلاق
                </button>
              )}
            </div>
          </div>
        </form>
      )}
      {isPickerOpen && (
        <MaintenanceProductPicker
          isOpen={isPickerOpen}
          onClose={() => setIsPickerOpen(false)}
          excludeProductIds={watchProductsUsed.map(p => p.productId).filter(Boolean) as string[]}
          onAdd={(products) => {
            for (const p of products) {
              append({
                productId: p.productId,
                quantity: 1,
                maintenancePrice: p.batches?.[0]?.maintenancePrice || 0
              });
            }
          }}
        />
      )}
    </Drawer>
  );
}