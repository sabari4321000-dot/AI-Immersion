import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { storage, INITIAL_COURSES } from '../services/storage';
import { Assignment, AssignmentPriority, AssignmentStatus } from '../types';
import {
  BookOpen,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Upload,
  Search,
  Filter,
  X,
  Award,
  Trash2,
} from 'lucide-react';

export const AssignmentsPage: React.FC = () => {
  const { showToast, triggerRefresh, currentRole, currentUser } = useApp();

  const [assignments, setAssignments] = useState<Assignment[]>(() => storage.getAssignments());
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'submitted' | 'graded'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isCreating, setIsCreating] = useState(false);
  const [submittingAssignment, setSubmittingAssignment] = useState<Assignment | null>(null);
  const [gradingAssignment, setGradingAssignment] = useState<Assignment | null>(null);

  // Submission Form State
  const [submissionNotes, setSubmissionNotes] = useState('');

  // Grading Form State
  const [marksGiven, setMarksGiven] = useState<number>(0);
  const [facultyFeedback, setFacultyFeedback] = useState('');

  // Create Assignment Form State
  const courses = INITIAL_COURSES;
  const initialNewAssignment: Omit<Assignment, 'id'> = {
    title: '',
    courseCode: courses[0].code,
    courseName: courses[0].name,
    department: courses[0].department,
    dueDate: '2026-10-31',
    dueTime: '23:59',
    totalMarks: 50,
    priority: 'medium',
    description: '',
    status: 'pending',
    createdBy: currentUser.name,
  };
  const [newAssignment, setNewAssignment] = useState<Omit<Assignment, 'id'>>(initialNewAssignment);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const refreshData = () => {
    setAssignments(storage.getAssignments());
    triggerRefresh();
  };

  const filteredAssignments = assignments.filter((a) => {
    const matchesFilter = activeFilter === 'all' || a.status === activeFilter;
    const matchesSearch =
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.courseName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Handle Create Assignment
  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!newAssignment.title.trim()) errors.title = 'Title is required';
    if (!newAssignment.description.trim()) errors.description = 'Instructions/description required';
    if (newAssignment.totalMarks <= 0) errors.totalMarks = 'Marks must be greater than 0';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const selectedCourse = courses.find((c) => c.code === newAssignment.courseCode);
    storage.addAssignment({
      ...newAssignment,
      courseName: selectedCourse?.name || newAssignment.courseName,
      department: selectedCourse?.department || newAssignment.department,
      createdBy: currentUser.name,
    });

    showToast(`Created assignment: ${newAssignment.title}`, 'success');
    setIsCreating(false);
    setNewAssignment(initialNewAssignment);
    refreshData();
  };

  // Handle Student Submit
  const handleConfirmSubmit = () => {
    if (!submittingAssignment) return;
    storage.updateAssignment({
      ...submittingAssignment,
      status: 'submitted',
      submissionDate: new Date().toISOString().split('T')[0],
      submissionNotes: submissionNotes || 'Submitted by student via Smart Campus portal.',
    });
    showToast(`Assignment "${submittingAssignment.title}" submitted successfully!`, 'success');
    setSubmittingAssignment(null);
    setSubmissionNotes('');
    refreshData();
  };

  // Handle Faculty Grading
  const handleConfirmGrade = () => {
    if (!gradingAssignment) return;
    storage.updateAssignment({
      ...gradingAssignment,
      status: 'graded',
      obtainedMarks: marksGiven,
      facultyFeedback: facultyFeedback || 'Good effort. Graded according to assignment rubric.',
    });
    showToast(`Graded "${gradingAssignment.title}" with score ${marksGiven}/${gradingAssignment.totalMarks}`, 'success');
    setGradingAssignment(null);
    setMarksGiven(0);
    setFacultyFeedback('');
    refreshData();
  };

  // Handle Delete
  const handleDeleteAssignment = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete assignment "${title}"?`)) {
      storage.deleteAssignment(id);
      showToast('Assignment removed', 'info');
      refreshData();
    }
  };

  // Stats
  const totalCount = assignments.length;
  const pendingCount = assignments.filter((a) => a.status === 'pending').length;
  const submittedCount = assignments.filter((a) => a.status === 'submitted').length;
  const gradedCount = assignments.filter((a) => a.status === 'graded').length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Assignment Manager
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Manage student course deliverables, submission checkpoints, and grading rubrics.
          </p>
        </div>

        <button
          onClick={() => {
            setNewAssignment(initialNewAssignment);
            setFormErrors({});
            setIsCreating(true);
          }}
          className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Assignment</span>
        </button>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Total Items</span>
          <div className="text-xl font-extrabold text-slate-900 font-mono tabular-nums mt-0.5">
            {totalCount}
          </div>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-amber-600 uppercase">Pending Due</span>
          <div className="text-xl font-extrabold text-amber-600 font-mono tabular-nums mt-0.5">
            {pendingCount}
          </div>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-blue-600 uppercase">Submitted</span>
          <div className="text-xl font-extrabold text-blue-600 font-mono tabular-nums mt-0.5">
            {submittedCount}
          </div>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-emerald-600 uppercase">Graded</span>
          <div className="text-xl font-extrabold text-emerald-600 font-mono tabular-nums mt-0.5">
            {gradedCount}
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search assignments by title or course..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Filter Segmented Buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 self-start sm:self-auto">
          {(['all', 'pending', 'submitted', 'graded'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                activeFilter === tab
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Assignments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAssignments.length > 0 ? (
          filteredAssignments.map((asg) => {
            const isPending = asg.status === 'pending';
            const isSubmitted = asg.status === 'submitted';
            const isGraded = asg.status === 'graded';

            return (
              <div
                key={asg.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-mono font-bold text-xs border border-indigo-100">
                        {asg.courseCode}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                          asg.priority === 'high'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : asg.priority === 'medium'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {asg.priority} Priority
                      </span>
                    </div>

                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                        isGraded
                          ? 'bg-emerald-100/70 text-emerald-800'
                          : isSubmitted
                          ? 'bg-blue-100/70 text-blue-800'
                          : 'bg-amber-100/70 text-amber-800'
                      }`}
                    >
                      {asg.status}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-sm font-bold text-slate-900 leading-snug mb-1">
                    {asg.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-3">
                    {asg.description}
                  </p>

                  {/* Meta details */}
                  <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-xl text-[11px] text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Due: <strong className="text-slate-900 font-mono">{asg.dueDate}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Max Marks: <strong className="text-slate-900 font-mono">{asg.totalMarks}</strong></span>
                    </div>
                  </div>

                  {/* Grading score badge if graded */}
                  {isGraded && (
                    <div className="mt-3 p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs">
                      <div className="flex items-center justify-between font-bold text-emerald-900 mb-1">
                        <span>Evaluation Result:</span>
                        <span className="font-mono text-sm tabular-nums text-emerald-700">
                          {asg.obtainedMarks} / {asg.totalMarks} Marks
                        </span>
                      </div>
                      {asg.facultyFeedback && (
                        <p className="text-[11px] text-emerald-800 italic mt-0.5">
                          "{asg.facultyFeedback}"
                        </p>
                      )}
                    </div>
                  )}

                  {/* Submission note if submitted */}
                  {isSubmitted && asg.submissionNotes && (
                    <div className="mt-3 p-2.5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900">
                      <span className="font-semibold block mb-0.5">Submission Note:</span>
                      <p className="text-[11px] text-blue-800">{asg.submissionNotes}</p>
                    </div>
                  )}
                </div>

                {/* Bottom Action Bar */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400">By {asg.createdBy}</span>

                  <div className="flex items-center gap-1.5">
                    {/* Student Action: Submit */}
                    {isPending && (
                      <button
                        onClick={() => {
                          setSubmittingAssignment(asg);
                          setSubmissionNotes('');
                        }}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Submit Work</span>
                      </button>
                    )}

                    {/* Faculty Action: Grade */}
                    {isSubmitted && (
                      <button
                        onClick={() => {
                          setGradingAssignment(asg);
                          setMarksGiven(asg.totalMarks * 0.9);
                          setFacultyFeedback('');
                        }}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>Grade Submission</span>
                      </button>
                    )}

                    {/* Delete Option */}
                    <button
                      onClick={() => handleDeleteAssignment(asg.id, asg.title)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete assignment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
            No assignments found matching "{activeFilter}".
          </div>
        )}
      </div>

      {/* CREATE ASSIGNMENT MODAL */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-base font-bold text-slate-900">Create New Assignment</h3>
              <button
                onClick={() => setIsCreating(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                  placeholder="e.g. Graph Algorithms: Dijkstra & Bellman-Ford Implementation"
                  className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                {formErrors.title && <p className="text-rose-500 text-[10px] mt-0.5">{formErrors.title}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Course</label>
                  <select
                    value={newAssignment.courseCode}
                    onChange={(e) => {
                      const code = e.target.value;
                      const course = courses.find((c) => c.code === code);
                      setNewAssignment({
                        ...newAssignment,
                        courseCode: code,
                        courseName: course?.name || '',
                        department: course?.department || '',
                      });
                    }}
                    className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    {courses.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code} - {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={newAssignment.priority}
                    onChange={(e) =>
                      setNewAssignment({ ...newAssignment, priority: e.target.value as AssignmentPriority })
                    }
                    className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none capitalize"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Deadline Date</label>
                  <input
                    type="date"
                    value={newAssignment.dueDate}
                    onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Total Marks</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newAssignment.totalMarks}
                    onChange={(e) =>
                      setNewAssignment({ ...newAssignment, totalMarks: parseInt(e.target.value, 10) || 50 })
                    }
                    className="w-full px-3 py-2 border rounded-xl font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  {formErrors.totalMarks && (
                    <p className="text-rose-500 text-[10px] mt-0.5">{formErrors.totalMarks}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Description & Submission Requirements *
                </label>
                <textarea
                  rows={4}
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                  placeholder="Outline requirements, submission format (PDF/Zip), and scoring criteria..."
                  className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed"
                />
                {formErrors.description && (
                  <p className="text-rose-500 text-[10px] mt-0.5">{formErrors.description}</p>
                )}
              </div>

              <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2 -mx-5 -mb-5">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-xs"
                >
                  Create & Announce
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUBMISSION MODAL */}
      {submittingAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h4 className="text-sm font-bold text-slate-900">
                Submit: {submittingAssignment.title}
              </h4>
              <button
                onClick={() => setSubmittingAssignment(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-600 mb-3 leading-relaxed">
              Course: <strong className="text-slate-900">{submittingAssignment.courseCode}</strong> · Max Marks: {submittingAssignment.totalMarks}
            </p>
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Submission Notes or Repository Link
                </label>
                <textarea
                  rows={3}
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  placeholder="e.g. Attached solution PDF and Git repo: https://github.com/alexrivera/cs301-algo"
                  className="w-full px-3 py-2 text-xs border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div className="p-3 border-2 border-dashed border-slate-200 rounded-xl text-center bg-slate-50 text-slate-500 text-xs">
                <Upload className="w-5 h-5 mx-auto text-indigo-500 mb-1" />
                <span className="font-semibold text-slate-700">Digital Artifact Attached</span>
                <p className="text-[10px] text-slate-400 mt-0.5">smart_campus_submission_{submittingAssignment.courseCode}.pdf</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setSubmittingAssignment(null)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSubmit}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl"
              >
                Confirm Submission
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GRADING MODAL */}
      {gradingAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h4 className="text-sm font-bold text-slate-900">
                Grade: {gradingAssignment.title}
              </h4>
              <button
                onClick={() => setGradingAssignment(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 mb-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Marks Awarded (out of {gradingAssignment.totalMarks})
                </label>
                <input
                  type="number"
                  min="0"
                  max={gradingAssignment.totalMarks}
                  value={marksGiven}
                  onChange={(e) => setMarksGiven(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border rounded-xl font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Faculty Feedback & Remarks
                </label>
                <textarea
                  rows={3}
                  value={facultyFeedback}
                  onChange={(e) => setFacultyFeedback(e.target.value)}
                  placeholder="e.g. Clean solution architecture, excellent test coverage."
                  className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setGradingAssignment(null)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmGrade}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl"
              >
                Finalize Grade
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
