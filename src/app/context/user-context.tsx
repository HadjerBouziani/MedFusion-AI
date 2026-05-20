import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type UserRole = 'doctor' | 'ai-team';

interface UserContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<UserRole>(() => {
    const saved = localStorage.getItem('userRole');
    return (saved as UserRole) || 'doctor';
  });

  const [user] = useState({
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@hospital.com',
    avatar: 'SJ',
  });

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem('userRole', newRole);
  };

  useEffect(() => {
    localStorage.setItem('userRole', role);
  }, [role]);

  return (
    <UserContext.Provider value={{ role, setRole, user }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}
