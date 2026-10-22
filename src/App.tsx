/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { ToastContainer } from './components/layout/ToastContainer';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { StudentsPage } from './pages/StudentsPage';
import { AttendancePage } from './pages/AttendancePage';
import { AssignmentsPage } from './pages/AssignmentsPage';
import { TimetablePage } from './pages/TimetablePage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';

const MainLayout: React.FC = () => {
  const { currentPage } = useApp();

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'students':
        return <StudentsPage />;
      case 'attendance':
        return <AttendancePage />;
      case 'assignments':
        return <AssignmentsPage />;
      case 'timetable':
        return <TimetablePage />;
      case 'ai-assistant':
        return <AIAssistantPage />;
      case 'announcements':
        return <AnnouncementsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return <SettingsPage />;
      case 'login':
        return <LoginPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans antialiased overflow-hidden">
      {/* Toast notifications */}
      <ToastContainer />

      {/* Persistent Sidebar */}
      <Sidebar />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navigation Bar */}
        <Navbar />

        {/* Dynamic Page Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{renderCurrentPage()}</div>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
