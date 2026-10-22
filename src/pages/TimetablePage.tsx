import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { storage, INITIAL_COURSES } from '../services/storage';
import { TimetableSlot, Weekday } from '../types';
import {
  CalendarDays,
  Clock,
  MapPin,
  User,
  Plus,
  Trash2,
  X,
  Filter,
  Printer,
  Sparkles,
} from 'lucide-react';

export const TimetablePage: React.FC = () => {
  const { showToast, triggerRefresh } = useApp();

  const [timetable, setTimetable] = useState<TimetableSlot[]>(() => storage.getTimetable());
  const [selectedDay, setSelectedDay] = useState<Weekday | 'All'>('All');
  const [filterType, setFilterType] = useState<string>('All');

  // Modal State
  const [isAddingSlot, setIsAddingSlot] = useState(false);
  const courses = INITIAL_COURSES;

  const initialNewSlot: Omit<TimetableSlot, 'id'> = {
    day: 'Monday',
    startTime: '09:00 AM',
    endTime: '10:30 AM',
    courseCode: courses[0].code,
    courseName: courses[0].name,
    department: 'Computer Science',
    semester: 5,
    room: 'Hall 302',
    facultyName: 'Dr. Evelyn Vance',
    slotType: 'Lecture',
    colorTag: 'indigo',
  };
  const [newSlot, setNewSlot] = useState<Omit<TimetableSlot, 'id'>>(initialNewSlot);

  const refreshData = () => {
    setTimetable(storage.getTimetable());
    triggerRefresh();
  };

  const weekdays: Weekday[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Current day determination
  const dayIndexMap: Record<number, Weekday> = {
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
    0: 'Monday',
  };
  const currentDayName = dayIndexMap[new Date().getDay()] || 'Monday';

  // Filter slots
  const filteredSlots = timetable.filter((slot) => {
    const matchesDay = selectedDay === 'All' || slot.day === selectedDay;
    const matchesType = filterType === 'All' || slot.slotType === filterType;
    return matchesDay && matchesType;
  });

  // Group slots by Day
  const groupedByDay: Record<Weekday, TimetableSlot[]> = {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
  };

  for (const slot of filteredSlots) {
    if (groupedByDay[slot.day]) {
      groupedByDay[slot.day].push(slot);
    }
  }

  const handleSaveSlot = (e: React.FormEvent) => {
    e.preventDefault();
    const course = courses.find((c) => c.code === newSlot.courseCode);
    storage.addTimetableSlot({
      ...newSlot,
      courseName: course?.name || newSlot.courseName,
      facultyName: course?.faculty || newSlot.facultyName,
    });
    showToast(`Added ${newSlot.courseCode} slot on ${newSlot.day}`, 'success');
    setIsAddingSlot(false);
    refreshData();
  };

  const handleDeleteSlot = (id: string, courseCode: string) => {
    if (confirm(`Remove ${courseCode} class slot from schedule?`)) {
      storage.deleteTimetableSlot(id);
      showToast('Timetable slot removed', 'info');
      refreshData();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Academic Timetable & Schedule
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Weekly class schedule, classroom allocations, and faculty assignments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Timetable</span>
          </button>
          <button
            onClick={() => setIsAddingSlot(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Class Slot</span>
          </button>
        </div>
      </div>

      {/* Day Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Day Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSelectedDay('All')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                selectedDay === 'All'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              Full Week (Mon–Sat)
            </button>

            {weekdays.map((day) => {
              const isToday = day === currentDayName;
              const isSelected = selectedDay === day;
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all relative ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70'
                  }`}
                >
                  <span>{day}</span>
                  {isToday && (
                    <span
                      title="Today"
                      className={`ml-1.5 text-[9px] px-1 py-0.2 rounded font-mono ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      Today
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Slot Type Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
            >
              <option value="All">All Class Types</option>
              <option value="Lecture">Lectures Only</option>
              <option value="Lab">Labs Only</option>
              <option value="Tutorial">Tutorials Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Timetable Display */}
      {selectedDay === 'All' ? (
        /* Full Week View (Grouped by Day) */
        <div className="space-y-6">
          {weekdays.map((day) => {
            const slots = groupedByDay[day];
            if (slots.length === 0) return null;
            const isToday = day === currentDayName;

            return (
              <div
                key={day}
                className={`bg-white rounded-2xl border ${
                  isToday ? 'border-indigo-300 ring-1 ring-indigo-200' : 'border-slate-200'
                } p-5 shadow-xs`}
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{day}</h3>
                    {isToday && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Current Day
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-slate-500 font-mono">
                    {slots.length} {slots.length === 1 ? 'Class' : 'Classes'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {slots.map((slot) => (
                    <div
                      key={slot.id}
                      className="p-4 rounded-xl border border-slate-200/90 hover:border-indigo-200 bg-slate-50/70 hover:bg-slate-50 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="font-bold text-indigo-600 font-mono">
                            {slot.courseCode}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 uppercase">
                            {slot.slotType}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 leading-snug mb-2">
                          {slot.courseName}
                        </h4>
                      </div>

                      <div className="space-y-1.5 text-[11px] text-slate-600 pt-2 border-t border-slate-200/60">
                        <div className="flex items-center gap-1.5 font-mono text-slate-700 tabular-nums">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{slot.startTime} – {slot.endTime}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{slot.room}</span>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center gap-1 text-slate-500 truncate">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <span className="truncate">{slot.facultyName}</span>
                          </div>
                          <button
                            onClick={() => handleDeleteSlot(slot.id, slot.courseCode)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                            title="Remove class slot"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Single Day View */
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <h3 className="text-base font-bold text-slate-900">
              Schedule for {selectedDay} ({filteredSlots.length} Classes)
            </h3>
          </div>

          {filteredSlots.length > 0 ? (
            <div className="space-y-3">
              {filteredSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/60 transition-all gap-3"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white font-mono font-bold flex flex-col items-center justify-center text-xs shrink-0">
                      <span>{slot.courseCode.split('-')[0]}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{slot.courseName}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 uppercase">
                          {slot.slotType}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          {slot.facultyName}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {slot.room}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 font-mono text-xs font-bold text-slate-800 tabular-nums">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{slot.startTime} – {slot.endTime}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteSlot(slot.id, slot.courseCode)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Remove class slot"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 text-xs">
              No classes scheduled for {selectedDay}.
            </div>
          )}
        </div>
      )}

      {/* ADD SLOT MODAL */}
      {isAddingSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-base font-bold text-slate-900">Add Class Schedule Slot</h3>
              <button
                onClick={() => setIsAddingSlot(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSlot} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Day of Week</label>
                  <select
                    value={newSlot.day}
                    onChange={(e) => setNewSlot({ ...newSlot, day: e.target.value as Weekday })}
                    className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    {weekdays.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Session Type</label>
                  <select
                    value={newSlot.slotType}
                    onChange={(e) =>
                      setNewSlot({ ...newSlot, slotType: e.target.value as 'Lecture' | 'Lab' | 'Tutorial' })
                    }
                    className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="Lecture">Lecture</option>
                    <option value="Lab">Laboratory Practical</option>
                    <option value="Tutorial">Interactive Tutorial</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Course Unit</label>
                <select
                  value={newSlot.courseCode}
                  onChange={(e) => {
                    const code = e.target.value;
                    const course = courses.find((c) => c.code === code);
                    setNewSlot({
                      ...newSlot,
                      courseCode: code,
                      courseName: course?.name || '',
                      facultyName: course?.faculty || '',
                    });
                  }}
                  className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {courses.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} - {c.name} ({c.faculty})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Start Time</label>
                  <input
                    type="text"
                    value={newSlot.startTime}
                    onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                    placeholder="e.g. 09:00 AM"
                    className="w-full px-3 py-2 border rounded-xl font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">End Time</label>
                  <input
                    type="text"
                    value={newSlot.endTime}
                    onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                    placeholder="e.g. 10:30 AM"
                    className="w-full px-3 py-2 border rounded-xl font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Room / Hall</label>
                  <input
                    type="text"
                    value={newSlot.room}
                    onChange={(e) => setNewSlot({ ...newSlot, room: e.target.value })}
                    placeholder="e.g. Hall 302 / Lab 4"
                    className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Faculty Name</label>
                  <input
                    type="text"
                    value={newSlot.facultyName}
                    onChange={(e) => setNewSlot({ ...newSlot, facultyName: e.target.value })}
                    placeholder="e.g. Dr. Evelyn Vance"
                    className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2 -mx-5 -mb-5">
                <button
                  type="button"
                  onClick={() => setIsAddingSlot(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-xs"
                >
                  Add to Timetable
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
