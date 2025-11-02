import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
import { AuthChangeEvent, Session, User } from '@supabase/supabase-js';

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

  useEffect(() => {
    // Check for an active session on initial load
    const getSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
    };
    getSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user ?? null);
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Use a hardcoded email for simplicity, as the original UI only had a password field.
  // IMPORTANT: The user must create a user in Supabase Auth with this exact email.
  const ADMIN_EMAIL = 'admin@hirafi.app';

  const login = async (password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password: password,
    });
    if (error) {
        console.error("Login failed:", error.message);
        // Provide a user-friendly error message
        if (error.message.includes('Invalid login credentials')) {
            return { success: false, error: "كلمة المرور غير صحيحة." };
        }
        return { success: false, error: "فشل تسجيل الدخول. يرجى المحاولة مرة أخرى." };
    }
    return { success: true };
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    // The "Auth session missing!" error can be ignored because it means the user is already signed out.
    if (error && error.message !== 'Auth session missing!') {
        console.error("Logout failed:", error.message);
    }
  };

  return (
    <AdminContext.Provider value={{ user, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
};