import { Link, useLocation } from "react-router-dom";
import { 
  MonitorSmartphone, ShoppingCart, Wrench, Package, 
  Users, Wallet, Settings, LogOut, ShoppingBag,
  ChevronDown, ChevronUp, Grip, Zap, X
} from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useSidebarStore } from "@/shared/hooks/useSidebarStore";
import { useState } from "react";

type MenuItem = {
  name: string;
  path: string;
  icon: any;
  allowedRoles?: string[];
};

type MenuGroup = {
  title: string;
  items: MenuItem[];
  allowedRoles?: string[];
};

const SALES_ROLES = ["Admin", "Manager", "Salesperson"];
const INVENTORY_ROLES = ["Admin", "Manager", "Salesperson", "Technician"];
const PURCHASES_ROLES = ["Admin", "Manager"];
const MAINTENANCE_ROLES = ["Admin", "Manager", "Technician"];
const CUSTOMER_ROLES = ["Admin", "Manager", "Salesperson"];
const SUPPLIER_ROLES = ["Admin", "Manager"];
const DRAWER_EXPENSE_ROLES = ["Admin", "Manager", "Salesperson", "Technician"];
const ADMIN_MANAGER = ["Admin", "Manager"];

const menuGroups: MenuGroup[] = [
  {
    title: "الوصول السريع",
    allowedRoles: SALES_ROLES,
    items: [
      { name: "شاشة الكاشير (POS)", path: "/sales/pos", icon: MonitorSmartphone, allowedRoles: SALES_ROLES },
      { name: "عمليات المحافظ", path: "/operations/wallets", icon: Zap, allowedRoles: SALES_ROLES },
    ]
  },
  {
    title: "الصيانة",
    allowedRoles: MAINTENANCE_ROLES,
    items: [
      { name: "تذاكر الصيانة", path: "/maintenance", icon: Wrench, allowedRoles: MAINTENANCE_ROLES },
    ]
  },
  {
    title: "المبيعات",
    allowedRoles: SALES_ROLES,
    items: [
      { name: "سجل المبيعات", path: "/sales/history", icon: ShoppingCart, allowedRoles: SALES_ROLES },
      { name: "مرتجعات المبيعات", path: "/sales/returns", icon: ShoppingCart, allowedRoles: SALES_ROLES },
    ]
  },
  {
    title: "المشتريات",
    allowedRoles: PURCHASES_ROLES,
    items: [
      { name: "فاتورة مشتريات", path: "/purchases/new", icon: ShoppingBag, allowedRoles: PURCHASES_ROLES },
      { name: "سجل المشتريات", path: "/purchases/history", icon: ShoppingBag, allowedRoles: PURCHASES_ROLES },
      { name: "مرتجعات الموردين", path: "/purchases/returns", icon: ShoppingBag, allowedRoles: PURCHASES_ROLES },
    ]
  },
  {
    title: "المخزون",
    allowedRoles: INVENTORY_ROLES,
    items: [
      { name: "المنتجات", path: "/inventory/products", icon: Package, allowedRoles: INVENTORY_ROLES },
      { name: "التصنيفات", path: "/inventory/categories", icon: Package, allowedRoles: INVENTORY_ROLES },
    ]
  },
  {
    title: "جهات الاتصال",
    allowedRoles: SALES_ROLES,
    items: [
      { name: "العملاء", path: "/contacts/customers", icon: Users, allowedRoles: CUSTOMER_ROLES },
      { name: "الموردين", path: "/contacts/suppliers", icon: Users, allowedRoles: SUPPLIER_ROLES },
    ]
  },
  {
    title: "الماليات",
    allowedRoles: DRAWER_EXPENSE_ROLES,
    items: [
      { name: "الدرج والمصروفات", path: "/finance/drawer", icon: Wallet, allowedRoles: DRAWER_EXPENSE_ROLES },
      { name: "الخزينات", path: "/finance/safe", icon: Wallet, allowedRoles: ADMIN_MANAGER },
      { name: "المصروفات", path: "/finance/expenses", icon: Wallet, allowedRoles: DRAWER_EXPENSE_ROLES },
      { name: "معاملات المالك", path: "/finance/owner-transactions", icon: Wallet, allowedRoles: ADMIN_MANAGER },
    ]
  },
  {
    title: "الإدارة والصلاحيات",
    allowedRoles: ADMIN_MANAGER,
    items: [
      { name: "إدارة المستخدمين", path: "/admin/users", icon: Users, allowedRoles: ADMIN_MANAGER },
      { name: "الأدوار والصلاحيات", path: "/admin/roles", icon: Settings, allowedRoles: ADMIN_MANAGER },
    ]
  }
];

