import type { Admin } from '@/types/admin';
import { createContext, useContext, useState, type ReactNode } from 'react';

interface AuthContextValue {
  admin: Admin | null;
  clearAdmin: () => void;
  setAdmin: (admin: Admin) => void;
}

const AuthContext = createContext<AuthContextValue>({
  admin: null,
  clearAdmin: () => {},
  setAdmin: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
  admin: Admin | null;
}

export const AuthProvider = ({
  children,
  admin: adminProp,
}: AuthProviderProps) => {
  const [admin, setAdmin] = useState(adminProp);

  const clearAdmin = () => setAdmin(null);

  return (
    <AuthContext value={{ admin, setAdmin, clearAdmin }}>
      {children}
    </AuthContext>
  );
};

export const useAuth = () => useContext(AuthContext);
