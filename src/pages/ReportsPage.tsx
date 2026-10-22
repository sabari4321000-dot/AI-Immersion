import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { storage } from '../services/storage';
import {
  BarChart3,
  Printer,
  Download,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Award,
  BookOpen,
  GraduationCap,
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { showToast } = useApp();

  const students = storage.getStudents();
  const assignments = storage.getAssignments();
  const attendance = storage.getAttendance();

  // Department analytics
  const departments = ['Computer Science', 'Artificial Intelligence', 'Electronics', 'Mechanical'];
  const deptStats = departments.map((dept) => {
    const deptStudents = students.filter((s) => s.department === dept);
    const count = deptStudents.length;
    const avgAtt =
      count > 0
        ? Math.round((deptStudents.reduce((acc, s) => acc + s.attendancePercentage, 0) / count) * 10) / 10
        : 0;
    const avgGpa =
      count > 0
        ? Math.round((deptStudents.reduce((acc, s) => acc + s.cgpa, 0) / count) * 100) / 100
        : 0;
    const lowAttCount = deptStudents.filter((s) => s.attendancePercentage < 75).length;

    return {
      name: dept,
      studentCount: count,
      avgAttendance: avgAtt,
      avgGpa,
      lowAttendanceCount: lowAttCount,
    };
  });

  // Overall attendance calculation
  const totalStudents = students.length;
  const eligibleStudents = students.filter((s) => s.attendancePercentage >= 75);
  const lowAttendanceStudents = students.filter((s) => s.attendancePercentage < 75);
  const overallAvgAtt =
    totalStudents > 0
      ? Math.round(
          (students.reduce((acc, s) => acc + s.attendancePercentage, 0) / totalStudents) * 10
        ) / 10
      : 0;

  // GPA Bands
  const gpaDistinction = students.filter((s) => s.cgpa >= 3.8).length;
  const gpaHonors = students.filter((s) => s.cgpa >= 3.5 && s.cgpa < 3.8).length;
  const gpaGood = students.filter((s) => s.cgpa >= 3.0 && s.cgpa < 3.5).length;
  const gpaReview = students.filter((s) => s.cgpa < 3.0).length;

  const handleExportReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Academic Performance & Attendance Reports
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Institutional metrics, departmental compliance rosters, and examination eligibility.
          </p>
        </div>

        <button
          onClick={handleExportReport}
          className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-2xs self-start sm:self-auto"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print / Export Audit Report</span>
        </button>
      </div>

      {/* Summary KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Overall University Attendance
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
            {overallAvgAtt}%
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">
            Across {departments.length} Academic Departments
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Exam Eligibility Rate
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-mono tabular-nums">
            {Math.round((eligibleStudents.length / (totalStudents || 1)) * 100)}%
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {eligibleStudents.length} of {totalStudents} students meet 75% rule
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Average Campus GPA
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 font-mono tabular-nums">
            3.66 / 4.0
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Cumulative weighted cohort average
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Course Deliverables
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-purple-600 font-mono tabular-nums">
            {assignments.length} Units
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Continuous internal assessment
          </p>
        </div>
      </div>

      {/* Department Breakdown Table & Visual Bars */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Departmental Compliance & GPA</h3>
            <p className="text-xs text-slate-500">Breakdown by academic engineering divisions</p>
          </div>
          <span className="text-xs font-mono text-slate-500 font-medium">Session 2026-2027</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase">
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Cohort Size</th>
                <th className="py-3 px-4">Avg Attendance</th>
                <th className="py-3 px-4">Avg CGPA</th>
                <th className="py-3 px-4">Under-Threshold (&lt;75%)</th>
                <th className="py-3 px-4">Compliance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {deptStats.map((ds) => (
                <tr key={ds.name} className="hover:bg-slate-50/70">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{ds.name}</td>
                  <td className="py-3.5 px-4 font-mono tabular-nums">{ds.studentCount} students</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            ds.avgAttendance >= 75 ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${Math.min(ds.avgAttendance, 100)}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold tabular-nums text-slate-800">
                        {ds.avgAttendance}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 tabular-nums">
                    {ds.avgGpa.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4">
                    {ds.lowAttendanceCount > 0 ? (
                      <span className="text-rose-600 font-bold font-mono">
                        {ds.lowAttendanceCount} student{ds.lowAttendanceCount > 1 ? 's' : ''}
                      </span>
                    ) : (
                      <span className="text-emerald-600 font-medium font-mono">0 students</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        ds.avgAttendance >= 75
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {ds.avgAttendance >= 75 ? 'Compliant' : 'Review Warning'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Academic Honors & GPA Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* GPA Bands Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Award className="w-4 h-4 text-indigo-600" />
            <span>Academic Distinction & Grade Distribution</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex items-center justify-between font-semibold mb-1">
                <span className="text-emerald-700">First Class with Distinction (3.80 – 4.00)</span>
                <span className="font-mono text-slate-900 tabular-nums">{gpaDistinction} Students</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: `${(gpaDistinction / (totalStudents || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between font-semibold mb-1">
                <span className="text-blue-700">First Class Honors (3.50 – 3.79)</span>
                <span className="font-mono text-slate-900 tabular-nums">{gpaHonors} Students</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full"
                  style={{ width: `${(gpaHonors / (totalStudents || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between font-semibold mb-1">
                <span className="text-amber-700">Good Standing (3.00 – 3.49)</span>
                <span className="font-mono text-slate-900 tabular-nums">{gpaGood} Students</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full"
                  style={{ width: `${(gpaGood / (totalStudents || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between font-semibold mb-1">
                <span className="text-rose-700">Academic Probation / Review (&lt;3.00)</span>
                <span className="font-mono text-slate-900 tabular-nums">{gpaReview} Students</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full"
                  style={{ width: `${(gpaReview / (totalStudents || 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Low Attendance Audit Watchlist */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Low Attendance Action Required (&lt;75%)</span>
            </div>
            <span className="text-xs font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
              {lowAttendanceStudents.length} Flagged
            </span>
          </div>

          <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto">
            {lowAttendanceStudents.map((stu) => (
              <div key={stu.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900">{stu.name}</div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    {stu.rollNumber} · {stu.department}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-extrabold text-rose-600 tabular-nums">
                    {stu.attendancePercentage}%
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Parent: {stu.guardianContact}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
            * Formal deficiency letters are automatically generated for students failing to meet the university 75% statutory requirement prior to final term exams.
          </div>
        </div>
      </div>
    </div>
  );
};
