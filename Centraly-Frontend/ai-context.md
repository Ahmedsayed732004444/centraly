This file is a merged representation of a subset of the codebase, containing specifically included files and files not matching ignore patterns, combined into a single document by Repomix.
The content has been processed where comments have been removed, empty lines have been removed.

# File Summary

## Purpose
This file contains a packed representation of a subset of the repository's contents that is considered the most important context.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Only files matching these patterns are included: src/**/*, package.json, vite.config.ts, tsconfig*.json, index.html, components.json, src/features/admin/**, src/features/auth/**
- Files matching these patterns are excluded: package-lock.json, pnpm-lock.yaml, yarn.lock, bun.lockb, *.lock, ai-context.md, repomix-output.*, tree.txt, verify-rebuild.sh, public/**, dist/**, build/**, coverage/**, .husky/**, .vscode/**, .idea/**, *.log, **/*.min.js, **/*.min.css, **/*.map, **/*.svg, **/*.png, **/*.jpg, **/*.jpeg, **/*.gif, **/*.webp, **/*.ico, **/*.avif, **/*.mp4, **/*.webm, **/*.mp3, **/*.pdf, **/*.woff, **/*.woff2, **/*.ttf, **/*.eot, **/__snapshots__/**, src/features/!(admin|auth)/**, src/shared/**, src/App.*, src/main.*, src/lib/**, *.json, *.html
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Code comments have been removed from supported file types
- Empty lines have been removed from all files
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
src/core/repositories/IAuthRepository.ts
src/core/repositories/IContactsRepository.ts
src/core/repositories/IFinanceRepository.ts
src/core/repositories/IInventoryRepository.ts
src/features/admin/api/RolesApi.ts
src/features/admin/api/UsersApi.ts
src/features/admin/components/RoleFormModal.tsx
src/features/admin/components/UserFormModal.tsx
src/features/admin/components/UsersPageHeader.tsx
src/features/admin/components/UsersTable.tsx
src/features/admin/hooks/useRoles.ts
src/features/admin/hooks/useUsers.ts
src/features/admin/pages/RolesPage.tsx
src/features/admin/pages/UsersPage.tsx
src/features/admin/schemas/roleSchemas.ts
src/features/admin/schemas/userSchemas.ts
src/features/auth/api/AuthApi.ts
src/features/auth/components/HasPermission.tsx
src/features/auth/components/LoginForm.tsx
src/features/auth/hooks/useAuth.tsx
src/features/auth/pages/LoginPage.tsx
src/features/auth/schemas/loginSchema.ts
src/features/auth/schemas/permissions.ts
src/index.css
src/setupTests.ts
src/vite-env.d.ts
vite.config.ts
```

# Files

## File: src/core/repositories/IAuthRepository.ts
```typescript
import { LoginFormData } from "@/features/auth/schemas/loginSchema";
export interface AuthResponse {
  id: string;
  userName: string;
  token: string;
  expiresIn: number;
  refreshToken: string;
  refreshTokenExpiration: string;
  role: string[];
  permissions: string[];
}
export interface RefreshTokenRequest {
  token: string;
  refreshToken: string;
}
export interface IAuthRepository {
  login(data: LoginFormData): Promise<AuthResponse>;
  refreshToken(data: RefreshTokenRequest): Promise<AuthResponse>;
  revokeRefreshToken(data: RefreshTokenRequest): Promise<void>;
}
```

## File: src/core/repositories/IContactsRepository.ts
```typescript
import { PaginatedList } from "@/shared/types/pagination";
import {
  CreateCustomerRequest,
  CustomerResponse,
  CustomerStatementResponse, CustomerDebtHistoryResponse,
  CreatePaymentRequest,
  ContactFilters
} from "@/features/contacts/schemas/contactSchemas";
export interface IContactsRepository {
  getCustomers(filters: ContactFilters): Promise<PaginatedList<CustomerResponse>>;
  getCustomer(id: string): Promise<CustomerResponse>;
  getCustomerDebtHistory(id: string): Promise<CustomerDebtHistoryResponse>;
  createCustomer(data: CreateCustomerRequest): Promise<string>;
  updateCustomer(id: string, data: CreateCustomerRequest): Promise<void>;
  deleteCustomer(id: string): Promise<void>;
  getCustomerStatement(customerId: string): Promise<CustomerStatementResponse[]>;
  addCustomerPayment(customerId: string, data: CreatePaymentRequest): Promise<string>;
}
```

## File: src/core/repositories/IFinanceRepository.ts
```typescript
import { PaginatedList } from "@/shared/types/pagination";
import {
  OpenSessionRequest, DrawerSessionResponse, AddManualTransactionRequest,
  CreateSafeRequest, SafeResponse, SafeTransactionResponse, ReceiveDrawerDepositRequest, AddManualSafeTransactionRequest,
  CreateExpenseCategoryRequest, ExpenseCategoryResponse,
  CreateExpenseRequest, ExpenseResponse,
  FinanceFilters
} from "@/features/finance/schemas/financeSchemas";
export interface IFinanceRepository {
  getCurrentDrawerSession(type?: number): Promise<DrawerSessionResponse>;
  openDrawerSession(data: OpenSessionRequest): Promise<string>;
  closeDrawerSession(type?: number): Promise<void>;
  addDrawerTransaction(data: AddManualTransactionRequest): Promise<string>;
  getDrawerHistory(filters: FinanceFilters): Promise<PaginatedList<DrawerSessionResponse>>;
  getDrawerSessionById(id: string): Promise<DrawerSessionResponse>;
  getSafes(): Promise<SafeResponse[]>;
  createSafe(data: CreateSafeRequest): Promise<string>;
  getSafeTransactions(safeId: string, filters: FinanceFilters): Promise<SafeTransactionResponse[]>;
  depositFromDrawer(safeId: string, request: ReceiveDrawerDepositRequest): Promise<SafeTransactionResponse>;
  addManualSafeTransaction(safeId: string, request: AddManualSafeTransactionRequest): Promise<SafeTransactionResponse>;
  getExpenseCategories(): Promise<ExpenseCategoryResponse[]>;
  createExpenseCategory(request: CreateExpenseCategoryRequest): Promise<ExpenseCategoryResponse>;
  getExpenses(filters: FinanceFilters): Promise<ExpenseResponse[]>;
  recordExpense(request: CreateExpenseRequest): Promise<ExpenseResponse>;
}
```

## File: src/core/repositories/IInventoryRepository.ts
```typescript
import { PaginatedList } from "@/shared/types/pagination";
import {
  CategoryResponse,
  CreateProductRequest,
  DepartmentResponse,
  ProductResponse,
  ProductFilters
} from "@/features/inventory/schemas/inventorySchemas";
export interface IInventoryRepository {
  getCategories(departmentId?: string, filters?: ProductFilters): Promise<PaginatedList<CategoryResponse>>;
  createCategory(reqData: { name: string; departmentId: string }): Promise<string>;
  updateCategory(id: string, reqData: { name: string; departmentId: string }): Promise<void>;
  deleteCategory(id: string): Promise<void>;
  getDepartments(filters?: ProductFilters): Promise<PaginatedList<DepartmentResponse>>;
  createDepartment(reqData: { name: string }): Promise<string>;
  updateDepartment(id: string, reqData: { name: string }): Promise<void>;
  deleteDepartment(id: string): Promise<void>;
  getProducts(filters: ProductFilters): Promise<PaginatedList<ProductResponse>>;
  getProduct(id: string): Promise<ProductResponse>;
  createProduct(data: CreateProductRequest): Promise<string>;
  updateProduct(id: string, data: CreateProductRequest): Promise<void>;
  deleteProduct(id: string): Promise<void>;
}
```

## File: src/features/admin/api/RolesApi.ts
```typescript
import { apiClient } from '@/lib/axios';
import { RoleDetailResponse, RoleRequest, RoleResponse } from '../schemas/roleSchemas';
export const rolesApi = {
  getRoles: async (includeDisabled = false): Promise<RoleResponse[]> => {
    const { data } = await apiClient.get<RoleResponse[]>(`/roles?includeDisabled=${includeDisabled}`);
    return data;
  },
  getRole: async (id: string): Promise<RoleDetailResponse> => {
    const { data } = await apiClient.get<RoleDetailResponse>(`/roles/${id}`);
    return data;
  },
  getPermissions: async (): Promise<string[]> => {
    const { data } = await apiClient.get<string[]>('/roles/permissions');
    return data;
  },
  createRole: async (request: RoleRequest): Promise<RoleResponse> => {
    const { data } = await apiClient.post<RoleResponse>('/roles', request);
    return data;
  },
  updateRole: async ({ id, request }: { id: string; request: RoleRequest }): Promise<void> => {
    await apiClient.put(`/roles/${id}`, request);
  },
  toggleRoleStatus: async (id: string): Promise<void> => {
    await apiClient.patch(`/roles/${id}/toggle-status`);
  },
};
```

## File: src/features/admin/api/UsersApi.ts
```typescript
import { apiClient } from '@/lib/axios';
import { CreateUserRequest, UpdateUserRequest, UserResponse } from '../schemas/userSchemas';
export const usersApi = {
  getUsers: async (): Promise<UserResponse[]> => {
    const { data } = await apiClient.get<UserResponse[]>('/users');
    return data;
  },
  getUser: async (id: string): Promise<UserResponse> => {
    const { data } = await apiClient.get<UserResponse>(`/users/${id}`);
    return data;
  },
  createUser: async (request: CreateUserRequest): Promise<UserResponse> => {
    const { data } = await apiClient.post<UserResponse>('/users', request);
    return data;
  },
  updateUser: async ({ id, request }: { id: string; request: UpdateUserRequest }): Promise<void> => {
    await apiClient.put(`/users/${id}`, request);
  },
};
```

## File: src/features/admin/components/RoleFormModal.tsx
```typescript
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BaseModal } from '@/shared/components/ui/BaseModal';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Label } from '@/shared/components/ui/Label';
import { roleFormSchema, RoleFormData } from '../schemas/roleSchemas';
import { usePermissions, useRole, useCreateRole, useUpdateRole } from '../hooks/useRoles';
interface RoleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  roleId?: string | null;
}
export function RoleFormModal({ isOpen, onClose, roleId }: RoleFormModalProps) {
  const { data: permissionsData = [] } = usePermissions();
  const { data: roleData, isLoading: isRoleLoading } = useRole(roleId || '');
  const createMutation = useCreateRole();
  const updateMutation = useUpdateRole();
  const [groupedPermissions, setGroupedPermissions] = useState<Record<string, string[]>>({});
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<RoleFormData>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: { name: '', permissions: [] }
  });
  useEffect(() => {
    // Group permissions by prefix (e.g., 'sales:read' -> group 'sales')
    const grouped = permissionsData.reduce((acc, perm) => {
      const [group] = perm.split(':');
      if (!acc[group]) acc[group] = [];
      acc[group].push(perm);
      return acc;
    }, {} as Record<string, string[]>);
    setGroupedPermissions(grouped);
  }, [permissionsData]);
  useEffect(() => {
    if (roleData && roleId) {
      reset({
        name: roleData.name,
        permissions: roleData.permissions
      });
    } else {
      reset({ name: '', permissions: [] });
    }
  }, [roleData, roleId, reset]);
  const onSubmit = (data: RoleFormData) => {
    if (roleId) {
      updateMutation.mutate({ id: roleId, request: data }, {
        onSuccess: () => onClose()
      });
    } else {
      createMutation.mutate(data, {
        onSuccess: () => onClose()
      });
    }
  };
  const footer = (
    <div className="flex justify-end gap-2" dir="rtl">
      <Button type="button" variant="outline" onClick={onClose}>إلغاء</Button>
      <Button type="button" onClick={handleSubmit(onSubmit)} disabled={createMutation.isPending || updateMutation.isPending}>
        حفظ
      </Button>
    </div>
  );
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={roleId ? 'تعديل الدور' : 'إضافة دور جديد'}
      size="2xl"
      footer={footer}
    >
        {isRoleLoading ? (
          <div className="py-8 text-center">جاري التحميل...</div>
        ) : (
          <form id="role-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4" dir="rtl">
            <div className="space-y-2">
              <Label>اسم الدور</Label>
              <Input {...register('name')} placeholder="مثال: مدير المبيعات" />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>
            <div className="space-y-3">
              <Label className="text-base font-semibold border-b pb-2 block">الصلاحيات</Label>
              {errors.permissions && <p className="text-red-500 text-sm">{errors.permissions.message}</p>}
              <Controller
                name="permissions"
                control={control}
                render={({ field }) => (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(groupedPermissions).map(([group, perms]) => (
                      <div key={group} className="bg-slate-50 p-4 rounded-lg border">
                        <h4 className="font-bold text-slate-700 capitalize mb-3">{group}</h4>
                        <div className="space-y-2">
                          {perms.map(perm => {
                            const isChecked = field.value.includes(perm);
                            return (
                              <div key={perm} className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  id={perm}
                                  checked={isChecked}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      field.onChange([...field.value, perm]);
                                    } else {
                                      field.onChange(field.value.filter(p => p !== perm));
                                    }
                                  }}
                                  className="rounded border-gray-300 w-4 h-4 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor={perm} className="cursor-pointer font-normal text-sm">
                                  {perm}
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              />
            </div>
          </form>
        )}
    </BaseModal>
  );
}
```

## File: src/features/admin/components/UserFormModal.tsx
```typescript
import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BaseModal } from '@/shared/components/ui/BaseModal';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Label } from '@/shared/components/ui/Label';
import { userFormSchema, UserFormData } from '../schemas/userSchemas';
import { useUser, useCreateUser, useUpdateUser } from '../hooks/useUsers';
import { useRoles } from '../hooks/useRoles';
interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string | null;
}
export function UserFormModal({ isOpen, onClose, userId }: UserFormModalProps) {
  const { data: userData, isLoading: isUserLoading } = useUser(userId || '');
  const { data: rolesData = [] } = useRoles(false); // Only active roles
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: { username: '', password: '', roles: [] }
  });
  useEffect(() => {
    if (userData && userId) {
      reset({
        username: userData.username,
        roles: userData.roles
      });
    } else {
      reset({ username: '', password: '', roles: [] });
    }
  }, [userData, userId, reset]);
  const onSubmit = (data: UserFormData) => {
    if (userId) {
      updateMutation.mutate({
        id: userId,
        request: { username: data.username, roles: data.roles }
      }, {
        onSuccess: () => onClose()
      });
    } else {
      createMutation.mutate({
        username: data.username,
        password: data.password,
        roles: data.roles
      }, {
        onSuccess: () => onClose()
      });
    }
  };
  const footer = (
    <div className="flex justify-end gap-2" dir="rtl">
      <Button type="button" variant="outline" onClick={onClose}>إلغاء</Button>
      <Button type="button" onClick={handleSubmit(onSubmit)} disabled={createMutation.isPending || updateMutation.isPending}>
        حفظ
      </Button>
    </div>
  );
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={userId ? 'تعديل مستخدم' : 'إضافة مستخدم جديد'}
      footer={footer}
    >
        {isUserLoading ? (
          <div className="py-8 text-center">جاري التحميل...</div>
        ) : (
          <form id="user-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4" dir="rtl">
            <div className="space-y-2">
              <Label>اسم المستخدم</Label>
              <Input {...register('username')} placeholder="مثال: ahmed" />
              {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
            </div>
            {!userId && (
              <div className="space-y-2">
                <Label>كلمة المرور</Label>
                <Input type="password" {...register('password')} placeholder="******" />
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
              </div>
            )}
            <div className="space-y-3 border-t pt-4">
              <Label className="text-base font-semibold block">الأدوار الممنوحة</Label>
              {errors.roles && <p className="text-red-500 text-sm">{errors.roles.message}</p>}
              <Controller
                name="roles"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2 bg-slate-50 p-4 rounded-lg border max-h-48 overflow-y-auto">
                    {rolesData.map(role => {
                      const isChecked = field.value.includes(role.name);
                      return (
                        <div key={role.id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`role-${role.id}`}
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                field.onChange([...field.value, role.name]);
                              } else {
                                field.onChange(field.value.filter(r => r !== role.name));
                              }
                            }}
                            className="rounded border-gray-300 w-4 h-4 text-blue-600 focus:ring-blue-500"
                          />
                          <label htmlFor={`role-${role.id}`} className="cursor-pointer font-normal text-sm">
                            {role.name}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                )}
              />
            </div>
          </form>
        )}
    </BaseModal>
  );
}
```

## File: src/features/admin/components/UsersPageHeader.tsx
```typescript
import { Plus, User } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
interface UsersPageHeaderProps {
  onAddUser: () => void;
}
export function UsersPageHeader({ onAddUser }: UsersPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10"></div>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
          <User size={24} />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">إدارة المستخدمين</h1>
          <p className="text-slate-500 mt-1.5 text-sm font-medium">أضف مستخدمين جدد وقم بتعيين الصلاحيات والأدوار المناسبة لكل مستخدم لضمان أمان النظام.</p>
        </div>
      </div>
      <Button onClick={onAddUser} className="gap-2 shadow-blue-500/20 shadow-lg px-6 shrink-0 h-12">
        <Plus size={18} /> إضافة مستخدم جديد
      </Button>
    </div>
  );
}
```

## File: src/features/admin/components/UsersTable.tsx
```typescript
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
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-5 px-8 font-bold text-slate-600 text-sm tracking-wide">تفاصيل المستخدم</th>
                <th className="p-5 font-bold text-slate-600 text-sm tracking-wide">الأدوار الممنوحة</th>
                <th className="p-5 px-8 font-bold text-slate-600 text-sm tracking-wide w-32 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users?.map(user => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-5 px-8">
                    <div className="flex items-center gap-4">
                      <div className="h-11 w-11 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg border border-indigo-100">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-base">{user.username}</p>
                        <p className="text-[13px] text-slate-400 mt-0.5 font-medium font-mono">ID: {user.id.slice(0, 8)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex flex-wrap gap-2">
                      {user.roles.length === 0 && <span className="text-sm text-slate-400">لا يوجد أدوار</span>}
                      {user.roles.map(role => (
                        <span key={role} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-[13px] font-bold rounded-lg border border-blue-100/60 shadow-sm">
                          <Shield size={14} className="text-blue-500" />
                          {role}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-5 px-8 text-center">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(user.id)} className="opacity-0 group-hover:opacity-100 transition-opacity bg-white border border-slate-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600">
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
```

## File: src/features/admin/hooks/useRoles.ts
```typescript
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { rolesApi } from '../api/RolesApi';
import { RoleRequest } from '../schemas/roleSchemas';
import { toast } from 'sonner';
export const useRoles = (includeDisabled = false) => {
  return useQuery({
    queryKey: ['roles', includeDisabled],
    queryFn: () => rolesApi.getRoles(includeDisabled),
  });
};
export const useRole = (id: string) => {
  return useQuery({
    queryKey: ['roles', id],
    queryFn: () => rolesApi.getRole(id),
    enabled: !!id,
  });
};
export const usePermissions = () => {
  return useQuery({
    queryKey: ['permissions'],
    queryFn: () => rolesApi.getPermissions(),
  });
};
export const useCreateRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RoleRequest) => rolesApi.createRole(data),
    onSuccess: () => {
      toast.success('تم إنشاء الدور بنجاح');
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
    onError: () => {
      toast.error('حدث خطأ أثناء إنشاء الدور');
    }
  });
};
export const useUpdateRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { id: string; request: RoleRequest }) => rolesApi.updateRole(params),
    onSuccess: (_, variables) => {
      toast.success('تم تحديث الدور بنجاح');
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['roles', variables.id] });
    },
    onError: () => {
      toast.error('حدث خطأ أثناء تحديث الدور');
    }
  });
};
export const useToggleRoleStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => rolesApi.toggleRoleStatus(id),
    onSuccess: () => {
      toast.success('تم تغيير حالة الدور بنجاح');
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
    onError: () => {
      toast.error('حدث خطأ أثناء تغيير حالة الدور');
    }
  });
};
```

## File: src/features/admin/hooks/useUsers.ts
```typescript
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../api/UsersApi';
import { CreateUserRequest, UpdateUserRequest } from '../schemas/userSchemas';
import { toast } from 'sonner';
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.getUsers(),
  });
};
export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => usersApi.getUser(id),
    enabled: !!id,
  });
};
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUserRequest) => usersApi.createUser(data),
    onSuccess: () => {
      toast.success('تم إنشاء المستخدم بنجاح');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: () => {
      toast.error('حدث خطأ أثناء إنشاء المستخدم');
    }
  });
};
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { id: string; request: UpdateUserRequest }) => usersApi.updateUser(params),
    onSuccess: (_, variables) => {
      toast.success('تم تحديث المستخدم بنجاح');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', variables.id] });
    },
    onError: () => {
      toast.error('حدث خطأ أثناء تحديث المستخدم');
    }
  });
};
```

## File: src/features/admin/pages/RolesPage.tsx
```typescript
import { useState } from 'react';
import { useRoles, useToggleRoleStatus } from '../hooks/useRoles';
import { RoleFormModal } from '../components/RoleFormModal';
import { Button } from '@/shared/components/ui/Button';
import { Plus, Edit, ToggleLeft, ToggleRight, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';
export function RolesPage() {
  const [includeDisabled, setIncludeDisabled] = useState(false);
  const { data: roles, isLoading } = useRoles(includeDisabled);
  const toggleMutation = useToggleRoleStatus();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const handleAdd = () => {
    setEditingRoleId(null);
    setIsModalOpen(true);
  };
  const handleEdit = (id: string) => {
    setEditingRoleId(id);
    setIsModalOpen(true);
  };
  return (
    <div className="space-y-8">
      {}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-10"></div>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
            <ShieldAlert size={24} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">إدارة الأدوار والصلاحيات</h1>
            <p className="text-slate-500 mt-1.5 text-sm font-medium">التحكم في مجموعات الصلاحيات المتاحة في النظام وتخصيص وصول المستخدمين.</p>
          </div>
        </div>
        <div className="flex gap-4 items-center shrink-0">
          <label className="flex items-center gap-2 cursor-pointer bg-slate-50 hover:bg-slate-100 px-4 py-2.5 rounded-xl border border-slate-200 transition-colors">
            <input
              type="checkbox"
              checked={includeDisabled}
              onChange={(e) => setIncludeDisabled(e.target.checked)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
            />
            <span className="text-sm font-bold text-slate-600">إظهار المعطلة</span>
          </label>
          <Button onClick={handleAdd} className="gap-2 shadow-indigo-500/20 shadow-lg px-6 h-12 bg-indigo-600 hover:bg-indigo-700">
            <Plus size={18} /> إضافة دور جديد
          </Button>
        </div>
      </div>
      {}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {isLoading ? (
          <div className="p-16 flex flex-col items-center justify-center space-y-4">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium">جاري التحميل...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="p-5 px-8 font-bold text-slate-600 text-sm tracking-wide">اسم الدور</th>
                  <th className="p-5 font-bold text-slate-600 text-sm tracking-wide">الحالة</th>
                  <th className="p-5 px-8 font-bold text-slate-600 text-sm tracking-wide w-40 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {roles?.map(role => (
                  <tr key={role.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-5 px-8">
                      <p className="font-bold text-slate-800 text-base">{role.name}</p>
                      <p className="text-[13px] text-slate-400 mt-0.5 font-medium font-mono">ID: {role.id.slice(0, 8)}...</p>
                    </td>
                    <td className="p-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-bold border ${role.isDeleted ? 'bg-red-50 text-red-700 border-red-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>
                        {role.isDeleted ? <XCircle size={14} /> : <CheckCircle2 size={14} />}
                        {role.isDeleted ? 'معطل' : 'نشط'}
                      </span>
                    </td>
                    <td className="p-5 px-8 flex items-center justify-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(role.id)} title="تعديل الدور" className="bg-white border border-slate-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Edit size={18} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => toggleMutation.mutate(role.id)} title={role.isDeleted ? 'تفعيل الدور' : 'تعطيل الدور'} className="bg-white border border-slate-200 hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
                        {role.isDeleted ? (
                          <ToggleLeft size={22} className="text-slate-400" />
                        ) : (
                          <ToggleRight size={22} className="text-emerald-500" />
                        )}
                      </Button>
                    </td>
                  </tr>
                ))}
                {roles?.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-16 text-center text-slate-500 font-medium text-lg">
                      لا توجد أدوار مسجلة بعد.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <RoleFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        roleId={editingRoleId}
      />
    </div>
  );
}
```

## File: src/features/admin/pages/UsersPage.tsx
```typescript
import { useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import { UserFormModal } from '../components/UserFormModal';
import { UsersPageHeader } from '../components/UsersPageHeader';
import { UsersTable } from '../components/UsersTable';
export function UsersPage() {
  const { data: users, isLoading } = useUsers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const handleAdd = () => {
    setEditingUserId(null);
    setIsModalOpen(true);
  };
  const handleEdit = (id: string) => {
    setEditingUserId(id);
    setIsModalOpen(true);
  };
  return (
    <div className="space-y-8">
      <UsersPageHeader onAddUser={handleAdd} />
      <UsersTable
        users={users}
        isLoading={isLoading}
        onEdit={handleEdit}
      />
      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userId={editingUserId}
      />
    </div>
  );
}
```

## File: src/features/admin/schemas/roleSchemas.ts
```typescript
import { z } from 'zod';
export interface RoleResponse {
  id: string;
  name: string;
  isDeleted: boolean;
}
export interface RoleDetailResponse {
  id: string;
  name: string;
  isDeleted: boolean;
  permissions: string[];
}
export const roleFormSchema = z.object({
  name: z.string().min(3, "اسم الدور يجب أن يكون 3 أحرف على الأقل").max(200),
  permissions: z.array(z.string()).min(1, "يجب اختيار صلاحية واحدة على الأقل"),
});
export type RoleFormData = z.infer<typeof roleFormSchema>;
export interface RoleRequest {
  name: string;
  permissions: string[];
}
```

## File: src/features/admin/schemas/userSchemas.ts
```typescript
import { z } from 'zod';
export interface UserResponse {
  id: string;
  username: string;
  roles: string[];
}
export const userFormSchema = z.object({
  username: z.string().min(3, "اسم المستخدم يجب أن يكون 3 أحرف على الأقل").max(100),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل").optional(),
  roles: z.array(z.string()).min(1, "يجب اختيار دور واحد على الأقل"),
});
export type UserFormData = z.infer<typeof userFormSchema>;
export interface CreateUserRequest {
  username: string;
  password?: string;
  roles: string[];
}
export interface UpdateUserRequest {
  username: string;
  roles: string[];
}
```

## File: src/features/auth/api/AuthApi.ts
```typescript
import { apiClient } from '@/lib/axios';
import { IAuthRepository, AuthResponse, RefreshTokenRequest } from '@/core/repositories/IAuthRepository';
import { LoginFormData } from '../schemas/loginSchema';
export class AuthRepository implements IAuthRepository {
  async login(data: LoginFormData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return response.data;
  }
  async refreshToken(data: RefreshTokenRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/refresh', data);
    return response.data;
  }
  async revokeRefreshToken(data: RefreshTokenRequest): Promise<void> {
    await apiClient.post('/auth/revoke-refresh-token', data);
  }
}
export const authRepository = new AuthRepository();
```

## File: src/features/auth/components/HasPermission.tsx
```typescript
import React from 'react';
import { useAuth } from '../hooks/useAuth';
interface HasPermissionProps {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}
export function HasPermission({ permission, children, fallback = null }: HasPermissionProps) {
  const { hasPermission } = useAuth();
  if (hasPermission(permission)) {
    return <>{children}</>;
  }
  return <>{fallback}</>;
}
```

## File: src/features/auth/components/LoginForm.tsx
```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "../schemas/loginSchema";
import { useLogin } from "../hooks/useAuth";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { tokens } from "@/shared/styles/tokens";
export function LoginForm() {
  const { mutate: login, isPending } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  const onSubmit = (data: LoginFormData) => login(data);
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">
      {}
      <div>
        <label className={tokens.font.label + " block mb-1.5"}>
          اسم المستخدم
        </label>
        <input
          id="userName"
          type="text"
          {...register("userName")}
          placeholder="admin"
          autoComplete="username"
          className={tokens.input + " bg-gray-50 focus:bg-white transition-colors"}
          dir="ltr"
        />
        {errors.userName && (
          <p className="text-red-500 text-xs mt-1">{errors.userName.message}</p>
        )}
      </div>
      {}
      <div>
        <label className={tokens.font.label + " block mb-1.5"}>
          كلمة المرور
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            {...register("password")}
            placeholder="••••••••"
            autoComplete="current-password"
            className={tokens.input + " bg-gray-50 focus:bg-white transition-colors pl-10"}
            dir="ltr"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
        )}
      </div>
      {}
      <button
        type="submit"
        disabled={isPending}
        className={tokens.btn.primary + " w-full py-2.5 justify-center flex items-center gap-2 disabled:opacity-60 mt-2"}
      >
        {isPending ? (
          <>
            <Loader2 size={17} className="animate-spin" />
            جاري تسجيل الدخول...
          </>
        ) : (
          "تسجيل الدخول"
        )}
      </button>
    </form>
  );
}
```

## File: src/features/auth/hooks/useAuth.tsx
```typescript
import { createContext, useContext, useState, ReactNode } from "react";
import { useMutation } from "@tanstack/react-query";
import { authRepository } from "../api/AuthApi";
import { LoginFormData } from "../schemas/loginSchema";
import { toast } from "sonner";
import { storage } from "@/lib/storage";
import { getApiErrorMessage } from "@/shared/utils/apiError";
interface AuthContextType {
  isAuthenticated: boolean;
  permissions: string[];
  roles: string[];
  logout: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!storage.getToken());
  const [permissions, setPermissions] = useState<string[]>(
    isAuthenticated ? storage.getPermissions() : []
  );
  const [roles, setRoles] = useState<string[]>(
    isAuthenticated ? storage.getRoles() : []
  );
  const logout = async () => {
    try {
      const token = storage.getToken();
      const refreshToken = storage.getRefreshToken();
      if (token && refreshToken) {
        await authRepository.revokeRefreshToken({ token, refreshToken });
      }
    } catch (err) {
      console.error("Failed to revoke token on logout", err);
    } finally {
      storage.clearToken();
      storage.clearRefreshToken();
      storage.clearPermissions();
      storage.clearRoles();
      setIsAuthenticated(false);
      setPermissions([]);
      setRoles([]);
      window.location.href = '/login';
    }
  };
  const hasPermission = (permission: string) => {
    return permissions.includes(permission) || roles.includes("Admin");
  };
  const hasRole = (role: string) => {
    return roles.includes(role);
  };
  const hasAnyRole = (allowedRoles: string[]) => {
    return allowedRoles.some(r => roles.includes(r));
  };
  return (
    <AuthContext.Provider value={{ isAuthenticated, permissions, roles, logout, hasPermission, hasRole, hasAnyRole }}>
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
export function useLogin() {
  return useMutation({
    mutationFn: (data: LoginFormData) => authRepository.login(data),
    onSuccess: (data) => {
      toast.success("تم تسجيل الدخول بنجاح!");
      storage.setToken(data.token);
      if (data.refreshToken) {
        storage.setRefreshToken(data.refreshToken);
      }
      const perms = data.permissions || [];
      const userRoles = data.role || [];
      storage.setPermissions(perms);
      storage.setRoles(userRoles);
      window.location.href = '/';
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, "فشل تسجيل الدخول. تأكد من البيانات."));
    },
  });
}
```

## File: src/features/auth/pages/LoginPage.tsx
```typescript
import { LoginForm } from "@/features/auth/components/LoginForm";
export function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4">
      <div className="w-full max-w-md">
        {}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-lg mb-4">
            <span className="text-white text-2xl font-bold">س</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">سنترالي</h1>
          <p className="text-gray-500 text-sm mt-1">
            نظام إدارة الأعمال الذكية
          </p>
        </div>
        {}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800">مرحباً بك</h2>
            <p className="text-sm text-gray-500 mt-1">
              قم بتسجيل الدخول للوصول إلى لوحة التحكم
            </p>
          </div>
          <LoginForm />
        </div>
        {}
        <p className="text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} سنترالي — جميع الحقوق محفوظة
        </p>
      </div>
    </div>
  );
}
```

## File: src/features/auth/schemas/loginSchema.ts
```typescript
import * as z from "zod";
export const loginSchema = z.object({
  userName: z.string().min(1, "اسم المستخدم مطلوب"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});
export type LoginFormData = z.infer<typeof loginSchema>;
```

## File: src/features/auth/schemas/permissions.ts
```typescript
export const Permissions = {
  InventoryRead: 'inventory:read',
  InventoryWrite: 'inventory:write',
  MaintenanceRead: 'maintenance:read',
  MaintenanceWrite: 'maintenance:write',
  SalesRead: 'sales:read',
  SalesWrite: 'sales:write',
  PurchasesRead: 'purchases:read',
  PurchasesWrite: 'purchases:write',
  SuppliersRead: 'suppliers:read',
  SuppliersWrite: 'suppliers:write',
  CustomersRead: 'customers:read',
  CustomersWrite: 'customers:write',
  FinanceRead: 'finance:read',
  FinanceWrite: 'finance:write',
  WalletsRead: 'wallets:read',
  WalletsWrite: 'wallets:write',
  UsersRead: 'users:read',
  UsersWrite: 'users:write',
  RolesRead: 'roles:read',
  RolesWrite: 'roles:write',
  Admin: 'admin',
} as const;
export type Permission = (typeof Permissions)[keyof typeof Permissions];
```

## File: src/index.css
```css
@import "tailwindcss";
@layer base {
  :root {
    --color-primary: #2563eb;
    --color-primary-hover: #1d4ed8;
    --color-page-bg: #f8fafc;
    --color-surface: #ffffff;
    --color-text-main: #374151;
    --color-text-muted: #6b7280;
    --color-sidebar-bg: #0f172a;
    --color-sidebar-logo: #020617;
    --color-sidebar-border: #1e293b;
    --color-sidebar-text: #cbd5e1;
    --color-border: #d1d5db;
    --color-danger: #ef4444;
  }
  * {
    box-sizing: border-box;
  }
  html, body {
    height: 100%;
    margin: 0;
    padding: 0;
  }
  body {
    font-family: 'Cairo', sans-serif;
    background-color: #f8fafc;
    color: #374151;
    direction: rtl;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 9999px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
}
```

## File: src/setupTests.ts
```typescript
import '@testing-library/jest-dom';
```

## File: src/vite-env.d.ts
```typescript

```

## File: vite.config.ts
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
})
```
