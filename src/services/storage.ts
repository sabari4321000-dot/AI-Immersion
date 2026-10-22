import {
  Student,
  AttendanceRecord,
  Assignment,
  TimetableSlot,
  Announcement,
  ActivityItem,
  Course,
  SystemSettings,
  UserProfile,
} from '../types';

import facultyAvatar from '../assets/images/faculty_dean_portrait_1792644900376.jpg';
import studentAvatar from '../assets/images/student_alex_portrait_1792644901398.jpg';

export const INITIAL_COURSES: Course[] = [
  { code: 'CS301', name: 'Design and Analysis of Algorithms', department: 'Computer Science', credits: 4, faculty: 'Dr. Evelyn Vance' },
  { code: 'CS304', name: 'Database Management Systems', department: 'Computer Science', credits: 4, faculty: 'Prof. Ramesh Gupta' },
  { code: 'AI401', name: 'Deep Learning & Neural Networks', department: 'Artificial Intelligence', credits: 4, faculty: 'Dr. Aris Thorne' },
  { code: 'CS308', name: 'Operating Systems & Concurrency', department: 'Computer Science', credits: 3, faculty: 'Prof. Maria Santos' },
  { code: 'EC204', name: 'Microprocessors & Embedded Systems', department: 'Electronics', credits: 4, faculty: 'Dr. Vikram Patel' },
  { code: 'MA201', name: 'Discrete Mathematics & Graph Theory', department: 'Mathematics', credits: 3, faculty: 'Prof. Sarah Jenkins' },
];

