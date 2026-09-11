import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { queryClient } from "./lib/queryClient";
import { AuthProvider, useAuth } from "./features/auth/hooks/useAuth";
import { FinancePoliciesPage } from './features/finance/pages/FinancePoliciesPage';
import { AppLayout } from "./shared/components/layout/AppLayout";
import { PageLoader } from "./shared/components/ui/PageLoader";
import { FeatureBoundaryLayout } from "./shared/components/errors/FeatureBoundaryLayout";
// Lazy Loaded Pages
const LoginPage = lazy(() => import("./features/auth/pages/LoginPage").then(module => ({ default: module.LoginPage })));
const DashboardPage = lazy(() => import("./features/dashboard/pages/DashboardPage").then(module => ({ default: module.DashboardPage })));
const ProductsPage = lazy(() => import("./features/inventory/pages/ProductsPage").then(module => ({ default: module.ProductsPage })));
const ProductDetailsPage = lazy(() => import("./features/inventory/pages/ProductDetailsPage").then(module => ({ default: module.ProductDetailsPage })));
const CategoriesPage = lazy(() => import("./features/inventory/pages/CategoriesPage").then(module => ({ default: module.CategoriesPage })));
const PosPage = lazy(() => import("./features/sales/pages/PosPage").then(module => ({ default: module.PosPage })));
const SalesHistoryPage = lazy(() => import("./features/sales/pages/SalesHistoryPage").then(module => ({ default: module.SalesHistoryPage })));
const SalesReturnsPage = lazy(() => import("./features/sales/pages/SalesReturnsPage").then(module => ({ default: module.SalesReturnsPage })));
const NewSalesReturnPage = lazy(() => import("./features/sales/pages/NewSalesReturnPage").then(module => ({ default: module.NewSalesReturnPage })));
const PurchasesHistoryPage = lazy(() => import("./features/purchases/pages/PurchasesHistoryPage").then(module => ({ default: module.PurchasesHistoryPage })));
const NewPurchasePage = lazy(() => import("./features/purchases/pages/NewPurchasePage").then(module => ({ default: module.NewPurchasePage })));
const PurchaseInvoiceDetailsPage = lazy(() => import("./features/purchases/pages/PurchaseInvoiceDetailsPage").then(module => ({ default: module.PurchaseInvoiceDetailsPage })));
const SupplierReturnsPage = lazy(() => import("./features/purchases/pages/SupplierReturnsPage").then(module => ({ default: module.SupplierReturnsPage })));
const SupplierReturnDetailsPage = lazy(() => import("./features/purchases/pages/SupplierReturnDetailsPage").then(module => ({ default: module.SupplierReturnDetailsPage })));
const NewSupplierReturnPage = lazy(() => import("./features/purchases/pages/NewSupplierReturnPage").then(module => ({ default: module.NewSupplierReturnPage })));
const CustomersPage = lazy(() => import("./features/contacts/pages/CustomersPage").then(module => ({ default: module.CustomersPage })));
const CustomerDetailsPage = lazy(() => import("./features/contacts/pages/CustomerDetailsPage").then(module => ({ default: module.CustomerDetailsPage })));
const SuppliersPage = lazy(() => import("./features/suppliers/pages/SuppliersPage").then(module => ({ default: module.SuppliersPage })));
const SupplierDetailsPage = lazy(() => import("./features/suppliers/pages/SupplierDetailsPage").then(module => ({ default: module.SupplierDetailsPage })));
const DrawerPage = lazy(() => import("./features/finance/pages/DrawerPage").then(module => ({ default: module.DrawerPage })));
const DrawerHistoryPage = lazy(() => import("./features/finance/pages/DrawerHistoryPage").then(module => ({ default: module.DrawerHistoryPage })));
const DrawerSessionDetailsPage = lazy(() => import("./features/finance/pages/DrawerSessionDetailsPage").then(module => ({ default: module.DrawerSessionDetailsPage })));
const SafePage = lazy(() => import("./features/finance/pages/SafePage").then(module => ({ default: module.SafePage })));
const ExpensesPage = lazy(() => import("./features/finance/pages/ExpensesPage").then(module => ({ default: module.ExpensesPage })));
const OwnerTransactionsPage = lazy(() => import("./features/finance/pages/OwnerTransactionsPage").then(module => ({ default: module.OwnerTransactionsPage })));
const WalletsAdminPage = lazy(() => import("./features/wallets/pages/WalletsAdminPage").then(module => ({ default: module.WalletsAdminPage })));
const WalletOperationsPage = lazy(() => import("./features/wallets/pages/WalletOperationsPage").then(module => ({ default: module.WalletOperationsPage })));
const WalletDetailsPage = lazy(() => import("./features/wallets/pages/WalletDetailsPage").then(module => ({ default: module.WalletDetailsPage })));
const MaintenancePage = lazy(() => import("./features/maintenance/pages/MaintenancePage").then(module => ({ default: module.MaintenancePage })));

