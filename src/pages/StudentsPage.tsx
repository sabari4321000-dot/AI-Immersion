import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { storage } from '../services/storage';
import { Student } from '../types';
import {
  Search,
  Plus,
  Eye,
  Edit2,
  Trash2,
  Download,
  X,
  Check,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
} from 'lucide-react';

export const StudentsPage: React.FC = () => {
  const { showToast, triggerRefresh } = useApp();

  const [students, setStudents] = useState<Student[]>(() => storage.getStudents());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Modal states
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  // Form states for Add/Edit
  const initialFormState: Omit<Student, 'id' | 'joinedDate'> = {
    rollNumber: '',
    name: '',
    email: '',
    phone: '',
    department: 'Computer Science',
    year: 1,
    semester: 1,
    attendancePercentage: 85,
    cgpa: 3.5,
    status: 'active',
    guardianName: '',
    guardianContact: '',
    address: '',
    enrolledCourses: ['CS301', 'CS304'],
  };
  const [formData, setFormData] = useState<Omit<Student, 'id' | 'joinedDate'>>(initialFormState);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const refreshData = () => {
    setStudents(storage.getStudents());
    triggerRefresh();
  };

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'All' || s.department === selectedDept;
    const matchesYear = selectedYear === 'All' || s.year.toString() === selectedYear;
    const matchesStatus = selectedStatus === 'All' || s.status === selectedStatus;
    return matchesSearch && matchesDept && matchesYear && matchesStatus;
  });

  const departments = ['All', 'Computer Science', 'Artificial Intelligence', 'Electronics', 'Mechanical'];
  const years = ['All', '1', '2', '3', '4'];
  const statuses = ['All', 'active', 'probation', 'graduated'];

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Full name is required';
    if (!formData.rollNumber.trim()) errors.rollNumber = 'Roll number is required';
    if (!formData.email.trim() || !formData.email.includes('@')) errors.email = 'Valid college email is required';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    if (formData.cgpa < 0 || formData.cgpa > 4.0) errors.cgpa = 'CGPA must be between 0.0 and 4.0';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenAdd = () => {
    setFormData(initialFormState);
    setFormErrors({});
    setIsAddingStudent(true);
  };

  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      rollNumber: student.rollNumber,
      name: student.name,
      email: student.email,
      phone: student.phone,
      department: student.department,
      year: student.year,
      semester: student.semester,
      attendancePercentage: student.attendancePercentage,
      cgpa: student.cgpa,
      status: student.status,
      guardianName: student.guardianName,
      guardianContact: student.guardianContact,
      address: student.address,
      enrolledCourses: student.enrolledCourses,
    });
    setFormErrors({});
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingStudent) {
      storage.updateStudent({
        ...editingStudent,
        ...formData,
      });
      showToast(`Updated profile for ${formData.name}`, 'success');
      setEditingStudent(null);
    } else {
      storage.addStudent(formData);
      showToast(`Enrolled new student: ${formData.name}`, 'success');
      setIsAddingStudent(false);
    }
    refreshData();
  };

  const handleDeleteConfirm = () => {
    if (!studentToDelete) return;
    storage.deleteStudent(studentToDelete.id);
    showToast(`Removed student record: ${studentToDelete.name}`, 'info');
    setStudentToDelete(null);
    refreshData();
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Roll Number', 'Name', 'Email', 'Department', 'Year', 'Semester', 'Attendance %', 'CGPA', 'Status'];
    const rows = filteredStudents.map((s) => [
      s.rollNumber,
      `"${s.name}"`,
      s.email,
      `"${s.department}"`,
      s.year,
      s.semester,
      s.attendancePercentage,
      s.cgpa,
      s.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `smart_campus_students_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported student roster to CSV', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Student Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Maintain undergraduate records, academic eligibility, and guardian contacts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Enroll Student</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search bar */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, roll number, or email..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d === 'All' ? 'All Departments' : d}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 capitalize"
            >
              {statuses.map((st) => (
                <option key={st} value={st}>
                  {st === 'All' ? 'All Statuses' : st.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick summary line */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <span>
            Showing <strong className="text-slate-900 font-semibold">{filteredStudents.length}</strong> of{' '}
            {students.length} students
          </span>
          {(searchTerm || selectedDept !== 'All' || selectedStatus !== 'All') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedDept('All');
                setSelectedYear('All');
                setSelectedStatus('All');
              }}
              className="text-indigo-600 hover:underline font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Students Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Roll Number</th>
                <th className="py-3 px-4">Department & Year</th>
                <th className="py-3 px-4">Attendance</th>
                <th className="py-3 px-4">CGPA</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Student Name & Avatar */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {student.avatarUrl ? (
                          <img
                            src={student.avatarUrl}
                            alt={student.name}
                            className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                            {student.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-slate-900">{student.name}</div>
                          <div className="text-[11px] text-slate-500">{student.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Roll Number */}
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-700 tabular-nums">
                      {student.rollNumber}
                    </td>

                    {/* Department & Year */}
                    <td className="py-3.5 px-4">
                      <div className="text-slate-900 font-medium">{student.department}</div>
                      <div className="text-[11px] text-slate-500">
                        Year {student.year} · Sem {student.semester}
                      </div>
                    </td>

                    {/* Attendance */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono font-bold tabular-nums ${
                            student.attendancePercentage >= 75
                              ? 'text-emerald-600'
                              : 'text-amber-600'
                          }`}
                        >
                          {student.attendancePercentage}%
                        </span>
                        {student.attendancePercentage < 75 && (
                          <span
                            title="Attendance below 75% examination threshold"
                            className="w-2 h-2 rounded-full bg-amber-500"
                          />
                        )}
                      </div>
                    </td>

                    {/* CGPA */}
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-800 tabular-nums">
                      {student.cgpa.toFixed(2)}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          student.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : student.status === 'probation'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {student.status}
                      </span>
                    </td>

                    {/* Action buttons */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => setViewingStudent(student)}
                          title="View Profile"
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(student)}
                          title="Edit Student"
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setStudentToDelete(student)}
                          title="Delete Record"
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500">
                    No students matching your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW PROFILE MODAL */}
      {viewingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm">
                  {viewingStudent.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{viewingStudent.name}</h3>
                  <p className="text-xs text-slate-500 font-mono">{viewingStudent.rollNumber}</p>
                </div>
              </div>
              <button
                onClick={() => setViewingStudent(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl">
                <div>
                  <span className="text-slate-400 block mb-0.5 font-medium">Department</span>
                  <span className="font-bold text-slate-900">{viewingStudent.department}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5 font-medium">Class Status</span>
                  <span className="font-bold text-slate-900">
                    Year {viewingStudent.year} · Sem {viewingStudent.semester}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5 font-medium">Attendance</span>
                  <span
                    className={`font-mono font-bold tabular-nums ${
                      viewingStudent.attendancePercentage >= 75 ? 'text-emerald-600' : 'text-amber-600'
                    }`}
                  >
                    {viewingStudent.attendancePercentage}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5 font-medium">Cumulative GPA</span>
                  <span className="font-mono font-bold text-slate-900 tabular-nums">
                    {viewingStudent.cgpa.toFixed(2)} / 4.00
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-700">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span>{viewingStudent.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>{viewingStudent.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>{viewingStudent.address}</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <span className="font-bold text-slate-900 block mb-1.5">Guardian Details</span>
                <p className="text-slate-600">
                  {viewingStudent.guardianName} · {viewingStudent.guardianContact}
                </p>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <span className="font-bold text-slate-900 block mb-1.5">Enrolled Course Units</span>
                <div className="flex flex-wrap gap-1.5">
                  {viewingStudent.enrolledCourses.map((c) => (
                    <span
                      key={c}
                      className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[11px] font-mono font-medium border border-indigo-100"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 text-right">
              <button
                onClick={() => setViewingStudent(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {(isAddingStudent || editingStudent) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl my-8 overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-base font-bold text-slate-900">
                {editingStudent ? 'Edit Student Record' : 'Enroll New Student'}
              </h3>
              <button
                onClick={() => {
                  setIsAddingStudent(false);
                  setEditingStudent(null);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Full Name */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Maya Chen"
                    className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  {formErrors.name && <p className="text-rose-500 text-[10px] mt-0.5">{formErrors.name}</p>}
                </div>

                {/* Roll Number */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Roll Number *</label>
                  <input
                    type="text"
                    value={formData.rollNumber}
                    onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                    placeholder="e.g. CS2023-018"
                    className="w-full px-3 py-2 border rounded-xl font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  {formErrors.rollNumber && (
                    <p className="text-rose-500 text-[10px] mt-0.5">{formErrors.rollNumber}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">College Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="student@campus.edu"
                    className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  {formErrors.email && <p className="text-rose-500 text-[10px] mt-0.5">{formErrors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contact Phone *</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  {formErrors.phone && <p className="text-rose-500 text-[10px] mt-0.5">{formErrors.phone}</p>}
                </div>

                {/* Department */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Mechanical">Mechanical</option>
                  </select>
                </div>

                {/* Year & Semester */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Year</label>
                    <select
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value, 10) })}
                      className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                      <option value={1}>1st Year</option>
                      <option value={2}>2nd Year</option>
                      <option value={3}>3rd Year</option>
                      <option value={4}>4th Year</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Semester</label>
                    <select
                      value={formData.semester}
                      onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value, 10) })}
                      className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                        <option key={s} value={s}>
                          Sem {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* CGPA */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">CGPA (0.00 – 4.00)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4"
                    value={formData.cgpa}
                    onChange={(e) => setFormData({ ...formData, cgpa: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border rounded-xl font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  {formErrors.cgpa && <p className="text-rose-500 text-[10px] mt-0.5">{formErrors.cgpa}</p>}
                </div>

                {/* Status */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Academic Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none capitalize"
                  >
                    <option value="active">Active (Good Standing)</option>
                    <option value="probation">Probation (&lt;75% Attendance)</option>
                    <option value="graduated">Graduated</option>
                  </select>
                </div>
              </div>

              {/* Guardian Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Guardian Name</label>
                  <input
                    type="text"
                    value={formData.guardianName}
                    onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                    placeholder="e.g. Li Wei Chen"
                    className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Guardian Phone</label>
                  <input
                    type="text"
                    value={formData.guardianContact}
                    onChange={(e) => setFormData({ ...formData, guardianContact: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Campus Address */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Campus / Residential Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. North Quad Dormitory, Room 204"
                  className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2 -mx-5 -mb-5">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingStudent(false);
                    setEditingStudent(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-xs"
                >
                  {editingStudent ? 'Save Changes' : 'Enroll Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {studentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 border border-slate-200 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <AlertCircle className="w-5 h-5" />
              <h4 className="text-sm font-bold text-slate-900">Delete Student Record?</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Are you sure you want to remove <strong>{studentToDelete.name}</strong> ({studentToDelete.rollNumber})? This will delete the student and their associated academic profiles from the active roster.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setStudentToDelete(null)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl"
              >
                Yes, Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