export const DEMO_USERS: Record<string, UserProfile> = {
  faculty: {
    id: 'fac-101',
    name: 'Dr. Evelyn Vance',
    email: 'evelyn.vance@campus.edu',
    role: 'faculty',
    department: 'Computer Science & Engineering',
    avatarUrl: facultyAvatar,
    title: 'Professor & Department Head',
  },
  student: {
    id: 'stu-501',
    name: 'Alex Rivera',
    email: 'alex.rivera@campus.edu',
    role: 'student',
    department: 'Computer Science & Engineering',
    avatarUrl: studentAvatar,
    rollNumber: 'CS2023-042',
    title: '3rd Year B.Tech Student',
  },
  admin: {
    id: 'adm-001',
    name: 'Academic Dean Office',
    email: 'registrar@campus.edu',
    role: 'admin',
    department: 'Central Administration',
    avatarUrl: facultyAvatar,
    title: 'Chief Academic Registrar',
  },
};

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'stu-1',
    rollNumber: 'CS2023-042',
    name: 'Alex Rivera',
    email: 'alex.rivera@campus.edu',
    phone: '+1 (555) 389-2104',
    department: 'Computer Science',
    year: 3,
    semester: 5,
    attendancePercentage: 91.5,
    cgpa: 3.88,
    status: 'active',
    guardianName: 'Carlos Rivera',
    guardianContact: '+1 (555) 389-9901',
    address: '42 Campus Way, North Hall, Room 312',
    enrolledCourses: ['CS301', 'CS304', 'CS308', 'MA201'],
    joinedDate: '2023-08-15',
    avatarUrl: studentAvatar,
  },
  {
    id: 'stu-2',
    rollNumber: 'CS2023-018',
    name: 'Maya Chen',
    email: 'maya.chen@campus.edu',
    phone: '+1 (555) 492-8172',
    department: 'Computer Science',
    year: 3,
    semester: 5,
    attendancePercentage: 96.2,
    cgpa: 3.95,
    status: 'active',
    guardianName: 'Li Wei Chen',
    guardianContact: '+1 (555) 492-0034',
    address: '15 West End Avenue, Apt 4B',
    enrolledCourses: ['CS301', 'CS304', 'CS308', 'AI401'],
    joinedDate: '2023-08-15',
  },
  {
    id: 'stu-3',
    rollNumber: 'AI2023-009',
    name: 'Rohan Sharma',
    email: 'rohan.sharma@campus.edu',
    phone: '+1 (555) 773-1920',
    department: 'Artificial Intelligence',
    year: 3,
    semester: 5,
    attendancePercentage: 72.4, // warning!
    cgpa: 3.42,
    status: 'probation',
    guardianName: 'Anand Sharma',
    guardianContact: '+1 (555) 773-4411',
    address: '88 Oak Ridge Terrace',
    enrolledCourses: ['AI401', 'CS301', 'MA201'],
    joinedDate: '2023-08-15',
  },
  {
    id: 'stu-4',
    rollNumber: 'CS2023-077',
    name: 'Sophia Lindqvist',
    email: 'sophia.l@campus.edu',
    phone: '+1 (555) 612-4091',
    department: 'Computer Science',
    year: 2,
    semester: 3,
    attendancePercentage: 88.0,
    cgpa: 3.65,
    status: 'active',
    guardianName: 'Henrik Lindqvist',
    guardianContact: '+1 (555) 612-9900',
    address: 'East Quad Dormitory, Block C-12',
    enrolledCourses: ['CS304', 'MA201'],
    joinedDate: '2024-08-14',
  },
  {
    id: 'stu-5',
    rollNumber: 'EC2022-012',
    name: 'Devon Miller',
    email: 'devon.miller@campus.edu',
    phone: '+1 (555) 843-6621',
    department: 'Electronics',
    year: 4,
    semester: 7,
    attendancePercentage: 84.6,
    cgpa: 3.51,
    status: 'active',
    guardianName: 'Patricia Miller',
    guardianContact: '+1 (555) 843-1122',
    address: '204 Beacon Park, Apt 10',
    enrolledCourses: ['EC204', 'CS308'],
    joinedDate: '2022-08-16',
  },
  {
    id: 'stu-6',
    rollNumber: 'AI2024-031',
    name: 'Zara Al-Mansoor',
    email: 'zara.mansoor@campus.edu',
    phone: '+1 (555) 302-8874',
    department: 'Artificial Intelligence',
    year: 2,
    semester: 3,
    attendancePercentage: 94.0,
    cgpa: 3.91,
    status: 'active',
    guardianName: 'Tariq Al-Mansoor',
    guardianContact: '+1 (555) 302-5561',
    address: 'Graduate Housing, Suite 201',
    enrolledCourses: ['AI401', 'MA201'],
    joinedDate: '2024-08-14',
  },
  {
    id: 'stu-7',
    rollNumber: 'ME2023-005',
    name: 'Marcus Vance',
    email: 'marcus.v@campus.edu',
    phone: '+1 (555) 219-9034',
    department: 'Mechanical',
    year: 3,
    semester: 5,
    attendancePercentage: 68.5, // low attendance
    cgpa: 2.95,
    status: 'probation',
    guardianName: 'Rachel Vance',
    guardianContact: '+1 (555) 219-4455',
    address: 'South Campus Commons 14',
    enrolledCourses: ['CS308', 'MA201'],
    joinedDate: '2023-08-15',
  },
  {
    id: 'stu-8',
    rollNumber: 'CS2024-102',
    name: 'Elena Rostova',
    email: 'elena.rostova@campus.edu',
    phone: '+1 (555) 554-1290',
    department: 'Computer Science',
    year: 1,
    semester: 1,
    attendancePercentage: 98.0,
    cgpa: 4.0,
    status: 'active',
    guardianName: 'Dmitri Rostov',
    guardianContact: '+1 (555) 554-9988',
    address: 'Freshman Quad Hall 5',
    enrolledCourses: ['CS301', 'MA201'],
    joinedDate: '2025-08-12',
  },
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-1',
    title: 'Dynamic Programming: Knapsack & Longest Common Subsequence',
    courseCode: 'CS301',
    courseName: 'Algorithms',
    department: 'Computer Science',
    dueDate: '2026-10-28',
    dueTime: '23:59',
    totalMarks: 50,
    priority: 'high',
    description: 'Implement memoized and bottom-up DP algorithms in TypeScript or Python, benchmark execution times, and submit formal complexity analysis PDF.',
    status: 'pending',
    createdBy: 'Dr. Evelyn Vance',
  },
  {
    id: 'asg-2',
    title: 'Relational Database Schema Design & 3NF Normalization',
    courseCode: 'CS304',
    courseName: 'Database Management Systems',
    department: 'Computer Science',
    dueDate: '2026-10-24',
    dueTime: '17:00',
    totalMarks: 30,
    priority: 'medium',
    description: 'Deconstruct un-normalized healthcare record dataset to BCNF and write 8 SQL analytical queries involving multi-table joins.',
    status: 'submitted',
    submissionDate: '2026-10-20',
    submissionNotes: 'Submitted SQL script and ER diagram PDF via Smart Campus portal.',
    createdBy: 'Prof. Ramesh Gupta',
  },
  {
    id: 'asg-3',
    title: 'Convolutional Neural Network for Medical Image Classification',
    courseCode: 'AI401',
    courseName: 'Deep Learning',
    department: 'Artificial Intelligence',
    dueDate: '2026-11-05',
    dueTime: '23:59',
    totalMarks: 100,
    priority: 'high',
    description: 'Train a CNN with transfer learning (ResNet50 / EfficientNet) on skin lesion detection. Achieve > 88% validation F1-score.',
    status: 'pending',
    createdBy: 'Dr. Aris Thorne',
  },
  {
    id: 'asg-4',
    title: 'Process Synchronization: Dining Philosophers Solution',
    courseCode: 'CS308',
    courseName: 'Operating Systems',
    department: 'Computer Science',
    dueDate: '2026-10-15',
    dueTime: '18:00',
    totalMarks: 40,
    priority: 'low',
    description: 'Solve the deadlock and starvation problems using mutex locks and POSIX counting semaphores in C/C++.',
    status: 'graded',
    submissionDate: '2026-10-14',
    submissionNotes: 'All 5 philosophers completed 100 iterations with 0 deadlock states.',
    obtainedMarks: 38,
    facultyFeedback: 'Excellent resource allocation logic and clean thread cleanup. Minor mark deducted for missing edge-case timeout log.',
    createdBy: 'Prof. Maria Santos',
  },
  {
    id: 'asg-5',
    title: 'UART Serial Communication on ARM Cortex-M4',
    courseCode: 'EC204',
    courseName: 'Microprocessors',
    department: 'Electronics',
    dueDate: '2026-10-31',
    dueTime: '23:59',
    totalMarks: 50,
    priority: 'medium',
    description: 'Configure baud rate generator and circular ring buffer for interrupt-driven UART RX/TX transfers.',
    status: 'pending',
    createdBy: 'Dr. Vikram Patel',
  },
];

