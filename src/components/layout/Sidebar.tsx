import React from 'react';
import { useApp, PageId } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  BookOpen,
  CalendarDays,
  Sparkles,
  Megaphone,
  BarChart3,
  Settings,
  LogIn,
  X,
  School,
  ShieldCheck,
} from 'lucide-react';

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  highlight?: boolean;
}

export const Sidebar: React.FC = () => {
  const { currentPage, setCurrentPage, sidebarOpen, setSidebarOpen, currentRole } = useApp();

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
    { id: 'assignments', label: 'Assignments', icon: BookOpen },
    { id: 'timetable', label: 'Timetable', icon: CalendarDays },
    {
      id: 'ai-assistant',
      label: 'AI Study Mentor',
      icon: Sparkles,
      badge: 'Gemini',
      highlight: true,
    },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'login', label: 'Demo Access / Login', icon: LogIn },
  ];

  const handleNavClick = (id: PageId) => {
    setCurrentPage(id);
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-slate-900 text-slate-100 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-900/50">
              <School className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                <span>Smart Campus</span>
              </div>
              <div className="text-[10px] text-indigo-400 font-mono uppercase tracking-wider">
                AI Academic Suite
              </div>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Academic Modules
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? item.highlight
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-900/30'
                      : 'bg-indigo-600 text-white shadow-xs'
                    : item.highlight
                    ? 'text-indigo-300 hover:bg-indigo-950/40 hover:text-indigo-200'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive
                        ? 'text-white'
                        : item.highlight
                        ? 'text-indigo-400'
                        : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-indigo-900/60 text-indigo-300 border border-indigo-700/50'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Role & Campus Context footer card */}
        <div className="p-3 border-t border-slate-800">
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-400 font-medium">Session</span>
              <span className="text-[11px] font-semibold text-indigo-300">Autumn 2026</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Current Role</span>
              <span className="capitalize text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                {currentRole}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