export function Sidebar() {
  const location = useLocation();
  const { logout, hasAnyRole } = useAuth();
  const { isOpen, toggle } = useSidebarStore();
  
  const [collapsedGroups, setCollapsedGroups] = useState<Record<number, boolean>>({});

  const toggleGroup = (index: number) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const closeOnMobile = () => {
    if (window.innerWidth < 768 && isOpen) {
      toggle();
    }
  };

  return (
    <aside className={`${isOpen ? 'translate-x-0 w-64' : 'translate-x-full md:translate-x-0 md:w-20'} transition-all duration-300 bg-[#F1F5F9] text-slate-900 flex flex-col h-screen fixed right-0 top-0 border-l border-slate-200 flex-shrink-0 z-50 shadow-[rgba(0,0,0,0.04)_inset_0px_0px_0px,rgba(0,0,0,0.05)_-4px_0px_10px]`}>

      {/* Logo Area */}
      <div className="h-20 flex items-center justify-between border-b border-slate-200 bg-[#F1F5F9] shrink-0 relative overflow-hidden px-4">
        {isOpen ? (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggle}
                className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 flex items-center justify-center shadow-md shadow-blue-600/20 text-white transition-all cursor-pointer focus:outline-none"
                title="طي / فتح القائمة"
              >
                <Grip className="w-6 h-6 text-white" />
              </button>
              <h1 className="text-2xl font-extrabold text-slate-800 tracking-wide select-none">
                سنترالي
              </h1>
            </div>
            {/* Close button for mobile */}
            <button
              type="button"
              onClick={toggle}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
              title="إغلاق القائمة"
              aria-label="إغلاق القائمة"
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={toggle}
            className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 flex items-center justify-center shadow-md shadow-blue-600/20 text-white transition-all cursor-pointer mx-auto focus:outline-none"
            title="توسيع القائمة"
          >
            <Grip className="w-6 h-6 text-white" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-4 custom-scrollbar" dir="rtl">
        {menuGroups.map((group, gi) => {
          const visibleItems = group.items.filter((item) => !item.allowedRoles || hasAnyRole(item.allowedRoles));
          if (visibleItems.length === 0) return null;
          if (group.allowedRoles && !hasAnyRole(group.allowedRoles)) return null;
          
          const isCollapsed = collapsedGroups[gi];

          return (
          <div key={gi} className="mb-6">
            <div 
              onClick={() => isOpen && toggleGroup(gi)}
              className={`${isOpen ? 'cursor-pointer hover:text-slate-800' : ''} flex items-center justify-between px-3 mb-2 text-slate-400 group transition-colors`}
            >
              <h3 className={`${isOpen ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'} text-[13px] font-bold uppercase tracking-wider transition-all duration-300 select-none`}>
                {group.title}
              </h3>
              {isOpen && (
                <div className="text-slate-400 group-hover:text-slate-600 transition-colors">
                  {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                </div>
              )}
            </div>
            
            {!isOpen && gi > 0 && <div className="h-5"></div>}

            <ul className={`${isCollapsed && isOpen ? 'hidden' : 'block'} space-y-1.5`}>
              {visibleItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={closeOnMobile}
                      title={!isOpen ? item.name : undefined}
                      className={`${isOpen ? 'gap-3 px-3.5' : 'justify-center px-0'} flex items-center py-3 rounded-xl transition-all duration-200 text-[15px] font-semibold relative ${active ? "bg-white text-blue-700 shadow-sm border border-slate-200/60" : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 border border-transparent"}`}
                    >
                      <item.icon size={22} strokeWidth={active ? 2.5 : 2} className={`${active ? "text-blue-600" : "text-slate-500"} shrink-0`} />
                      <span className={`${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 hidden'} transition-all duration-300 whitespace-nowrap`}>
                        {item.name}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          );
        })}

        {hasAnyRole(ADMIN_MANAGER) && (
          <div className="border-t border-slate-200 pt-6 mt-3 mb-3 space-y-1.5">
            <Link
              to="/settings/finance-policies"
              onClick={closeOnMobile}
              title={!isOpen ? "سياسات النظام" : undefined}
              className={`${isOpen ? 'gap-3 px-3.5' : 'justify-center px-0'} flex items-center py-3 rounded-xl transition-all duration-200 text-[15px] font-semibold relative ${location.pathname === "/settings/finance-policies" ? "bg-white text-blue-700 shadow-sm border border-slate-200/60" : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 border border-transparent"}`}
            >
              <Settings size={22} strokeWidth={location.pathname === "/settings/finance-policies" ? 2.5 : 2} className={`${location.pathname === "/settings/finance-policies" ? "text-blue-600" : "text-slate-500"} shrink-0`} />
              <span className={`${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 hidden'} transition-all duration-300 whitespace-nowrap`}>
                سياسات النظام
              </span>
            </Link>
            
            <Link
              to="/settings/wallets"
              onClick={closeOnMobile}
              title={!isOpen ? "إدارة المحافظ" : undefined}
              className={`${isOpen ? 'gap-3 px-3.5' : 'justify-center px-0'} flex items-center py-3 rounded-xl transition-all duration-200 text-[15px] font-semibold relative ${location.pathname === "/settings/wallets" ? "bg-white text-blue-700 shadow-sm border border-slate-200/60" : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 border border-transparent"}`}
            >
              <Wallet size={22} strokeWidth={location.pathname === "/settings/wallets" ? 2.5 : 2} className={`${location.pathname === "/settings/wallets" ? "text-blue-600" : "text-slate-500"} shrink-0`} />
              <span className={`${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 hidden'} transition-all duration-300 whitespace-nowrap`}>
                إدارة المحافظ
              </span>
            </Link>
          </div>
        )}
      </div>

      {/* Footer Area */}
      <div className={`${!isOpen ? 'flex justify-center' : ''} p-4 border-t border-slate-200 bg-transparent shrink-0`}>
        <button
          onClick={logout}
          title={!isOpen ? "تسجيل الخروج" : undefined}
          className={`${isOpen ? 'gap-3 px-4 w-full' : 'justify-center w-12'} flex items-center py-3 rounded-xl text-red-500 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all duration-200 text-[15px] font-bold group`}
        >
          <LogOut size={22} className="shrink-0 group-hover:scale-110 transition-transform" />
          <span className={`${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 hidden'} transition-all duration-300 whitespace-nowrap`}>
            تسجيل الخروج
          </span>
        </button>
      </div>
    </aside>
  );
}
