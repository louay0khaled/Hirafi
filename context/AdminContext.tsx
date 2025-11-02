import React, { createContext, useState, useEffect, ReactNode } from 'react';

// Simplified User object for context. Can be a boolean or a simple object.
// Using a simple object to maintain consistency with original code structure.
type User = { loggedIn: true };

interface AdminContextType {
  user: User | null;
  login: (password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

export const AdminContext = createContext<AdminContextType>({
  user: null,
  login: async () => ({ success: false, error: 'Provider not initialized' }),
  logout: async () => {},
});

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Check localStorage for a saved session on initial load
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (isLoggedIn === 'true') {
      setUser({ loggedIn: true });
    }
  }, []);

  const login = async (password: string) => {
    // This is where you can check against a password.
    // For this example, we'll use a simple hardcoded password.
    const ADMIN_PASSWORD = 'admin';

    if (password === ADMIN_PASSWORD) {
      setUser({ loggedIn: true });
      localStorage.setItem('isAdminLoggedIn', 'true');
      return { success: true };
    } else {
      return { success: false, error: "كلمة المرور غير صحيحة." };
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('isAdminLoggedIn');
  };

  return (
    <AdminContext.Provider value={{ user, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
};
