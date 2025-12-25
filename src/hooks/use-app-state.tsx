'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import Cookies from 'js-cookie';

export type Role = 'student' | 'teacher';

interface AppStateContextType {
  role: Role;
  setRole: (role: Role) => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>(() => {
    const savedRole = Cookies.get('app-role');
    return (savedRole as Role) || 'student';
  });

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    Cookies.set('app-role', newRole, { expires: 7 }); // Cookie expires in 7 days
  };

  return (
    <AppStateContext.Provider value={{ role, setRole }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}