export const INITIAL_TIMETABLE: TimetableSlot[] = [
  // Monday
  {
    id: 'tt-1',
    day: 'Monday',
    startTime: '09:00 AM',
    endTime: '10:30 AM',
    courseCode: 'CS301',
    courseName: 'Design & Analysis of Algorithms',
    department: 'Computer Science',
    semester: 5,
    room: 'Hall 302',
    facultyName: 'Dr. Evelyn Vance',
    slotType: 'Lecture',
    colorTag: 'indigo',
  },
  {
    id: 'tt-2',
    day: 'Monday',
    startTime: '11:00 AM',
    endTime: '12:30 PM',
    courseCode: 'CS304',
    courseName: 'Database Management Systems',
    department: 'Computer Science',
    semester: 5,
    room: 'Science Block B-14',
    facultyName: 'Prof. Ramesh Gupta',
    slotType: 'Lecture',
    colorTag: 'blue',
  },
  {
    id: 'tt-3',
    day: 'Monday',
    startTime: '02:00 PM',
    endTime: '04:00 PM',
    courseCode: 'CS301-L',
    courseName: 'Algorithm Optimization Lab',
    department: 'Computer Science',
    semester: 5,
    room: 'Computing Lab 4',
    facultyName: 'Dr. Evelyn Vance',
    slotType: 'Lab',
    colorTag: 'indigo',
  },
  // Tuesday
  {
    id: 'tt-4',
    day: 'Tuesday',
    startTime: '09:30 AM',
    endTime: '11:00 AM',
    courseCode: 'AI401',
    courseName: 'Deep Learning & Neural Networks',
    department: 'Artificial Intelligence',
    semester: 5,
    room: 'Auditorium 2',
    facultyName: 'Dr. Aris Thorne',
    slotType: 'Lecture',
    colorTag: 'purple',
  },
  {
    id: 'tt-5',
    day: 'Tuesday',
    startTime: '11:30 AM',
    endTime: '01:00 PM',
    courseCode: 'CS308',
    courseName: 'Operating Systems & Concurrency',
    department: 'Computer Science',
    semester: 5,
    room: 'Hall 201',
    facultyName: 'Prof. Maria Santos',
    slotType: 'Lecture',
    colorTag: 'emerald',
  },
  // Wednesday
  {
    id: 'tt-6',
    day: 'Wednesday',
    startTime: '09:00 AM',
    endTime: '10:30 AM',
    courseCode: 'MA201',
    courseName: 'Discrete Mathematics',
    department: 'Mathematics',
    semester: 5,
    room: 'Hall 105',
    facultyName: 'Prof. Sarah Jenkins',
    slotType: 'Lecture',
    colorTag: 'amber',
  },
  {
    id: 'tt-7',
    day: 'Wednesday',
    startTime: '02:00 PM',
    endTime: '05:00 PM',
    courseCode: 'CS304-L',
    courseName: 'DBMS SQL & Tuning Lab',
    department: 'Computer Science',
    semester: 5,
    room: 'Database Lab 2',
    facultyName: 'Prof. Ramesh Gupta',
    slotType: 'Lab',
    colorTag: 'blue',
  },
  // Thursday
  {
    id: 'tt-8',
    day: 'Thursday',
    startTime: '10:00 AM',
    endTime: '11:30 AM',
    courseCode: 'AI401',
    courseName: 'Deep Learning Seminar',
    department: 'Artificial Intelligence',
    semester: 5,
    room: 'Seminar Hall A',
    facultyName: 'Dr. Aris Thorne',
    slotType: 'Tutorial',
    colorTag: 'purple',
  },
  {
    id: 'tt-9',
    day: 'Thursday',
    startTime: '01:30 PM',
    endTime: '03:00 PM',
    courseCode: 'CS308',
    courseName: 'Kernel Programming Lab',
    department: 'Computer Science',
    semester: 5,
    room: 'Systems Lab 1',
    facultyName: 'Prof. Maria Santos',
    slotType: 'Lab',
    colorTag: 'emerald',
  },
  // Friday
  {
    id: 'tt-10',
    day: 'Friday',
    startTime: '09:00 AM',
    endTime: '10:30 AM',
    courseCode: 'CS301',
    courseName: 'Algorithms Problem Solving',
    department: 'Computer Science',
    semester: 5,
    room: 'Hall 302',
    facultyName: 'Dr. Evelyn Vance',
    slotType: 'Lecture',
    colorTag: 'indigo',
  },
  {
    id: 'tt-11',
    day: 'Friday',
    startTime: '11:00 AM',
    endTime: '12:30 PM',
    courseCode: 'EC204',
    courseName: 'Microprocessors & Embedded',
    department: 'Electronics',
    semester: 5,
    room: 'Hardware Lab 3',
    facultyName: 'Dr. Vikram Patel',
    slotType: 'Lecture',
    colorTag: 'sky',
  },
  // Saturday
  {
    id: 'tt-12',
    day: 'Saturday',
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    courseCode: 'SEM-AI',
    courseName: 'Industry AI Ethics & Project Review',
    department: 'Computer Science',
    semester: 5,
    room: 'Virtual Room / Tech Aud',
    facultyName: 'Guest Keynote Faculty',
    slotType: 'Tutorial',
    colorTag: 'rose',
  },
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Mid-Term Examination Schedule - Autumn Semester 2026',
    content: 'The official schedule for Autumn 2026 Mid-Semester examinations has been published. Theory examinations will commence from November 10th. Hall tickets will be issued digitally 3 days prior. All students must verify minimum 75% attendance compliance to be eligible.',
    category: 'exam',
    date: '2026-10-21',
    authorName: 'Dr. Evelyn Vance',
    authorRole: 'HOD Computer Science',
    isPinned: true,
    departmentScope: 'All',
  },
  {
    id: 'ann-2',
    title: 'Smart Campus AI Study Assistant v2.4 Live in Beta',
    content: 'Students can now use the integrated Gemini AI Study Assistant for generating step-by-step conceptual explanations, summarizing lengthy syllabus topics, taking personalized MCQ quizzes, and creating custom study timelines.',
    category: 'academic',
    date: '2026-10-19',
    authorName: 'Academic Tech Committee',
    authorRole: 'Dean Office',
    isPinned: true,
    departmentScope: 'All',
  },
  {
    id: 'ann-3',
    title: 'Annual Smart Hackathon & Tech Symposium 2026 Registrations Open',
    content: 'Teams of up to 4 students from CSE, AI-DS, and ECE are invited to register for the 36-hour Smart Campus Hackathon on November 20-21. Cash prizes exceeding $5,000 and industry mentorship provided.',
    category: 'event',
    date: '2026-10-18',
    authorName: 'Campus Innovation Council',
    authorRole: 'Faculty Coordinator',
    isPinned: false,
    departmentScope: 'All',
  },
  {
    id: 'ann-4',
    title: 'Library Hours Extended for Examination Preparation',
    content: 'The Central University Library and 24/7 Digital Learning commons will remain open until 2:00 AM daily from October 25th through final examinations.',
    category: 'academic',
    date: '2026-10-16',
    authorName: 'Chief University Librarian',
    authorRole: 'Administration',
    isPinned: false,
    departmentScope: 'All',
  },
  {
    id: 'ann-5',
    title: 'Severe Weather Advisory: Hybrid Mode Available on Friday',
    content: 'Due to municipal storm warnings scheduled for this Friday afternoon, all lab practicals will end by 2:00 PM, and subsequent tutorial sessions will be hosted on university web conference.',
    category: 'urgent',
    date: '2026-10-15',
    authorName: 'Campus Safety & Facilities',
    authorRole: 'Campus Registrar',
    isPinned: false,
    departmentScope: 'All',
  },
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att-1',
    studentId: 'stu-1',
    studentName: 'Alex Rivera',
    rollNumber: 'CS2023-042',
    courseCode: 'CS301',
    courseName: 'Algorithms',
    date: '2026-10-21',
    status: 'present',
    markedBy: 'Dr. Evelyn Vance',
    markedAt: '09:05 AM',
  },
  {
    id: 'att-2',
    studentId: 'stu-2',
    studentName: 'Maya Chen',
    rollNumber: 'CS2023-018',
    courseCode: 'CS301',
    courseName: 'Algorithms',
    date: '2026-10-21',
    status: 'present',
    markedBy: 'Dr. Evelyn Vance',
    markedAt: '09:05 AM',
  },
  {
    id: 'att-3',
    studentId: 'stu-3',
    studentName: 'Rohan Sharma',
    rollNumber: 'AI2023-009',
    courseCode: 'CS301',
    courseName: 'Algorithms',
    date: '2026-10-21',
    status: 'absent',
    markedBy: 'Dr. Evelyn Vance',
    markedAt: '09:06 AM',
    remarks: 'Medical leave requested',
  },
  {
    id: 'att-4',
    studentId: 'stu-4',
    studentName: 'Sophia Lindqvist',
    rollNumber: 'CS2023-077',
    courseCode: 'CS301',
    courseName: 'Algorithms',
    date: '2026-10-21',
    status: 'present',
    markedBy: 'Dr. Evelyn Vance',
    markedAt: '09:05 AM',
  },
  {
    id: 'att-5',
    studentId: 'stu-7',
    studentName: 'Marcus Vance',
    rollNumber: 'ME2023-005',
    courseCode: 'CS301',
    courseName: 'Algorithms',
    date: '2026-10-21',
    status: 'late',
    markedBy: 'Dr. Evelyn Vance',
    markedAt: '09:22 AM',
    remarks: 'Arrived 20 mins late due to transit delay',
  },
  {
    id: 'att-6',
    studentId: 'stu-1',
    studentName: 'Alex Rivera',
    rollNumber: 'CS2023-042',
    courseCode: 'CS304',
    courseName: 'Database Management Systems',
    date: '2026-10-20',
    status: 'present',
    markedBy: 'Prof. Ramesh Gupta',
    markedAt: '11:02 AM',
  },
  {
    id: 'att-7',
    studentId: 'stu-3',
    studentName: 'Rohan Sharma',
    rollNumber: 'AI2023-009',
    courseCode: 'CS304',
    courseName: 'Database Management Systems',
    date: '2026-10-20',
    status: 'absent',
    markedBy: 'Prof. Ramesh Gupta',
    markedAt: '11:02 AM',
  },
];

