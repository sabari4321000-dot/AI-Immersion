import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { storage, INITIAL_COURSES } from '../services/storage';
import { AttendanceRecord, AttendanceStatus } from '../types';
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  XCircle,
  Users,
  Save,
  History,
  Download,
  AlertTriangle,
  Filter,
} from 'lucide-react';

export const AttendancePage: React.FC = () => {
  const { showToast, triggerRefresh, currentUser } = useApp();

  const [activeTab, setActiveTab] = useState<'mark' | 'history'>('mark');

  // Course & Date selection
  const courses = INITIAL_COURSES;
  const [selectedCourseCode, setSelectedCourseCode] = useState(courses[0].code);
  const [selectedDate, setSelectedDate] = useState('2026-10-21');

  // Students roster for selected course
  const allStudents = storage.getStudents();
  const enrolledStudents = allStudents.filter((s) =>
    s.enrolledCourses.includes(selectedCourseCode)
  );

  // In-progress attendance marking state: studentId -> { status, remarks }
  const [attendanceState, setAttendanceState] = useState<
    Record<string, { status: AttendanceStatus; remarks: string }>
  >(() => {
    const initial: Record<string, { status: AttendanceStatus; remarks: string }> = {};
    for (const stu of enrolledStudents) {
      initial[stu.id] = { status: 'present', remarks: '' };
    }
    return initial;
  });

  // History records
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>(() =>
    storage.getAttendance()
  );
  const [historyCourseFilter, setHistoryCourseFilter] = useState('All');

  const selectedCourse = courses.find((c) => c.code === selectedCourseCode) || courses[0];

  // Bulk actions
  const handleMarkAll = (status: AttendanceStatus) => {
    setAttendanceState((prev) => {
      const updated = { ...prev };
      for (const stu of enrolledStudents) {
        updated[stu.id] = {
          status,
          remarks: prev[stu.id]?.remarks || '',
        };
      }
      return updated;
    });
  };

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceState((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }));
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setAttendanceState((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks,
      },
    }));
  };

  // Submit attendance to storage
  const handleSaveAttendance = () => {
    const recordsToSave = enrolledStudents.map((stu) => {
      const entry = attendanceState[stu.id] || { status: 'present', remarks: '' };
      return {
        studentId: stu.id,
        studentName: stu.name,
        rollNumber: stu.rollNumber,
        courseCode: selectedCourse.code,
        courseName: selectedCourse.name,
        date: selectedDate,
        status: entry.status,
        markedBy: currentUser.name,
        remarks: entry.remarks,
      };
    });

    storage.recordAttendanceBatch(recordsToSave);
    setAttendanceHistory(storage.getAttendance());
    triggerRefresh();
    showToast(
      `Attendance saved for ${selectedCourse.code} (${enrolledStudents.length} students logged)`,
      'success'
    );
  };

  // Stats calculation
  const totalInSession = enrolledStudents.length;
  const presentCount = enrolledStudents.filter(
    (s) => attendanceState[s.id]?.status === 'present'
  ).length;
  const lateCount = enrolledStudents.filter(
    (s) => attendanceState[s.id]?.status === 'late'
  ).length;
  const absentCount = enrolledStudents.filter(
    (s) => attendanceState[s.id]?.status === 'absent'
  ).length;
  const sessionPct = totalInSession > 0 ? Math.round(((presentCount + lateCount) / totalInSession) * 100) : 0;

  // History filtering
  const filteredHistory = attendanceHistory.filter((rec) => {
    const matchesCourse = historyCourseFilter === 'All' || rec.courseCode === historyCourseFilter;
    return matchesCourse;
  });

  // Export history CSV
  const handleExportHistoryCSV = () => {
    const headers = ['Date', 'Course Code', 'Course Name', 'Roll Number', 'Student Name', 'Status', 'Marked By', 'Remarks'];
    const rows = filteredHistory.map((h) => [
      h.date,
      h.courseCode,
      `"${h.courseName}"`,
      h.rollNumber,
      `"${h.studentName}"`,
      h.status.toUpperCase(),
      `"${h.markedBy}"`,
      `"${h.remarks || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `smart_campus_attendance_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported attendance history to CSV', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Attendance Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Log real-time class attendance rosters and monitor examination eligibility.
          </p>
        </div>

        {/* Tab switch buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('mark')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'mark'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Mark Daily Roster
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'history'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Attendance History ({attendanceHistory.length})
          </button>
        </div>
      </div>

      {activeTab === 'mark' ? (
        <div className="space-y-6">
          {/* Controls: Course & Date selector */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              {/* Course Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Course / Subject
                </label>
                <select
                  value={selectedCourseCode}
                  onChange={(e) => {
                    const code = e.target.value;
                    setSelectedCourseCode(code);
                    // Reinitialize state
                    const enrolled = allStudents.filter((s) => s.enrolledCourses.includes(code));
                    const nextState: Record<string, { status: AttendanceStatus; remarks: string }> = {};
                    for (const stu of enrolled) {
                      nextState[stu.id] = { status: 'present', remarks: '' };
                    }
                    setAttendanceState(nextState);
                  }}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-800 font-medium"
                >
                  {courses.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} - {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Session Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-800 font-mono"
                />
              </div>

              {/* Faculty In-Charge */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Instructor In-Charge
                </label>
                <div className="px-3 py-2 text-xs bg-slate-100/70 border border-slate-200 rounded-xl text-slate-700 font-medium flex items-center justify-between">
                  <span>{selectedCourse.faculty}</span>
                  <span className="text-[10px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-mono">
                    {selectedCourse.credits} Credits
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Bulk Action Bar & Live Stats */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Bulk Quick Mark:
                </span>
                <button
                  type="button"
                  onClick={() => handleMarkAll('present')}
                  className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
                >
                  All Present
                </button>
                <button
                  type="button"
                  onClick={() => handleMarkAll('absent')}
                  className="px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors"
                >
                  All Absent
                </button>
              </div>

              {/* Real-time stats summary */}
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="text-slate-600">
                  Total: <strong className="text-slate-900">{totalInSession}</strong>
                </span>
                <span className="text-emerald-600 font-semibold">
                  Present: {presentCount}
                </span>
                <span className="text-amber-600 font-semibold">Late: {lateCount}</span>
                <span className="text-rose-600 font-semibold">Absent: {absentCount}</span>
                <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">
                  {sessionPct}% Logged
                </span>
              </div>
            </div>
          </div>

          {/* Attendance Roster Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-slate-900">
                  Enrolled Students for {selectedCourse.code} ({enrolledStudents.length})
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                Tap status button to update
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {enrolledStudents.length > 0 ? (
                enrolledStudents.map((stu) => {
                  const currentStatus = attendanceState[stu.id]?.status || 'present';
                  const remarks = attendanceState[stu.id]?.remarks || '';

                  return (
                    <div
                      key={stu.id}
                      className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors"
                    >
                      {/* Student Info */}
                      <div className="flex items-center gap-3 min-w-[240px]">
                        <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                          {stu.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-xs">{stu.name}</div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-2 font-mono">
                            <span>{stu.rollNumber}</span>
                            <span>·</span>
                            <span
                              className={
                                stu.attendancePercentage >= 75
                                  ? 'text-emerald-600 font-semibold'
                                  : 'text-amber-600 font-semibold'
                              }
                            >
                              Overall: {stu.attendancePercentage}%
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Status Toggle Buttons */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(stu.id, 'present')}
                          className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                            currentStatus === 'present'
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Present</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(stu.id, 'late')}
                          className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                            currentStatus === 'late'
                              ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-amber-50 hover:text-amber-700'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>Late</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(stu.id, 'absent')}
                          className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                            currentStatus === 'absent'
                              ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-rose-50 hover:text-rose-700'
                          }`}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Absent</span>
                        </button>
                      </div>

                      {/* Remarks input */}
                      <div className="w-full md:w-64">
                        <input
                          type="text"
                          value={remarks}
                          onChange={(e) => handleRemarksChange(stu.id, e.target.value)}
                          placeholder="Add note (e.g. sick leave, excused)..."
                          className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-slate-500 text-xs">
                  No students currently enrolled in {selectedCourse.code}.
                </div>
              )}
            </div>

            {/* Bottom Save Bar */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Logged records automatically update semester attendance percentages.
              </span>
              <button
                type="button"
                onClick={handleSaveAttendance}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save & Submit Attendance</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* History Tab */
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-3">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-700">Filter Course:</span>
              <select
                value={historyCourseFilter}
                onChange={(e) => setHistoryCourseFilter(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
              >
                <option value="All">All Courses</option>
                {courses.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} - {c.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleExportHistoryCSV}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export History CSV</span>
            </button>
          </div>

          {/* History Records Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Course</th>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Instructor</th>
                    <th className="py-3 px-4">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredHistory.length > 0 ? (
                    filteredHistory.map((rec) => (
                      <tr key={rec.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4 font-mono tabular-nums text-slate-600">
                          {rec.date}{' '}
                          <span className="text-[10px] text-slate-400">({rec.markedAt})</span>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-900">
                          {rec.courseCode} · {rec.courseName}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900">{rec.studentName}</div>
                          <div className="text-[10px] font-mono text-slate-500">{rec.rollNumber}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              rec.status === 'present'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : rec.status === 'late'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {rec.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{rec.markedBy}</td>
                        <td className="py-3 px-4 text-slate-500 italic">
                          {rec.remarks || '—'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        No attendance history found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
