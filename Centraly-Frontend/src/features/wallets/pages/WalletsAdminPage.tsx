import { useState, useEffect } from 'react';
import { useWallets } from '../hooks/useWallets';
import { tokens } from '@/shared/styles/tokens';
import { Wallet, Plus, Edit2, Info } from 'lucide-react';
import { RightDrawer } from '@/shared/components/ui/RightDrawer';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { formatDate } from '@/shared/utils/date';
import { useHeaderStore } from '@/shared/hooks/useHeaderStore';
import { useNavigate } from 'react-router-dom';
import { WalletResponse } from '../schemas/walletSchemas';
import { GlobalWalletOperationsTable } from '../components/GlobalWalletOperationsTable';
const walletFormSchema = z.object({
  name: z.string().min(1, 'اسم المحفظة مطلوب'),
  phoneNumber: z.string().min(1, 'رقم التليفون مطلوب'),
  ownerName: z.string().optional(),
  initialBalance: z.coerce.number().min(0, 'يجب أن يكون الرصيد 0 أو أكثر').optional(),
  isActive: z.boolean(),
  image: z.any().optional()
});
type WalletFormValues = z.infer<typeof walletFormSchema>;
export function WalletsAdminPage() {
  const { setTitle } = useHeaderStore();
  const navigate = useNavigate();
  const { wallets, isLoading, createWallet, isCreating, updateWallet, isUpdating } = useWallets();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingWallet, setEditingWallet] = useState<WalletResponse | null>(null);
  const [activeTab, setActiveTab] = useState<'list' | 'history'>('list');
  useEffect(() => {
    setTitle('إدارة المحافظ');
  }, [setTitle]);
  const form = useForm<WalletFormValues>({
    resolver: zodResolver(walletFormSchema) as any,
    defaultValues: { name: '', phoneNumber: '', ownerName: '', initialBalance: 0, isActive: true }
  });
  const openCreateDrawer = () => {
    setEditingWallet(null);
    form.reset({ name: '', phoneNumber: '', ownerName: '', initialBalance: 0, isActive: true });
    setIsDrawerOpen(true);
  };
  const openEditDrawer = (wallet: WalletResponse, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingWallet(wallet);
    form.reset({
      name: wallet.name,
      phoneNumber: wallet.phoneNumber,
      ownerName: wallet.ownerName || '',
      initialBalance: wallet.balance,
      isActive: wallet.isActive,
    });
    setIsDrawerOpen(true);
  };
  const onSubmit = (data: WalletFormValues) => {
    if (editingWallet) {
      updateWallet(
        {
          walletId: editingWallet.id,
          data: {
            name: data.name,
            phoneNumber: data.phoneNumber,
            ownerName: data.ownerName || undefined,
            isActive: data.isActive,
            image: data.image?.[0]
          }
        },
        { onSuccess: () => setIsDrawerOpen(false) }
      );
    } else {
      createWallet(
        {
          name: data.name,
          phoneNumber: data.phoneNumber,
          ownerName: data.ownerName || undefined,
          initialBalance: data.initialBalance || 0,
          image: data.image?.[0]
        },
        { onSuccess: () => setIsDrawerOpen(false) }
      );
    }
  };
  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setEditingWallet(null);
    form.reset();
  };
  const isSaving = isCreating || isUpdating;
  const drawerFooter = (
    <>
      <button type="button" onClick={closeDrawer} className={tokens.btn.secondary}>
        إلغاء
      </button>
      <button
        type="submit"
        form="wallet-form"
        disabled={isSaving}
        className={tokens.btn.primary + " disabled:opacity-60"}
      >
        {isSaving ? 'جاري الحفظ...' : 'حفظ'}
      </button>
    </>
  );
  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('list')}
          className={`py-3 px-6 font-semibold text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === 'list' ? 'border-[#0f8e4c] text-[#0f8e4c]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          المحافظ
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`py-3 px-6 font-semibold text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === 'history' ? 'border-[#0f8e4c] text-[#0f8e4c]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          سجل العمليات الشامل
        </button>
      </div>
      {activeTab === 'list' && (
        <>
          <div className="flex justify-end">
            <button
              onClick={openCreateDrawer}
              className={tokens.btn.primary + " flex items-center gap-2"}
            >
              <Plus size={18} />
              محفظة جديدة
            </button>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center text-gray-500">جاري تحميل المحافظ...</div>
            ) : wallets.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex w-16 h-16 rounded-full bg-blue-50 items-center justify-center text-blue-500 mb-4">
                  <Wallet size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">لا يوجد محافظ مسجلة</h3>
                <p className="text-gray-500 mb-4">قم بإضافة أول محفظة للبدء في العمليات</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-right">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">اسم المحفظة</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">رقم التليفون</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">اسم المالك</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">الرصيد الحالي</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">تاريخ الإنشاء</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">الحالة</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {wallets.map(wallet => (
                  <tr
                    key={wallet.id}
                    className="hover:bg-slate-50/50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/wallets/${wallet.id}`)}
                  >
                    <td className="px-6 py-4 font-medium text-slate-800 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {wallet.imageUrl ? (
                          <img src={wallet.imageUrl.startsWith('http') ? wallet.imageUrl : `${import.meta.env.VITE_API_BASE_URL ?? 'https://localhost:7073'}${wallet.imageUrl}`} alt={wallet.name} className="w-8 h-8 rounded-full object-cover border border-gray-200 shrink-0" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                            <Wallet size={16} />
                          </div>
                        )}
                        <span>{wallet.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap" dir="ltr">{wallet.phoneNumber}</td>
                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">{wallet.ownerName || '-'}</td>
                    <td className="px-6 py-4 font-bold text-[#0f8e4c] font-mono whitespace-nowrap">
                      {wallet.balance.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">{formatDate(wallet.createdAt)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${wallet.isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {wallet.isActive ? 'نشط' : 'غير نشط'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => openEditDrawer(wallet, e)}
                          className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="تعديل"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          title="التفاصيل"
                        >
                          <Info size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      </>
      )}
      {activeTab === 'history' && (
        <GlobalWalletOperationsTable />
      )}
      <RightDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        title={editingWallet ? "تعديل بيانات المحفظة" : "إضافة محفظة جديدة"}
        footer={drawerFooter}
      >
        <form id="wallet-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">اسم المحفظة *</label>
            <input
              {...form.register('name')}
              className={tokens.input}
              placeholder="مثال: فودافون كاش - رقم 1"
            />
            {form.formState.errors.name && (
              <p className="text-red-500 text-xs mt-1">{form.formState.errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">رقم التليفون *</label>
            <input
              {...form.register('phoneNumber')}
              className={tokens.input}
              placeholder="مثال: 01012345678"
            />
            {form.formState.errors.phoneNumber && (
              <p className="text-red-500 text-xs mt-1">{form.formState.errors.phoneNumber.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">اسم المالك (اختياري)</label>
            <input
              {...form.register('ownerName')}
              className={tokens.input}
              placeholder="مثال: أحمد محمد"
            />
          </div>
          {!editingWallet && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الرصيد الافتتاحي</label>
              <input
                type="number"
                step="0.01"
                {...form.register('initialBalance')} onFocus={(e) => e.target.select()}
                className={tokens.input}
              />
              {form.formState.errors.initialBalance && (
                <p className="text-red-500 text-xs mt-1">{form.formState.errors.initialBalance.message}</p>
              )}
            </div>
          )}
          {editingWallet && (
            <div className="flex items-center gap-2 pt-2 pb-2">
              <input
                type="checkbox"
                id="isActive"
                {...form.register('isActive')}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                المحفظة نشطة
              </label>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              صورة المحفظة {editingWallet ? '(اختياري - لعدم التغيير اتركها فارغة)' : '*'}
            </label>
            <input
              type="file"
              accept="image/*"
              {...form.register('image')}
              className={tokens.input}
            />
            {form.formState.errors.image && (
              <p className="text-red-500 text-xs mt-1">{form.formState.errors.image?.message as string}</p>
            )}
          </div>
        </form>
      </RightDrawer>
    </div>
  );
}