export const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    user: 'Dr. Evelyn Vance',
    action: 'Marked attendance for CS301 Algorithms',
    target: 'Lecture Hall 302 (28 present, 2 absent)',
    timestamp: '10 minutes ago',
    type: 'attendance',
  },
  {
    id: 'act-2',
    user: 'Alex Rivera',
    action: 'Submitted assignment solution for',
    target: 'CS304: Relational Schema Design',
    timestamp: '2 hours ago',
    type: 'assignment',
  },
  {
    id: 'act-3',
    user: 'Academic Dean Office',
    action: 'Published university circular',
    target: 'Mid-Term Examination Schedule - Autumn 2026',
    timestamp: '4 hours ago',
    type: 'announcement',
  },
  {
    id: 'act-4',
    user: 'Prof. Maria Santos',
    action: 'Graded 32 submissions with feedback for',
    target: 'CS308: Dining Philosophers Solution',
    timestamp: 'Yesterday',
    type: 'assignment',
  },
  {
    id: 'act-5',
    user: 'Smart AI Study Assistant',
    action: 'Generated 5-question dynamic quiz on',
    target: 'Dijkstra and A* Graph Search Algorithms',
    timestamp: 'Yesterday',
    type: 'ai',
  },
];

export const INITIAL_SETTINGS: SystemSettings = {
  institutionName: 'Apex Institute of Technology & Science',
  academicYear: '2026 - 2027',
  currentSemester: 'Semester 5 (Autumn)',
  minimumAttendanceThreshold: 75,
  theme: 'light',
  emailAlerts: true,
  attendanceReminders: true,
};