const UsersPage = lazy(() => import("./features/admin/pages/UsersPage").then(module => ({ default: module.UsersPage })));
const RolesPage = lazy(() => import("./features/admin/pages/RolesPage").then(module => ({ default: module.RolesPage })));

// Guard: redirects to /login if not authenticated, and checks permissions
function ProtectedRoute({ children, requiredPermissions = [] }: { children: React.ReactNode, requiredPermissions?: string[] }) {
  const { isAuthenticated, hasPermission } = useAuth();
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (requiredPermissions.length > 0) {
    const hasAll = requiredPermissions.every(p => hasPermission(p));
    if (!hasAll) {
      return (
        <div className="flex h-screen items-center justify-center bg-gray-50 flex-col gap-4 px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-800">غير مصرح لك بالدخول</h1>
          <p className="text-gray-500">لا تملك الصلاحيات الكافية للوصول إلى هذه الصفحة.</p>
          <Link to="/" className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
            العودة للرئيسية
          </Link>
        </div>
      );
    }
  }

  return <>{children}</>;
}

// Placeholder for routes not yet built
function ComingSoon({ label }: { label: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
      <p className="text-gray-400 text-sm">{label} — هذه الصفحة قيد الإنشاء...</p>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Toaster position="top-center" richColors />
          
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public */}
              <Route path="/login" element={<LoginPage />} />

              {/* Protected Ã¢â‚¬â€ wrapped in AppLayout */}
              <Route
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/" element={<DashboardPage />} />

                <Route element={<FeatureBoundaryLayout featureName="المبيعات" />}>
                  <Route path="/sales/pos"          element={<ProtectedRoute requiredPermissions={["Admin", "Manager", "Salesperson"]}><PosPage /></ProtectedRoute>} />
                  <Route path="/sales/history"      element={<ProtectedRoute requiredPermissions={["Admin", "Manager", "Salesperson"]}><SalesHistoryPage /></ProtectedRoute>} />
                  <Route path="/sales/returns"      element={<ProtectedRoute requiredPermissions={["Admin", "Manager", "Salesperson"]}><SalesReturnsPage /></ProtectedRoute>} />
                  <Route path="/sales/returns/new"  element={<ProtectedRoute requiredPermissions={["Admin", "Manager", "Salesperson"]}><NewSalesReturnPage /></ProtectedRoute>} />
                </Route>

                <Route element={<FeatureBoundaryLayout featureName="المشتريات" />}>
                  <Route path="/purchases/new"      element={<ProtectedRoute requiredPermissions={["Admin", "Manager"]}><NewPurchasePage /></ProtectedRoute>} />
                  <Route path="/purchases/history"  element={<ProtectedRoute requiredPermissions={["Admin", "Manager"]}><PurchasesHistoryPage /></ProtectedRoute>} />
                  <Route path="/purchases/returns"  element={<ProtectedRoute requiredPermissions={["Admin", "Manager"]}><SupplierReturnsPage /></ProtectedRoute>} />
                  <Route path="/purchases/returns/new" element={<ProtectedRoute requiredPermissions={["Admin", "Manager"]}><NewSupplierReturnPage /></ProtectedRoute>} />
                  <Route path="/purchases/returns/:id" element={<ProtectedRoute requiredPermissions={["Admin", "Manager"]}><SupplierReturnDetailsPage /></ProtectedRoute>} />
                  <Route path="/purchases/:id"      element={<ProtectedRoute requiredPermissions={["Admin", "Manager"]}><PurchaseInvoiceDetailsPage /></ProtectedRoute>} />
                </Route>

                <Route element={<FeatureBoundaryLayout featureName="المخزون" />}>
                  <Route path="/inventory/products"   element={<ProtectedRoute requiredPermissions={["Admin", "Manager", "Salesperson", "Technician"]}><ProductsPage /></ProtectedRoute>} />
                  <Route path="/inventory/products/:id" element={<ProtectedRoute requiredPermissions={["Admin", "Manager", "Salesperson", "Technician"]}><ProductDetailsPage /></ProtectedRoute>} />
                  <Route path="/inventory/categories" element={<ProtectedRoute requiredPermissions={["Admin", "Manager", "Salesperson", "Technician"]}><CategoriesPage /></ProtectedRoute>} />
                </Route>

                <Route element={<FeatureBoundaryLayout featureName="جهات الاتصال" />}>
                  <Route path="/contacts/customers" element={<ProtectedRoute requiredPermissions={["Admin", "Manager", "Salesperson"]}><CustomersPage /></ProtectedRoute>} />
                  <Route path="/contacts/customers/:id" element={<ProtectedRoute requiredPermissions={["Admin", "Manager", "Salesperson"]}><CustomerDetailsPage /></ProtectedRoute>} />
                  <Route path="/contacts/suppliers" element={<ProtectedRoute requiredPermissions={["Admin", "Manager"]}><SuppliersPage /></ProtectedRoute>} />
                  <Route path="/contacts/suppliers/:id" element={<ProtectedRoute requiredPermissions={["Admin", "Manager"]}><SupplierDetailsPage /></ProtectedRoute>} />
                </Route>

                <Route element={<FeatureBoundaryLayout featureName="الماليات" />}>
                  <Route path="/finance/drawer"   element={<ProtectedRoute requiredPermissions={["Admin", "Manager", "Salesperson", "Technician"]}><DrawerPage /></ProtectedRoute>} />
                  <Route path="/finance/drawer/history" element={<ProtectedRoute requiredPermissions={["Admin", "Manager", "Salesperson", "Technician"]}><DrawerHistoryPage /></ProtectedRoute>} />
                  <Route path="/finance/drawer/history/:id" element={<ProtectedRoute requiredPermissions={["Admin", "Manager", "Salesperson", "Technician"]}><DrawerSessionDetailsPage /></ProtectedRoute>} />
                  <Route path="/finance/safe"     element={<ProtectedRoute requiredPermissions={["Admin", "Manager", "Salesperson", "Technician"]}><SafePage /></ProtectedRoute>} />
                  <Route path="/finance/expenses" element={<ProtectedRoute requiredPermissions={["Admin", "Manager", "Salesperson", "Technician"]}><ExpensesPage /></ProtectedRoute>} />
                  <Route path="/finance/owner-transactions" element={<ProtectedRoute requiredPermissions={["Admin", "Manager", "Salesperson", "Technician"]}><OwnerTransactionsPage /></ProtectedRoute>} />
                  <Route path="/operations/wallets" element={<ProtectedRoute requiredPermissions={["Admin", "Manager"]}><WalletOperationsPage /></ProtectedRoute>} />
                </Route>

                <Route element={<FeatureBoundaryLayout featureName="الصيانة" />}>
                  <Route path="/maintenance" element={<ProtectedRoute requiredPermissions={["Admin", "Manager", "Technician"]}><MaintenancePage /></ProtectedRoute>} />
                </Route>

                <Route element={<FeatureBoundaryLayout featureName="الإدارة والصلاحيات" />}>
                  <Route path="/admin/users" element={<ProtectedRoute requiredPermissions={["Admin", "Manager"]}><UsersPage /></ProtectedRoute>} />
                  <Route path="/admin/roles" element={<ProtectedRoute requiredPermissions={["Admin", "Manager"]}><RolesPage /></ProtectedRoute>} />
                </Route>

                <Route path="/settings" element={<ComingSoon label="الإعدادات" />} />
                <Route path="/settings/finance-policies" element={<ProtectedRoute requiredPermissions={["Admin", "Manager", "Salesperson", "Technician"]}><FinancePoliciesPage /></ProtectedRoute>} />
                <Route path="/settings/wallets" element={<ProtectedRoute requiredPermissions={["Admin", "Manager"]}><WalletsAdminPage /></ProtectedRoute>} />
                <Route path="/wallets/:id" element={<ProtectedRoute requiredPermissions={["Admin", "Manager", "Salesperson"]}><WalletDetailsPage /></ProtectedRoute>} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}









