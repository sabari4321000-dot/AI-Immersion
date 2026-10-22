import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { storage } from '../services/storage';
import { SystemSettings } from '../types';
import {
  Settings,
  User,
  Building,
  Sparkles,
  RotateCcw,
  Save,
  CheckCircle2,
  AlertCircle,
  Bell,
  Shield,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { showToast, triggerRefresh, currentUser, currentRole, setRole, isAiAvailable } = useApp();

  const [settings, setSettings] = useState<SystemSettings>(() => storage.getSettings());
  const [profileName, setProfileName] = useState(currentUser.name);
  const [profileEmail, setProfileEmail] = useState(currentUser.email);
  const [profileDept, setProfileDept] = useState(currentUser.department);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    storage.updateSettings(settings);
    showToast('System preferences saved successfully', 'success');
  };

  const handleResetData = () => {
    if (
      confirm(
        'Reset all students, assignments, attendance logs, and circulars back to default realistic college dataset?'
      )
    ) {
      storage.resetAllToDefaults();
      setSettings(storage.getSettings());
      triggerRefresh();
      showToast('All college demo data restored to initial state', 'success');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Settings & System Preferences
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Customize campus parameters, user profiles, and AI study assistant integrations.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900 font-bold text-sm">
          <User className="w-4 h-4 text-indigo-600" />
          <span>Active Persona & Profile</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {currentUser.avatarUrl ? (
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-200"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-700 font-bold text-xl flex items-center justify-center">
              {currentUser.name.charAt(0)}
            </div>
          )}

          <div>
            <h3 className="text-base font-bold text-slate-900">{currentUser.name}</h3>
            <p className="text-xs text-slate-500 capitalize">
              Role: <strong className="text-indigo-600">{currentRole}</strong> · {currentUser.department}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">{currentUser.title || 'Campus Member'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Display Name</label>
            <input
              type="text"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              value={profileEmail}
              onChange={(e) => setProfileEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Department</label>
            <input
              type="text"
              value={profileDept}
              onChange={(e) => setProfileDept(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Institutional Settings Form */}
      <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900 font-bold text-sm">
          <Building className="w-4 h-4 text-indigo-600" />
          <span>Institutional Parameters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Institution Name</label>
            <input
              type="text"
              value={settings.institutionName}
              onChange={(e) => setSettings({ ...settings, institutionName: e.target.value })}
              className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Academic Session</label>
            <input
              type="text"
              value={settings.academicYear}
              onChange={(e) => setSettings({ ...settings, academicYear: e.target.value })}
              className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Current Semester</label>
            <input
              type="text"
              value={settings.currentSemester}
              onChange={(e) => setSettings({ ...settings, currentSemester: e.target.value })}
              className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Minimum Attendance Threshold (% for Exam Eligibility)
            </label>
            <input
              type="number"
              min="50"
              max="95"
              value={settings.minimumAttendanceThreshold}
              onChange={(e) =>
                setSettings({ ...settings, minimumAttendanceThreshold: parseInt(e.target.value, 10) || 75 })
              }
              className="w-full px-3 py-2 border rounded-xl font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end">
          <button
            type="submit"
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Institutional Preferences</span>
          </button>
        </div>
      </form>

      {/* AI & Architecture Status Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>Gemini AI Study Architecture</span>
          </div>
          <span
            className={`text-xs font-bold font-mono px-2.5 py-0.5 rounded-full ${
              isAiAvailable
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}
          >
            {isAiAvailable ? 'Active · Connected' : 'Configuration Ready'}
          </span>
        </div>

        <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
          <p>
            <strong>Model:</strong> <code>gemini-3.8-flash</code> via official{' '}
            <code>@google/genai</code> SDK.
          </p>
          <p>
            <strong>Security:</strong> All model calls are proxied securely through the Express backend (<code>server.ts</code>). The API key is stored only in server environment variables and never exposed to client browsers.
          </p>
          <p>
            <strong>Study Endpoints:</strong> <code>/api/ai/chat</code>, <code>/api/ai/summarize</code>, <code>/api/ai/quiz</code>, <code>/api/ai/study-plan</code>.
          </p>
        </div>
      </div>

      {/* System Data Reset Card */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Reset Demo Data</h4>
            <p className="text-xs text-slate-500">
              Restore the original realistic college dataset with sample students, assignments, and timetable slots.
            </p>
          </div>
          <button
            onClick={handleResetData}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset to Defaults</span>
          </button>
        </div>
      </div>
    </div>
  );
};
