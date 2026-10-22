export type UserRole = 'faculty' | 'student' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatarUrl: string;
  title?: string;
  rollNumber?: string;
}

export type StudentStatus = 'active' | 'probation' | 'graduated';

export interface Student {
  id: string;
  rollNumber: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  year: number; // 1, 2, 3, 4
  semester: number; // 1-8
  attendancePercentage: number;
  cgpa: number;
  status: StudentStatus;
  guardianName: string;
  guardianContact: string;
  address: string;
  enrolledCourses: string[]; // course codes
  joinedDate: string;
  avatarUrl?: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'late';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  courseCode: string;
  courseName: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  markedBy: string;
  markedAt: string;
  remarks?: string;
}

export type AssignmentStatus = 'pending' | 'submitted' | 'graded';
export type AssignmentPriority = 'low' | 'medium' | 'high';

export interface Assignment {
  id: string;
  title: string;
  courseCode: string;
  courseName: string;
  department: string;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string;
  totalMarks: number;
  priority: AssignmentPriority;
  description: string;
  status: AssignmentStatus;
  submissionDate?: string;
  submissionNotes?: string;
  obtainedMarks?: number;
  facultyFeedback?: string;
  createdBy: string;
}

export type Weekday = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export interface TimetableSlot {
  id: string;
  day: Weekday;
  startTime: string; // e.g. "09:00 AM"
  endTime: string;   // e.g. "10:30 AM"
  courseCode: string;
  courseName: string;
  department: string;
  semester: number;
  room: string;
  facultyName: string;
  slotType: 'Lecture' | 'Lab' | 'Tutorial';
  colorTag: string; // Tailwind color class key e.g. "blue", "indigo", "emerald", "purple", "amber"
}

export type AnnouncementCategory = 'academic' | 'exam' | 'event' | 'urgent' | 'cultural';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: AnnouncementCategory;
  date: string;
  authorName: string;
  authorRole: string;
  isPinned: boolean;
  departmentScope: string; // 'All' or specific department
}

export interface ActivityItem {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  type: 'student' | 'attendance' | 'assignment' | 'announcement' | 'ai';
}

export interface Course {
  code: string;
  name: string;
  department: string;
  credits: number;
  faculty: string;
}

export interface SystemSettings {
  institutionName: string;
  academicYear: string;
  currentSemester: string;
  minimumAttendanceThreshold: number; // e.g. 75
  theme: 'light' | 'dark' | 'system';
  emailAlerts: boolean;
  attendanceReminders: boolean;
}
