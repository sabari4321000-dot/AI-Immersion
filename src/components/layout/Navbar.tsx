import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Menu,
  Bell,
  Sparkles,
  ChevronDown,
  GraduationCap,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { storage } from '../../services/storage';

export const Navbar: React.FC = () => {
  const {
    currentRole,
    currentUser,
    setRole,
    currentPage,
    setCurrentPage,
    setSidebarOpen,
    isAiAvailable,
  } = useApp();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const announcements = storage.getAnnouncements().slice(0, 3);

  // Friendly title mapping
  const pageTitles: Record<string, string> = {
    dashboard: 'Campus Overview',
    students: 'Student Directory & Records',
    attendance: 'Attendance Management',
    assignments: 'Coursework & Assignments',
    timetable: 'Class Schedule & Timetable',
    'ai-assistant': 'Gemini AI Study Mentor',
    announcements: 'Campus Circulars & Notices',
    reports: 'Academic Analytics & Reports',
    settings: 'System Preferences & Config',
    login: 'Role & Demo Access',
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Left: Mobile hamburger & breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 focus:outline-none"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm shadow-indigo-200">
            SC
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-bold text-slate-900 tracking-tight leading-none">
              Smart Campus
            </h1>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              {pageTitles[currentPage] || 'Portal'}
            </p>
          </div>
        </div>
      </div>

      {/* Middle: AI Status badge */}
      <div className="hidden md:flex items-center gap-3">
        <button
          onClick={() => setCurrentPage('ai-assistant')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
            isAiAvailable
              ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border-indigo-200 hover:border-indigo-300 shadow-xs'
              : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Gemini 3.8 AI Assistant</span>
          {isAiAvailable ? (
            <span className="text-[10px] text-emerald-600 bg-emerald-100/80 px-1.5 py-0.2 rounded font-mono font-medium">
              Live
            </span>
          ) : (
            <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded font-medium">
              Setup Guide
            </span>
          )}
        </button>
      </div>

      {/* Right: Notifications, Role selector, Profile avatar */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setRoleMenuOpen(false);
            }}
            className="relative p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in">
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                <span className="text-xs font-semibold text-slate-900">Campus Circulars</span>
                <button
                  onClick={() => {
                    setNotificationsOpen(false);
                    setCurrentPage('announcements');
                  }}
                  className="text-[11px] font-medium text-indigo-600 hover:text-indigo-700"
                >
                  View All
                </button>
              </div>
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {announcements.map((ann) => (
                  <div
                    key={ann.id}
                    onClick={() => {
                      setNotificationsOpen(false);
                      setCurrentPage('announcements');
                    }}
                    className="p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                      <span className="capitalize font-medium text-slate-700">{ann.category}</span>
                      <span className="tabular-nums">{ann.date}</span>
                    </div>
                    <p className="text-xs font-medium text-slate-900 line-clamp-1">{ann.title}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Role Switcher Pill */}
        <div className="relative">
          <button
            onClick={() => {
              setRoleMenuOpen(!roleMenuOpen);
              setNotificationsOpen(false);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors border border-slate-200"
          >
            <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
            <span className="capitalize">{currentRole}</span>
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>

          {roleMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Simulate Persona
              </div>

              <button
                onClick={() => {
                  setRole('faculty');
                  setRoleMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                  currentRole === 'faculty' ? 'font-bold text-indigo-600 bg-indigo-50/50' : 'text-slate-700'
                }`}
              >
                <div>
                  <div className="font-semibold">Faculty / Professor</div>
                  <div className="text-[10px] text-slate-500 font-normal">Dr. Evelyn Vance (CS Head)</div>
                </div>
                {currentRole === 'faculty' && <CheckCircle className="w-4 h-4 text-indigo-600" />}
              </button>

              <button
                onClick={() => {
                  setRole('student');
                  setRoleMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                  currentRole === 'student' ? 'font-bold text-indigo-600 bg-indigo-50/50' : 'text-slate-700'
                }`}
              >
                <div>
                  <div className="font-semibold">Student</div>
                  <div className="text-[10px] text-slate-500 font-normal">Alex Rivera (3rd Year)</div>
                </div>
                {currentRole === 'student' && <CheckCircle className="w-4 h-4 text-indigo-600" />}
              </button>

              <button
                onClick={() => {
                  setRole('admin');
                  setRoleMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                  currentRole === 'admin' ? 'font-bold text-indigo-600 bg-indigo-50/50' : 'text-slate-700'
                }`}
              >
                <div>
                  <div className="font-semibold">Administrator</div>
                  <div className="text-[10px] text-slate-500 font-normal">Academic Registrar Office</div>
                </div>
                {currentRole === 'admin' && <CheckCircle className="w-4 h-4 text-indigo-600" />}
              </button>
            </div>
          )}
        </div>

        {/* User Profile avatar */}
        <div
          onClick={() => setCurrentPage('settings')}
          className="flex items-center gap-2 pl-2 border-l border-slate-200 cursor-pointer group"
          title="Profile & Settings"
        >
          {currentUser.avatarUrl ? (
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 group-hover:ring-indigo-400 transition-all"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold ring-1 ring-slate-200">
              {currentUser.name.charAt(0)}
            </div>
          )}
          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
              {currentUser.name}
            </p>
            <p className="text-[10px] text-slate-500 leading-tight capitalize">
              {currentUser.role}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
