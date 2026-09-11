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

// Where each role lands right after login, instead of everyone seeing the manager-facing
// dashboard first. A user can hold more than one role, so this is priority order, not a
// lookup: Admin/Manager always get the dashboard even if also flagged Salesperson, etc.
function resolvePostLoginPath(roles: string[]): string {
  if (roles.includes('Admin') || roles.includes('Manager')) return '/';
  // The live role is named "Sales" in this database (not the "Salesperson" name the
  // rest of the app's role-gating checks for) - matching both here so this redirect
  // works regardless of which name ends up being the long-term one.
  if (roles.includes('Salesperson') || roles.includes('Sales')) return '/sales/pos';
  if (roles.includes('Technician')) return '/maintenance';
  return '/';
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

      window.location.href = resolvePostLoginPath(userRoles);
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, "فشل تسجيل الدخول. تأكد من البيانات."));
    },
  });
}
