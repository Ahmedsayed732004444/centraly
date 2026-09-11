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
