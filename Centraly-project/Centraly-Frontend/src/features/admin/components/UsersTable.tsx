import { Edit, Shield } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
interface User {
  id: string;
  username: string;
  roles: string[];
}
interface UsersTableProps {
  users: User[] | undefined;
  isLoading: boolean;
  onEdit: (id: string) => void;
}
export function UsersTable({ users, isLoading, onEdit }: UsersTableProps) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      {isLoading ? (
        <div className="p-16 flex flex-col items-center justify-center space-y-4">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">جاري التحميل...</p>
        </div>
      ) : (
        <div className="overflow-x-auto -webkit-overflow-scrolling-touch">
          <table className="w-full min-w-[560px] text-right border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-4 sm:p-5 px-5 sm:px-8 font-bold text-slate-600 text-sm tracking-wide">تفاصيل المستخدم</th>
                <th className="p-4 sm:p-5 font-bold text-slate-600 text-sm tracking-wide">الأدوار الممنوحة</th>
                <th className="p-4 sm:p-5 px-5 sm:px-8 font-bold text-slate-600 text-sm tracking-wide w-20 sm:w-32 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users?.map(user => (
                <tr
                  key={user.id}
                  onClick={() => onEdit(user.id)}
                  className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                >
                  <td className="p-4 sm:p-5 px-5 sm:px-8">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg border border-indigo-100 shrink-0">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 text-base truncate">{user.username}</p>
                        <p className="text-[13px] text-slate-400 mt-0.5 font-medium font-mono">ID: {user.id.slice(0, 8)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 sm:p-5">
                    <div className="flex flex-wrap gap-2">
                      {user.roles.length === 0 && <span className="text-sm text-slate-400">لا يوجد أدوار</span>}
                      {user.roles.map(role => (
                        <span key={role} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-[13px] font-bold rounded-lg border border-blue-100/60 shadow-sm whitespace-nowrap">
                          <Shield size={14} className="text-blue-500 shrink-0" />
                          {role}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 sm:p-5 px-5 sm:px-8 text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => { e.stopPropagation(); onEdit(user.id); }}
                      className="bg-white border border-slate-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-colors"
                    >
                      <Edit size={18} />
                    </Button>
                  </td>
                </tr>
              ))}
              {users?.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-16 text-center text-slate-500 font-medium text-lg">
                    لا يوجد مستخدمين مسجلين بعد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}