// Storage keys
const STORAGE_KEYS = {
  STUDENTS: 'sc_students_v1',
  ASSIGNMENTS: 'sc_assignments_v1',
  TIMETABLE: 'sc_timetable_v1',
  ANNOUNCEMENTS: 'sc_announcements_v1',
  ATTENDANCE: 'sc_attendance_v1',
  ACTIVITIES: 'sc_activities_v1',
  SETTINGS: 'sc_settings_v1',
  CURRENT_USER_ROLE: 'sc_current_role_v1',
};

// Storage Service Class
class StorageService {
  private get<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  }

  private set<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn('Storage set failed:', e);
    }
  }

  // Current Role
  getCurrentRole(): 'faculty' | 'student' | 'admin' {
    return this.get<'faculty' | 'student' | 'admin'>(STORAGE_KEYS.CURRENT_USER_ROLE, 'faculty');
  }

  setCurrentRole(role: 'faculty' | 'student' | 'admin'): void {
    this.set(STORAGE_KEYS.CURRENT_USER_ROLE, role);
  }

  // Students
  getStudents(): Student[] {
    return this.get<Student[]>(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
  }

  addStudent(student: Omit<Student, 'id' | 'joinedDate'>): Student {
    const students = this.getStudents();
    const newStudent: Student = {
      ...student,
      id: `stu-${Date.now()}`,
      joinedDate: new Date().toISOString().split('T')[0],
    };
    students.unshift(newStudent);
    this.set(STORAGE_KEYS.STUDENTS, students);
    this.addActivity('Admin', 'Enrolled new student record', `${newStudent.name} (${newStudent.rollNumber})`, 'student');
    return newStudent;
  }

  updateStudent(student: Student): void {
    const students = this.getStudents().map((s) => (s.id === student.id ? student : s));
    this.set(STORAGE_KEYS.STUDENTS, students);
    this.addActivity('Faculty/Admin', 'Updated student profile info', `${student.name} (${student.rollNumber})`, 'student');
  }

  deleteStudent(id: string): void {
    const current = this.getStudents();
    const toDelete = current.find((s) => s.id === id);
    const updated = current.filter((s) => s.id !== id);
    this.set(STORAGE_KEYS.STUDENTS, updated);
    if (toDelete) {
      this.addActivity('Admin', 'Deleted student record', `${toDelete.name} (${toDelete.rollNumber})`, 'student');
    }
  }

  // Attendance
  getAttendance(): AttendanceRecord[] {
    return this.get<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
  }

  recordAttendanceBatch(records: Omit<AttendanceRecord, 'id' | 'markedAt'>[]): void {
    const current = this.getAttendance();
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newRecords: AttendanceRecord[] = records.map((r) => ({
      ...r,
      id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      markedAt: nowTime,
    }));

    // Replace existing records for same student, course, date if any
    const recordMap = new Map<string, AttendanceRecord>();
    for (const r of current) {
      recordMap.set(`${r.studentId}_${r.courseCode}_${r.date}`, r);
    }
    for (const nr of newRecords) {
      recordMap.set(`${nr.studentId}_${nr.courseCode}_${nr.date}`, nr);
    }

    const consolidated = Array.from(recordMap.values());
    this.set(STORAGE_KEYS.ATTENDANCE, consolidated);

    // Recalculate each student's overall attendance %
    this.recalculateStudentPercentages(consolidated);

    this.addActivity(
      'Faculty',
      `Marked attendance for ${records.length} students in`,
      records[0]?.courseName || 'Course',
      'attendance'
    );
  }

  private recalculateStudentPercentages(attendanceList: AttendanceRecord[]): void {
    const students = this.getStudents();
    const updated = students.map((stu) => {
      const stuRecords = attendanceList.filter((a) => a.studentId === stu.id);
      if (stuRecords.length === 0) return stu;
      const presentCount = stuRecords.filter((a) => a.status === 'present' || a.status === 'late').length;
      const pct = Math.round((presentCount / stuRecords.length) * 1000) / 10;
      return {
        ...stu,
        attendancePercentage: pct,
        status: (pct < 75 ? 'probation' : 'active') as any,
      };
    });
    this.set(STORAGE_KEYS.STUDENTS, updated);
  }

  // Assignments
  getAssignments(): Assignment[] {
    return this.get<Assignment[]>(STORAGE_KEYS.ASSIGNMENTS, INITIAL_ASSIGNMENTS);
  }

  addAssignment(assignment: Omit<Assignment, 'id'>): Assignment {
    const assignments = this.getAssignments();
    const newAssignment: Assignment = {
      ...assignment,
      id: `asg-${Date.now()}`,
    };
    assignments.unshift(newAssignment);
    this.set(STORAGE_KEYS.ASSIGNMENTS, assignments);
    this.addActivity(newAssignment.createdBy, 'Created new assignment', `${newAssignment.courseCode}: ${newAssignment.title}`, 'assignment');
    return newAssignment;
  }

  updateAssignment(assignment: Assignment): void {
    const assignments = this.getAssignments().map((a) => (a.id === assignment.id ? assignment : a));
    this.set(STORAGE_KEYS.ASSIGNMENTS, assignments);
  }

  deleteAssignment(id: string): void {
    const current = this.getAssignments();
    const toDelete = current.find((a) => a.id === id);
    const updated = current.filter((a) => a.id !== id);
    this.set(STORAGE_KEYS.ASSIGNMENTS, updated);
    if (toDelete) {
      this.addActivity('Faculty', 'Removed assignment', toDelete.title, 'assignment');
    }
  }

  // Timetable
  getTimetable(): TimetableSlot[] {
    return this.get<TimetableSlot[]>(STORAGE_KEYS.TIMETABLE, INITIAL_TIMETABLE);
  }

  addTimetableSlot(slot: Omit<TimetableSlot, 'id'>): TimetableSlot {
    const timetable = this.getTimetable();
    const newSlot: TimetableSlot = {
      ...slot,
      id: `tt-${Date.now()}`,
    };
    timetable.push(newSlot);
    this.set(STORAGE_KEYS.TIMETABLE, timetable);
    return newSlot;
  }

  updateTimetableSlot(slot: TimetableSlot): void {
    const timetable = this.getTimetable().map((s) => (s.id === slot.id ? slot : s));
    this.set(STORAGE_KEYS.TIMETABLE, timetable);
  }

  deleteTimetableSlot(id: string): void {
    const updated = this.getTimetable().filter((s) => s.id !== id);
    this.set(STORAGE_KEYS.TIMETABLE, updated);
  }

  // Announcements
  getAnnouncements(): Announcement[] {
    return this.get<Announcement[]>(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
  }

  addAnnouncement(announcement: Omit<Announcement, 'id'>): Announcement {
    const announcements = this.getAnnouncements();
    const newAnn: Announcement = {
      ...announcement,
      id: `ann-${Date.now()}`,
    };
    announcements.unshift(newAnn);
    this.set(STORAGE_KEYS.ANNOUNCEMENTS, announcements);
    this.addActivity(newAnn.authorName, 'Published new campus announcement', newAnn.title, 'announcement');
    return newAnn;
  }

  deleteAnnouncement(id: string): void {
    const updated = this.getAnnouncements().filter((a) => a.id !== id);
    this.set(STORAGE_KEYS.ANNOUNCEMENTS, updated);
  }

  togglePinAnnouncement(id: string): void {
    const updated = this.getAnnouncements().map((a) => (a.id === id ? { ...a, isPinned: !a.isPinned } : a));
    this.set(STORAGE_KEYS.ANNOUNCEMENTS, updated);
  }

  // Activity Log
  getActivities(): ActivityItem[] {
    return this.get<ActivityItem[]>(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
  }

  addActivity(user: string, action: string, target: string, type: ActivityItem['type']): void {
    const activities = this.getActivities();
    const newAct: ActivityItem = {
      id: `act-${Date.now()}`,
      user,
      action,
      target,
      timestamp: 'Just now',
      type,
    };
    activities.unshift(newAct);
    if (activities.length > 20) activities.pop();
    this.set(STORAGE_KEYS.ACTIVITIES, activities);
  }

  // Settings
  getSettings(): SystemSettings {
    return this.get<SystemSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  }

  updateSettings(settings: SystemSettings): void {
    this.set(STORAGE_KEYS.SETTINGS, settings);
  }

  // Reset to Defaults
  resetAllToDefaults(): void {
    this.set(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
    this.set(STORAGE_KEYS.ASSIGNMENTS, INITIAL_ASSIGNMENTS);
    this.set(STORAGE_KEYS.TIMETABLE, INITIAL_TIMETABLE);
    this.set(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
    this.set(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
    this.set(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
    this.set(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  }
}

export const storage = new StorageService();
