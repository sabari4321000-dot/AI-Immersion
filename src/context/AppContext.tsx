import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, UserProfile } from '../types';
import { storage, DEMO_USERS } from '../services/storage';

export type PageId =
  | 'dashboard'
  | 'students'
  | 'attendance'
  | 'assignments'
  | 'timetable'
  | 'ai-assistant'
  | 'announcements'
  | 'reports'
  | 'settings'
  | 'login';

export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  currentRole: UserRole;
  currentUser: UserProfile;
  setRole: (role: UserRole) => void;
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toasts: ToastItem[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  dataVersion: number;
  triggerRefresh: () => void;
  isAiAvailable: boolean;
  checkAiStatus: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRoleState] = useState<UserRole>(() => storage.getCurrentRole());
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEMO_USERS[currentRole] || DEMO_USERS.faculty);
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [dataVersion, setDataVersion] = useState(1);
  const [isAiAvailable, setIsAiAvailable] = useState(false);

  const checkAiStatus = async () => {
    try {
      const res = await fetch('/api/status');
      if (res.ok) {
        const data = await res.json();
        setIsAiAvailable(Boolean(data.hasGeminiKey));
      } else {
        setIsAiAvailable(false);
      }
    } catch {
      setIsAiAvailable(false);
    }
  };

  useEffect(() => {
    checkAiStatus();
  }, []);

  const setRole = (role: UserRole) => {
    setCurrentRoleState(role);
    storage.setCurrentRole(role);
    setCurrentUser(DEMO_USERS[role] || DEMO_USERS.faculty);
    showToast(`Switched perspective to ${role.toUpperCase()} (${DEMO_USERS[role]?.name})`, 'info');
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const triggerRefresh = () => {
    setDataVersion((v) => v + 1);
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        currentUser,
        setRole,
        currentPage,
        setCurrentPage,
        sidebarOpen,
        setSidebarOpen,
        toasts,
        showToast,
        removeToast,
        dataVersion,
        triggerRefresh,
        isAiAvailable,
        checkAiStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
