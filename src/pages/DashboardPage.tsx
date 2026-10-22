import React from 'react';
import { useApp } from '../context/AppContext';
import { storage } from '../services/storage';
import {
  Users,
  CalendarCheck,
  BookOpen,
  CalendarDays,
  Sparkles,
  ArrowUpRight,
  Clock,
  AlertTriangle,
  Megaphone,
  CheckCircle2,
  PlusCircle,
  FileText,
} from 'lucide-react';
import campusHero from '../assets/images/campus_quad_aerial_1792644900397.jpg';

export const DashboardPage: React.FC = () => {
  const { setCurrentPage, currentUser, currentRole } = useApp();

  const students = storage.getStudents();
  const assignments = storage.getAssignments();
  const timetable = storage.getTimetable();
  const announcements = storage.getAnnouncements();
  const activities = storage.getActivities();

  // Metrics
  const totalStudents = students.length;
  const avgAttendance =
    Math.round(
      (students.reduce((acc, s) => acc + s.attendancePercentage, 0) / (totalStudents || 1)) * 10
    ) / 10;
  const pendingAssignments = assignments.filter((a) => a.status === 'pending').length;

  // Today's classes (let's pick Monday or current day)
  const days: Record<number, string> = {
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
    0: 'Monday',
  };
  const todayName = days[new Date().getDay()] || 'Monday';
  const todaysSchedule = timetable.filter((s) => s.day === todayName);

  // Low attendance warning list (<75%)
  const lowAttendanceStudents = students.filter((s) => s.attendancePercentage < 75);

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 text-white p-6 sm:p-8">
        <div className="absolute inset-0 opacity-25 mix-blend-overlay">
          <img
            src={campusHero}
            alt="University Campus"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-medium mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Academic Year 2026–2027 · Autumn Semester</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            Welcome back, {currentUser.name}
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            Smart Campus gives you unified control over student records, live attendance rosters,
            assignment pipelines, and automated study intelligence powered by Google Gemini.
          </p>

          {/* Quick action buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {currentRole === 'faculty' && (
              <>
                <button
                  onClick={() => setCurrentPage('attendance')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors flex items-center gap-2"
                >
                  <CalendarCheck className="w-3.5 h-3.5" />
                  <span>Mark Attendance</span>
                </button>
                <button
                  onClick={() => setCurrentPage('students')}
                  className="px-4 py-2 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-2"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Manage Students</span>
                </button>
              </>
            )}

            {currentRole === 'student' && (
              <>
                <button
                  onClick={() => setCurrentPage('ai-assistant')}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ask Gemini Study Assistant</span>
                </button>
                <button
                  onClick={() => setCurrentPage('assignments')}
                  className="px-4 py-2 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-2"
                >
                  <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                  <span>View Assignments</span>
                </button>
              </>
            )}

            {currentRole === 'admin' && (
              <>
                <button
                  onClick={() => setCurrentPage('reports')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-2"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Generate Reports</span>
                </button>
                <button
                  onClick={() => setCurrentPage('announcements')}
                  className="px-4 py-2 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-2"
                >
                  <Megaphone className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Post Notice</span>
                </button>
              </>
            )}

            <button
              onClick={() => setCurrentPage('ai-assistant')}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-300" />
              <span>AI Study Mentor</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Students */}
        <div
          onClick={() => setCurrentPage('students')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Enrolled Students
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {totalStudents}
            </span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
              <span>Active</span>
              <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Across 4 engineering disciplines
          </p>
        </div>

        {/* Metric 2: Attendance Rate */}
        <div
          onClick={() => setCurrentPage('attendance')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Avg Attendance
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {avgAttendance}%
            </span>
            <span
              className={`text-xs font-semibold ${
                avgAttendance >= 75 ? 'text-emerald-600' : 'text-amber-600'
              }`}
            >
              {avgAttendance >= 75 ? 'Healthy' : 'Needs attention'}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                avgAttendance >= 75 ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min(avgAttendance, 100)}%` }}
            />
          </div>
        </div>

        {/* Metric 3: Active Assignments */}
        <div
          onClick={() => setCurrentPage('assignments')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-purple-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pending Coursework
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {pendingAssignments}
            </span>
            <span className="text-xs font-semibold text-indigo-600">
              {assignments.length} Total
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Next deadline in 3 days
          </p>
        </div>

        {/* Metric 4: Classes Scheduled */}
        <div
          onClick={() => setCurrentPage('timetable')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Classes Today ({todayName})
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {todaysSchedule.length}
            </span>
            <span className="text-xs font-semibold text-blue-600">
              Timetable
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Semester 5 lecture & lab slots
          </p>
        </div>
      </div>

      {/* Main Grid: Today's Schedule & Pending Assignments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Schedule & Attendance Watchlist */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Schedule Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Today's Class Schedule ({todayName})
                </h3>
                <p className="text-xs text-slate-500">
                  Lectures, labs, and interactive tutorials
                </p>
              </div>
              <button
                onClick={() => setCurrentPage('timetable')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <span>Full Timetable</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {todaysSchedule.length > 0 ? (
              <div className="space-y-2.5">
                {todaysSchedule.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition-colors gap-2"
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 font-bold text-xs flex flex-col items-center justify-center shrink-0">
                        <span>{slot.courseCode.split('-')[0]}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900">{slot.courseName}</h4>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                            {slot.slotType}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {slot.facultyName} · {slot.room}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shrink-0 self-start sm:self-center font-mono tabular-nums">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{slot.startTime} – {slot.endTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-slate-500 text-xs bg-slate-50 rounded-xl">
                No classes scheduled for {todayName}. Enjoy your self-study day!
              </div>
            )}
          </div>

          {/* Low Attendance Watchlist Card */}
          {lowAttendanceStudents.length > 0 && (
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Attendance Advisory Watchlist (&lt;75% Threshold)</span>
                </div>
                <button
                  onClick={() => setCurrentPage('attendance')}
                  className="text-xs font-semibold text-amber-800 hover:text-amber-950 underline"
                >
                  Manage Roster
                </button>
              </div>
              <p className="text-xs text-amber-800/90 mb-3 leading-relaxed">
                The following students require attendance regularization to remain eligible for the upcoming mid-term examinations:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {lowAttendanceStudents.map((stu) => (
                  <div
                    key={stu.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-white border border-amber-200/90 shadow-2xs"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">{stu.name}</div>
                      <div className="text-[11px] text-slate-500">
                        {stu.rollNumber} · {stu.department}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-extrabold text-amber-700 font-mono tabular-nums">
                        {stu.attendancePercentage}%
                      </span>
                      <div className="text-[10px] text-rose-600 font-medium">Under threshold</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Activity Log */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Recent Campus Activity</h3>
              <span className="text-[11px] text-slate-500 font-medium">Live Audit Log</span>
            </div>
            <div className="divide-y divide-slate-100">
              {activities.slice(0, 5).map((act) => (
                <div key={act.id} className="py-2.5 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                    {act.type === 'attendance' && <CalendarCheck className="w-3.5 h-3.5 text-emerald-600" />}
                    {act.type === 'assignment' && <BookOpen className="w-3.5 h-3.5 text-indigo-600" />}
                    {act.type === 'announcement' && <Megaphone className="w-3.5 h-3.5 text-purple-600" />}
                    {act.type === 'student' && <Users className="w-3.5 h-3.5 text-blue-600" />}
                    {act.type === 'ai' && <Sparkles className="w-3.5 h-3.5 text-amber-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-800 leading-snug">
                      <span className="font-semibold text-slate-900">{act.user}</span>{' '}
                      {act.action}{' '}
                      <span className="font-medium text-indigo-600">{act.target}</span>
                    </p>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">{act.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Assignments & Announcements Preview */}
        <div className="space-y-6">
          {/* Upcoming Assignments Preview */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Upcoming Assignments</h3>
              <button
                onClick={() => setCurrentPage('assignments')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                View All
              </button>
            </div>
            <div className="space-y-3">
              {assignments.slice(0, 3).map((asg) => (
                <div
                  key={asg.id}
                  onClick={() => setCurrentPage('assignments')}
                  className="p-3.5 rounded-xl border border-slate-200/80 hover:border-indigo-300 hover:bg-slate-50/50 cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-bold text-indigo-600">{asg.courseCode}</span>
                    <span className="text-slate-500 tabular-nums">Due {asg.dueDate}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1 mb-1.5">
                    {asg.title}
                  </h4>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">{asg.totalMarks} Marks</span>
                    <span
                      className={`font-semibold capitalize ${
                        asg.status === 'graded'
                          ? 'text-emerald-600'
                          : asg.status === 'submitted'
                          ? 'text-blue-600'
                          : 'text-amber-600'
                      }`}
                    >
                      {asg.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* College Announcements */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Campus Bulletins</h3>
              <button
                onClick={() => setCurrentPage('announcements')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                All Notices
              </button>
            </div>
            <div className="space-y-3">
              {announcements.slice(0, 3).map((ann) => (
                <div
                  key={ann.id}
                  onClick={() => setCurrentPage('announcements')}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/60 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                    <span className="font-semibold uppercase text-indigo-600 text-[10px] tracking-wide">
                      {ann.category}
                    </span>
                    <span className="tabular-nums">{ann.date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1 mb-1">
                    {ann.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                    {ann.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Study Assistant Spotlight Widget */}
          <div className="rounded-2xl p-5 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-950 text-white shadow-md relative overflow-hidden">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-indigo-200 text-[11px] font-medium mb-3">
                <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                <span>Powered by Gemini 3.8</span>
              </div>
              <h4 className="text-sm font-bold mb-1">Interactive Academic AI</h4>
              <p className="text-xs text-indigo-200/90 leading-relaxed mb-4">
                Generate practice quizzes, summarize lecture handouts, or clarify complex algorithms in seconds.
              </p>
              <button
                onClick={() => setCurrentPage('ai-assistant')}
                className="w-full py-2.5 px-4 bg-white text-indigo-950 font-bold text-xs rounded-xl hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <span>Open Study Assistant</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
