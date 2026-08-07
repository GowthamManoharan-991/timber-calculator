import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/authService';
import { ROLES } from '../utils/constants';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const current = await authService.getCurrentUser();
        setUser(current);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (username, password) => {
    const loggedIn = await authService.login(username, password);
    setUser(loggedIn);
    return loggedIn;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const hasRole = useCallback((role) => !!user && user.role === role, [user]);
  const isAdmin = !!user && user.role === ROLES.ADMIN;

  const value = useMemo(
    () => ({ user, loading, isAuthenticated: !!user, isAdmin, hasRole, login, logout }),
    [user, loading, isAdmin, hasRole, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
