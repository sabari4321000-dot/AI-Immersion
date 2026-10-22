import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DEMO_USERS } from '../services/storage';
import { UserRole } from '../types';
import {
  GraduationCap,
  Users,
  ShieldCheck,
  ArrowRight,
  School,
  Sparkles,
  Lock,
  Mail,
} from 'lucide-react';
import campusHero from '../assets/images/campus_quad_aerial_1792644900397.jpg';

export const LoginPage: React.FC = () => {
  const { setRole, setCurrentPage, currentRole, showToast } = useApp();

  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  const handleSelectRole = (role: UserRole) => {
    setRole(role);
    showToast(`Logged in as ${DEMO_USERS[role]?.name} (${role.toUpperCase()})`, 'success');
    setCurrentPage('dashboard');
  };

  const handleDirectLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default to faculty or detect from email
    if (emailInput.toLowerCase().includes('student')) {
      handleSelectRole('student');
    } else if (emailInput.toLowerCase().includes('admin') || emailInput.toLowerCase().includes('registrar')) {
      handleSelectRole('admin');
    } else {
      handleSelectRole('faculty');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Hero Welcome Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-1">
          <School className="w-3.5 h-3.5" />
          <span>Smart Campus Authentication & Demo Gateway</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Select Your Academic Role
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          Experience the Smart Campus system from multiple perspectives. Choose a persona below for immediate 1-click access.
        </p>
      </div>

      {/* 3 Interactive Role Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Faculty Persona */}
        <div
          onClick={() => handleSelectRole('faculty')}
          className={`bg-white rounded-2xl border ${
            currentRole === 'faculty'
              ? 'border-indigo-600 ring-2 ring-indigo-500/20'
              : 'border-slate-200'
          } p-6 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer flex flex-col justify-between group`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-mono">
                Faculty
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">Dr. Evelyn Vance</h3>
              <p className="text-xs text-slate-500 font-medium">Head of Department · Computer Science</p>
            </div>

            <div className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-100">
              <span className="font-semibold text-slate-700 block">Capabilities:</span>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-500">
                <li>Take live daily subject attendance</li>
                <li>Create and grade assignments</li>
                <li>Modify weekly timetable slots</li>
                <li>Publish campus circulars</li>
              </ul>
            </div>
          </div>

          <button className="mt-5 w-full py-2.5 px-4 bg-indigo-600 group-hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2">
            <span>Enter as Faculty</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Student Persona */}
        <div
          onClick={() => handleSelectRole('student')}
          className={`bg-white rounded-2xl border ${
            currentRole === 'student'
              ? 'border-indigo-600 ring-2 ring-indigo-500/20'
              : 'border-slate-200'
          } p-6 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer flex flex-col justify-between group`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-mono">
                Student
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">Alex Rivera</h3>
              <p className="text-xs text-slate-500 font-medium">Roll No: CS2023-042 · 3rd Year CSE</p>
            </div>

            <div className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-100">
              <span className="font-semibold text-slate-700 block">Capabilities:</span>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-500">
                <li>Query Gemini AI Study Mentor</li>
                <li>Submit assignment coursework</li>
                <li>Check personal attendance (91.5%)</li>
                <li>Take dynamic AI quizzes</li>
              </ul>
            </div>
          </div>

          <button className="mt-5 w-full py-2.5 px-4 bg-indigo-600 group-hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2">
            <span>Enter as Student</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Administrator Persona */}
        <div
          onClick={() => handleSelectRole('admin')}
          className={`bg-white rounded-2xl border ${
            currentRole === 'admin'
              ? 'border-indigo-600 ring-2 ring-indigo-500/20'
              : 'border-slate-200'
          } p-6 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer flex flex-col justify-between group`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-mono">
                Registrar
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">Dean Office</h3>
              <p className="text-xs text-slate-500 font-medium">Chief Academic Registrar</p>
            </div>

            <div className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-100">
              <span className="font-semibold text-slate-700 block">Capabilities:</span>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-500">
                <li>Enroll & delete student records</li>
                <li>Generate institutional reports</li>
                <li>Audit examination eligibility</li>
                <li>Configure campus semesters</li>
              </ul>
            </div>
          </div>

          <button className="mt-5 w-full py-2.5 px-4 bg-indigo-600 group-hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2">
            <span>Enter as Admin</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Alternative Credentials Form for College Presentation */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-md mx-auto space-y-4">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider text-center">
          Or Sign In with College Credentials
        </h4>

        <form onSubmit={handleDirectLogin} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">University Email ID</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="faculty@campus.edu or student@campus.edu"
                className="w-full pl-9 pr-3 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            Authenticate & Proceed
          </button>
        </form>
      </div>
    </div>
  );
};
