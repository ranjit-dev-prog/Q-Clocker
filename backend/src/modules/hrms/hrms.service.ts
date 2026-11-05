import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
  Optional,
} from '@nestjs/common';
import * as ExcelJS from 'exceljs';
const PDFDocument = require('pdfkit');
import * as crypto from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { generateReferenceId } from '../../common/utils/reference-id.util';
import {
  HrmsDashboardResponse,
  HrmsKpiSummary,
  AttendanceOverviewSummary,
  DepartmentHeadcountStat,
  UpcomingMilestoneItem,
  PendingHrActionItem,
  RecentEmployeeActivity,
} from './dto/hrms-dashboard.dto';
import {
  CreateHrmsEmployeeDto,
  UpdateHrmsEmployeeDto,
  UpdateEmployeeStatusDto,
  HrmsEmployeeQueryDto,
  EmploymentStatus,
} from './dto/hrms-employee.dto';
import {
  AttendancePunchDto,
  AttendanceCorrectionRequestDto,
  AttendanceCorrectionDecisionDto,
} from './dto/hrms-attendance.dto';
import {
  CreateLeaveRequestDto,
  LeaveRequestDecisionDto,
  CreateLeaveTypeDto,
} from './dto/hrms-leave.dto';
import { ToggleOnboardingTaskDto } from './dto/hrms-onboarding.dto';
import { UploadDocumentDto, VerifyDocumentDto } from './dto/hrms-document.dto';
import { InitiateExitDto, UpdateExitClearanceDto } from './dto/hrms-exit.dto';
import { DecideApprovalDto } from './dto/hrms-approval.dto';

@Injectable()
export class HrmsService {
  private readonly logger = new Logger(HrmsService.name);

  // In-Memory Storage for High-Speed Resilient Fallback & Deterministic Enterprise State
  private memoryEmployees: Array<any> = [
    {
      id: '00000000-0000-0000-0000-000000000001',
      referenceId: 'EMP-ADM001',
      employeeCode: 'EMP-ADM001',
      firstName: 'Alexander',
      lastName: 'Vance',
      email: 'superadmin@qclocker.io',
      personalEmail: 'alex.vance@gmail.com',
      phone: '+1-555-0100',
      departmentId: '10000000-0000-0000-0000-000000000001',
      departmentName: 'Information Technology',
      designationId: '30000000-0000-0000-0000-000000000001',
      designationName: 'Chief Information Officer',
      jobTitle: 'Chief Information Officer',
      roleCode: 'SUPER_ADMIN',
      managerId: null,
      managerName: null,
      employmentType: 'FULL_TIME',
      joiningDate: '2024-01-15',
      workLocation: 'Headquarters - Executive Wing',
      accountStatus: 'ACTIVE',
      isActive: true,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      createdAt: new Date('2024-01-15'),
    },
    {
      id: '00000000-0000-0000-0000-000000000002',
      referenceId: 'EMP-MGR001',
      employeeCode: 'EMP-MGR001',
      firstName: 'Marcus',
      lastName: 'Chen',
      email: 'itmanager@qclocker.io',
      personalEmail: 'marcus.chen@gmail.com',
      phone: '+1-555-0101',
      departmentId: '10000000-0000-0000-0000-000000000001',
      departmentName: 'Information Technology',
      designationId: '30000000-0000-0000-0000-000000000002',
      designationName: 'IT Operations Manager',
      jobTitle: 'IT Infrastructure & Operations Manager',
      roleCode: 'ADMIN',
      managerId: '00000000-0000-0000-0000-000000000001',
      managerName: 'Alexander Vance',
      employmentType: 'FULL_TIME',
      joiningDate: '2024-06-01',
      workLocation: 'Headquarters - Building B',
      accountStatus: 'ACTIVE',
      isActive: true,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      createdAt: new Date('2024-06-01'),
    },
    {
      id: '00000000-0000-0000-0000-000000000003',
      referenceId: 'EMP-HR0001',
      employeeCode: 'EMP-HR0001',
      firstName: 'Elena',
      lastName: 'Rostova',
      email: 'hrmanager@qclocker.io',
      personalEmail: 'elena.rostova@outlook.com',
      phone: '+1-555-0105',
      departmentId: '10000000-0000-0000-0000-000000000002',
      departmentName: 'Human Resources',
      designationId: '30000000-0000-0000-0000-000000000003',
      designationName: 'People Operations Director',
      jobTitle: 'Head of People Operations & HRMS',
      roleCode: 'HR_MANAGER',
      managerId: '00000000-0000-0000-0000-000000000001',
      managerName: 'Alexander Vance',
      employmentType: 'FULL_TIME',
      joiningDate: '2024-03-10',
      workLocation: 'Headquarters - HR Suite',
      accountStatus: 'ACTIVE',
      isActive: true,
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      createdAt: new Date('2024-03-10'),
    },
    {
      id: '00000000-0000-0000-0000-000000000004',
      referenceId: 'EMP-DEV001',
      employeeCode: 'EMP-DEV001',
      firstName: 'David',
      lastName: 'Ross',
      email: 'employee@qclocker.io',
      personalEmail: 'david.ross.tech@gmail.com',
      phone: '+1-555-0103',
      departmentId: '10000000-0000-0000-0000-000000000003',
      departmentName: 'Software Engineering',
      designationId: '30000000-0000-0000-0000-000000000004',
      designationName: 'Staff Software Architect',
      jobTitle: 'Full-Stack Software Engineer',
      roleCode: 'EMPLOYEE',
      managerId: '00000000-0000-0000-0000-000000000005',
      managerName: 'Sarah Jenkins',
      employmentType: 'FULL_TIME',
      joiningDate: '2025-02-15',
      workLocation: 'San Francisco Tech Hub',
      accountStatus: 'ACTIVE',
      isActive: true,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      createdAt: new Date('2025-02-15'),
    },
    {
      id: '00000000-0000-0000-0000-000000000005',
      referenceId: 'EMP-TL0001',
      employeeCode: 'EMP-TL0001',
      firstName: 'Sarah',
      lastName: 'Jenkins',
      email: 'teamlead@qclocker.io',
      personalEmail: 'sarah.j.code@gmail.com',
      phone: '+1-555-0102',
      departmentId: '10000000-0000-0000-0000-000000000003',
      departmentName: 'Software Engineering',
      designationId: '30000000-0000-0000-0000-000000000005',
      designationName: 'Engineering Lead',
      jobTitle: 'Senior Platform Engineering Lead',
      roleCode: 'TEAM_LEAD',
      managerId: '00000000-0000-0000-0000-000000000001',
      managerName: 'Alexander Vance',
      employmentType: 'FULL_TIME',
      joiningDate: '2024-05-18',
      workLocation: 'San Francisco Tech Hub',
      accountStatus: 'ACTIVE',
      isActive: true,
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
      createdAt: new Date('2024-05-18'),
    },
    {
      id: '00000000-0000-0000-0000-000000000006',
      referenceId: 'EMP-ENG002',
      employeeCode: 'EMP-ENG002',
      firstName: 'Chloe',
      lastName: 'Dupont',
      email: 'chloe.dupont@qclocker.io',
      personalEmail: 'chloe.d@outlook.fr',
      phone: '+1-555-0109',
      departmentId: '10000000-0000-0000-0000-000000000003',
      departmentName: 'Software Engineering',
      designationId: '30000000-0000-0000-0000-000000000004',
      designationName: 'Full-Stack Engineer',
      jobTitle: 'Frontend Angular Specialist',
      roleCode: 'EMPLOYEE',
      managerId: '00000000-0000-0000-0000-000000000005',
      managerName: 'Sarah Jenkins',
      employmentType: 'FULL_TIME',
      joiningDate: '2026-10-15',
      workLocation: 'Paris Remote Office',
      accountStatus: 'PROBATION',
      isActive: true,
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      createdAt: new Date('2026-10-15'),
    },
    {
      id: '00000000-0000-0000-0000-000000000007',
      referenceId: 'EMP-OPS001',
      employeeCode: 'EMP-OPS001',
      firstName: 'Rajesh',
      lastName: 'Kumar',
      email: 'rajesh.kumar@qclocker.io',
      personalEmail: 'rajesh.k@gmail.com',
      phone: '+1-555-0112',
      departmentId: '10000000-0000-0000-0000-000000000004',
      departmentName: 'Operations & Logistics',
      designationId: '30000000-0000-0000-0000-000000000006',
      designationName: 'Operations Lead',
      jobTitle: 'Operations Delivery Manager',
      roleCode: 'EMPLOYEE',
      managerId: '00000000-0000-0000-0000-000000000001',
      managerName: 'Alexander Vance',
      employmentType: 'FULL_TIME',
      joiningDate: '2025-08-01',
      workLocation: 'Austin Logistics Hub',
      accountStatus: 'ON_LEAVE',
      isActive: true,
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
      createdAt: new Date('2025-08-01'),
    },
    {
      id: '00000000-0000-0000-0000-000000000008',
      referenceId: 'EMP-SEC001',
      employeeCode: 'EMP-SEC001',
      firstName: 'Vikram',
      lastName: 'Patel',
      email: 'vikram.patel@qclocker.io',
      personalEmail: 'vikram.p.cyber@gmail.com',
      phone: '+1-555-0115',
      departmentId: '10000000-0000-0000-0000-000000000001',
      departmentName: 'Information Technology',
      designationId: '30000000-0000-0000-0000-000000000007',
      designationName: 'Cybersecurity Architect',
      jobTitle: 'Senior Threat Hunter',
      roleCode: 'EMPLOYEE',
      managerId: '00000000-0000-0000-0000-000000000002',
      managerName: 'Marcus Chen',
      employmentType: 'FULL_TIME',
      joiningDate: '2024-11-20',
      workLocation: 'Headquarters - Cyber SOC',
      accountStatus: 'NOTICE_PERIOD',
      isActive: true,
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
      createdAt: new Date('2024-11-20'),
    },
    {
      id: '00000000-0000-0000-0000-000000000009',
      referenceId: 'EMP-ENG003',
      employeeCode: 'EMP-ENG003',
      firstName: 'Hannah',
      lastName: 'Schmidt',
      email: 'hannah.schmidt@qclocker.io',
      personalEmail: 'hannah.s@web.de',
      phone: '+1-555-0119',
      departmentId: '10000000-0000-0000-0000-000000000003',
      departmentName: 'Software Engineering',
      designationId: '30000000-0000-0000-0000-000000000004',
      designationName: 'QA Automation Lead',
      jobTitle: 'Staff Test Automation Architect',
      roleCode: 'EMPLOYEE',
      managerId: '00000000-0000-0000-0000-000000000005',
      managerName: 'Sarah Jenkins',
      employmentType: 'FULL_TIME',
      joiningDate: '2026-11-01',
      workLocation: 'Berlin Remote Studio',
      accountStatus: 'ACTIVE',
      isActive: true,
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      createdAt: new Date('2026-11-01'),
    },
    {
      id: '00000000-0000-0000-0000-000000000010',
      referenceId: 'EMP-DEV002',
      employeeCode: 'EMP-DEV002',
      firstName: 'Liam',
      lastName: 'O\'Connor',
      email: 'liam.oconnor@qclocker.io',
      personalEmail: 'liam.oc@gmail.com',
      phone: '+1-555-0122',
      departmentId: '10000000-0000-0000-0000-000000000003',
      departmentName: 'Software Engineering',
      designationId: '30000000-0000-0000-0000-000000000004',
      designationName: 'Backend Engineer',
      jobTitle: 'Distributed Systems Engineer',
      roleCode: 'EMPLOYEE',
      managerId: '00000000-0000-0000-0000-000000000005',
      managerName: 'Sarah Jenkins',
      employmentType: 'FULL_TIME',
      joiningDate: '2026-11-03',
      workLocation: 'Dublin Tech Lab',
      accountStatus: 'PROBATION',
      isActive: true,
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
      createdAt: new Date('2026-11-03'),
    },
  ];

  private memoryLeaveTypes: Array<any> = [
    { id: '1', code: 'CASUAL_LEAVE', name: 'Casual Leave (CL)', annualAllowanceDays: 12, isPaid: true, requiresAttachment: false, description: 'Periodic leave for urgent personal errands' },
    { id: '2', code: 'SICK_LEAVE', name: 'Sick & Medical Leave (SL)', annualAllowanceDays: 10, isPaid: true, requiresAttachment: true, description: 'Medical recuperation and health appointments' },
    { id: '3', code: 'EARNED_LEAVE', name: 'Earned / Annual Vacation (EL)', annualAllowanceDays: 18, isPaid: true, requiresAttachment: false, description: 'Accrued annual vacation and personal time off' },
    { id: '4', code: 'PRIVILEGE_LEAVE', name: 'Privilege Leave (PL)', annualAllowanceDays: 15, isPaid: true, requiresAttachment: false, description: 'Executive and tenure-based sabbatical blocks' },
    { id: '5', code: 'UNPAID_LEAVE', name: 'Leave Without Pay (LWP)', annualAllowanceDays: 30, isPaid: false, requiresAttachment: false, description: 'Extended unpaid personal or study leave' },
    { id: '6', code: 'PARENTAL_LEAVE', name: 'Maternity & Paternity Leave', annualAllowanceDays: 84, isPaid: true, requiresAttachment: true, description: 'Paid childbirth, adoption, and infant care leave' },
  ];

  private memoryLeaveBalances: Map<string, Array<any>> = new Map([
    [
      '00000000-0000-0000-0000-000000000004', // David Ross
      [
        { leaveTypeCode: 'CASUAL_LEAVE', leaveTypeName: 'Casual Leave', allocatedDays: 12, usedDays: 3, pendingDays: 1, remainingDays: 8 },
        { leaveTypeCode: 'SICK_LEAVE', leaveTypeName: 'Sick Leave', allocatedDays: 10, usedDays: 1, pendingDays: 0, remainingDays: 9 },
        { leaveTypeCode: 'EARNED_LEAVE', leaveTypeName: 'Earned Vacation', allocatedDays: 18, usedDays: 4, pendingDays: 0, remainingDays: 14 },
        { leaveTypeCode: 'PRIVILEGE_LEAVE', leaveTypeName: 'Privilege Leave', allocatedDays: 15, usedDays: 0, pendingDays: 0, remainingDays: 15 },
        { leaveTypeCode: 'UNPAID_LEAVE', leaveTypeName: 'Leave Without Pay', allocatedDays: 30, usedDays: 0, pendingDays: 0, remainingDays: 30 },
      ],
    ],
  ]);

  private memoryLeaveRequests: Array<any> = [
    {
      id: 'LEV-9011',
      referenceId: 'LEV-9011',
      employeeId: '00000000-0000-0000-0000-000000000004',
      employeeName: 'David Ross',
      employeeCode: 'EMP-DEV001',
      departmentName: 'Software Engineering',
      leaveTypeCode: 'CASUAL_LEAVE',
      leaveTypeName: 'Casual Leave',
      startDate: '2026-11-12',
      endDate: '2026-11-13',
      totalDays: 2,
      reason: 'Family wedding event in Seattle',
      status: 'PENDING',
      approverId: '00000000-0000-0000-0000-000000000005',
      approverName: 'Sarah Jenkins',
      createdAt: new Date(Date.now() - 3600 * 1000 * 4),
    },
    {
      id: 'LEV-9012',
      referenceId: 'LEV-9012',
      employeeId: '00000000-0000-0000-0000-000000000007',
      employeeName: 'Rajesh Kumar',
      employeeCode: 'EMP-OPS001',
      departmentName: 'Operations & Logistics',
      leaveTypeCode: 'EARNED_LEAVE',
      leaveTypeName: 'Earned Vacation',
      startDate: '2026-11-04',
      endDate: '2026-11-08',
      totalDays: 5,
      reason: 'Annual family holiday trip',
      status: 'APPROVED',
      approverId: '00000000-0000-0000-0000-000000000001',
      approverName: 'Alexander Vance',
      decidedAt: new Date('2026-11-01'),
      createdAt: new Date('2026-10-25'),
    },
    {
      id: 'LEV-9013',
      referenceId: 'LEV-9013',
      employeeId: '00000000-0000-0000-0000-000000000006',
      employeeName: 'Chloe Dupont',
      employeeCode: 'EMP-ENG002',
      departmentName: 'Software Engineering',
      leaveTypeCode: 'SICK_LEAVE',
      leaveTypeName: 'Sick Leave',
      startDate: '2026-11-05',
      endDate: '2026-11-05',
      totalDays: 1,
      reason: 'Severe migraine; resting under physician recommendation',
      status: 'PENDING',
      approverId: '00000000-0000-0000-0000-000000000003',
      approverName: 'Elena Rostova',
      createdAt: new Date(Date.now() - 3600 * 1000 * 2),
    },
  ];

  private memoryAttendanceDaily: Array<any> = [
    {
      employeeId: '00000000-0000-0000-0000-000000000001',
      employeeName: 'Alexander Vance',
      departmentName: 'Information Technology',
      checkIn: '08:45',
      checkOut: null,
      status: 'PRESENT',
      isLate: false,
      isEarlyDeparture: false,
      isRemote: false,
      overtimeHours: 0,
      workLocation: 'Headquarters',
    },
    {
      employeeId: '00000000-0000-0000-0000-000000000002',
      employeeName: 'Marcus Chen',
      departmentName: 'Information Technology',
      checkIn: '08:52',
      checkOut: null,
      status: 'PRESENT',
      isLate: false,
      isEarlyDeparture: false,
      isRemote: false,
      overtimeHours: 0,
      workLocation: 'Headquarters',
    },
    {
      employeeId: '00000000-0000-0000-0000-000000000003',
      employeeName: 'Elena Rostova',
      departmentName: 'Human Resources',
      checkIn: '08:58',
      checkOut: null,
      status: 'PRESENT',
      isLate: false,
      isEarlyDeparture: false,
      isRemote: false,
      overtimeHours: 0,
      workLocation: 'Headquarters',
    },
    {
      employeeId: '00000000-0000-0000-0000-000000000004',
      employeeName: 'David Ross',
      departmentName: 'Software Engineering',
      checkIn: '09:05',
      checkOut: null,
      status: 'PRESENT',
      isLate: false,
      isEarlyDeparture: false,
      isRemote: true,
      overtimeHours: 1.5,
      workLocation: 'San Francisco Tech Hub',
    },
    {
      employeeId: '00000000-0000-0000-0000-000000000005',
      employeeName: 'Sarah Jenkins',
      departmentName: 'Software Engineering',
      checkIn: '08:50',
      checkOut: null,
      status: 'PRESENT',
      isLate: false,
      isEarlyDeparture: false,
      isRemote: false,
      overtimeHours: 0.5,
      workLocation: 'San Francisco Tech Hub',
    },
    {
      employeeId: '00000000-0000-0000-0000-000000000006',
      employeeName: 'Chloe Dupont',
      departmentName: 'Software Engineering',
      checkIn: null,
      checkOut: null,
      status: 'ABSENT',
      isLate: false,
      isEarlyDeparture: false,
      isRemote: true,
      overtimeHours: 0,
      workLocation: 'Paris Remote Office',
    },
    {
      employeeId: '00000000-0000-0000-0000-000000000007',
      employeeName: 'Rajesh Kumar',
      departmentName: 'Operations & Logistics',
      checkIn: null,
      checkOut: null,
      status: 'ON_LEAVE',
      isLate: false,
      isEarlyDeparture: false,
      isRemote: false,
      overtimeHours: 0,
      workLocation: 'Austin Logistics Hub',
    },
    {
      employeeId: '00000000-0000-0000-0000-000000000008',
      employeeName: 'Vikram Patel',
      departmentName: 'Information Technology',
      checkIn: '09:42',
      checkOut: null,
      status: 'PRESENT',
      isLate: true,
      isEarlyDeparture: false,
      isRemote: false,
      overtimeHours: 0,
      workLocation: 'Headquarters',
    },
    {
      employeeId: '00000000-0000-0000-0000-000000000009',
      employeeName: 'Hannah Schmidt',
      departmentName: 'Software Engineering',
      checkIn: '09:00',
      checkOut: null,
      status: 'PRESENT',
      isLate: false,
      isEarlyDeparture: false,
      isRemote: true,
      overtimeHours: 0,
      workLocation: 'Berlin Remote Studio',
    },
    {
      employeeId: '00000000-0000-0000-0000-000000000010',
      employeeName: 'Liam O\'Connor',
      departmentName: 'Software Engineering',
      checkIn: '09:12',
      checkOut: null,
      status: 'PRESENT',
      isLate: false,
      isEarlyDeparture: false,
      isRemote: true,
      overtimeHours: 0,
      workLocation: 'Dublin Tech Lab',
    },
  ];

  private memoryAttendanceCorrections: Array<any> = [
    {
      id: 'COR-001',
      employeeId: '00000000-0000-0000-0000-000000000004',
      employeeName: 'David Ross',
      date: '2026-11-04',
      originalCheckIn: '09:00',
      originalCheckOut: null,
      requestedCheckIn: '09:00',
      requestedCheckOut: '18:00',
      reason: 'Left building for client onsite network diagnosis without tapping exit reader.',
      status: 'PENDING',
      createdAt: new Date('2026-11-04T19:00:00Z'),
    },
  ];

  private memoryOnboardingTasks: Array<any> = [
    { id: 'OB-01', employeeId: '00000000-0000-0000-0000-000000000006', category: 'HR', taskName: 'Appointment Letter Countersignature', isCompleted: true, assignedRole: 'HR_MANAGER', dueDate: '2026-10-18' },
    { id: 'OB-02', employeeId: '00000000-0000-0000-0000-000000000006', category: 'HR', taskName: 'Identity & Passport Verification', isCompleted: true, assignedRole: 'HR_MANAGER', dueDate: '2026-10-18' },
    { id: 'OB-03', employeeId: '00000000-0000-0000-0000-000000000006', category: 'IT', taskName: 'Corporate Email & Google Workspace Setup', isCompleted: true, assignedRole: 'IT_MANAGER', dueDate: '2026-10-19' },
    { id: 'OB-04', employeeId: '00000000-0000-0000-0000-000000000006', category: 'IT', taskName: 'MacBook Pro Provisioning & MDM Enrollment', isCompleted: false, assignedRole: 'IT_MANAGER', dueDate: '2026-10-20' },
    { id: 'OB-05', employeeId: '00000000-0000-0000-0000-000000000006', category: 'HR', taskName: 'Company Culture & Security Induction', isCompleted: false, assignedRole: 'HR_MANAGER', dueDate: '2026-10-25' },
    { id: 'OB-06', employeeId: '00000000-0000-0000-0000-000000000010', category: 'HR', taskName: 'NDA & IP Assignment Agreement', isCompleted: true, assignedRole: 'HR_MANAGER', dueDate: '2026-11-05' },
    { id: 'OB-07', employeeId: '00000000-0000-0000-0000-000000000010', category: 'IT', taskName: 'GitHub Enterprise & Cloud Sandbox Access', isCompleted: false, assignedRole: 'IT_MANAGER', dueDate: '2026-11-06' },
  ];

  private memoryDocuments: Array<any> = [
    {
      id: 'DOC-8001',
      referenceId: 'DOC-8001',
      employeeId: '00000000-0000-0000-0000-000000000004',
      employeeName: 'David Ross',
      category: 'IDENTITY_DOCUMENT',
      title: 'Valid Passport & Tax Residency Certificate',
      fileName: 'david_ross_passport.pdf',
      fileSize: 1420500,
      mimeType: 'application/pdf',
      fileUrl: 'https://storage.qclocker.io/docs/emp004/passport.pdf',
      verificationStatus: 'VERIFIED',
      verifiedAt: new Date('2025-02-16'),
      verifiedByName: 'Elena Rostova',
      expiresAt: '2030-05-20',
      createdAt: new Date('2025-02-15'),
    },
    {
      id: 'DOC-8002',
      referenceId: 'DOC-8002',
      employeeId: '00000000-0000-0000-0000-000000000004',
      employeeName: 'David Ross',
      category: 'EMPLOYMENT_AGREEMENT',
      title: 'Signed Intellectual Property & Non-Disclosure Agreement',
      fileName: 'david_ross_nda.pdf',
      fileSize: 852000,
      mimeType: 'application/pdf',
      fileUrl: 'https://storage.qclocker.io/docs/emp004/nda.pdf',
      verificationStatus: 'VERIFIED',
      verifiedAt: new Date('2025-02-16'),
      verifiedByName: 'Elena Rostova',
      expiresAt: null,
      createdAt: new Date('2025-02-15'),
    },
    {
      id: 'DOC-8003',
      referenceId: 'DOC-8003',
      employeeId: '00000000-0000-0000-0000-000000000006',
      employeeName: 'Chloe Dupont',
      category: 'EDUCATION_CERTIFICATE',
      title: 'Master of Science in Software Systems Degree',
      fileName: 'chloe_dupont_msc_diploma.pdf',
      fileSize: 2210400,
      mimeType: 'application/pdf',
      fileUrl: 'https://storage.qclocker.io/docs/emp006/diploma.pdf',
      verificationStatus: 'PENDING',
      verifiedAt: null,
      verifiedByName: null,
      expiresAt: null,
      createdAt: new Date('2026-10-16'),
    },
  ];

  private memoryLifecycleHistory: Array<any> = [
    {
      id: 'LCH-1001',
      employeeId: '00000000-0000-0000-0000-000000000004',
      changeType: 'JOINING',
      previousValue: null,
      newValue: 'Full-Stack Software Engineer (Software Engineering)',
      effectiveDate: '2025-02-15',
      reason: 'New hire onboarding in Core Architecture unit',
      changedByName: 'Elena Rostova',
      createdAt: new Date('2025-02-15'),
    },
    {
      id: 'LCH-1002',
      employeeId: '00000000-0000-0000-0000-000000000004',
      changeType: 'PROBATION_CONFIRMED',
      previousValue: 'Probation',
      newValue: 'Active Permanent Employment',
      effectiveDate: '2025-05-15',
      reason: 'Outstanding delivery on enterprise TypeScript frameworks and security benchmarks',
      changedByName: 'Alexander Vance',
      createdAt: new Date('2025-05-15'),
    },
    {
      id: 'LCH-1003',
      employeeId: '00000000-0000-0000-0000-000000000004',
      changeType: 'PROMOTION',
      previousValue: 'Senior Software Engineer',
      newValue: 'Staff Software Architect',
      effectiveDate: '2026-06-01',
      reason: 'Led multi-tier ITSM system development and zero-trust security overhaul',
      changedByName: 'Alexander Vance',
      createdAt: new Date('2026-06-01'),
    },
  ];

  private memoryExitRecords: Array<any> = [
    {
      id: 'EXT-001',
      referenceId: 'EXT-001',
      employeeId: '00000000-0000-0000-0000-000000000008',
      employeeName: 'Vikram Patel',
      departmentName: 'Information Technology',
      jobTitle: 'Senior Threat Hunter',
      resignationDate: '2026-10-20',
      noticePeriodDays: 30,
      lastWorkingDay: '2026-11-20',
      reason: 'Relocating to Singapore for academic fellowship and family reasons.',
      overallStatus: 'NOTICE_PERIOD',
      hrClearance: true,
      itClearance: false,
      financeClearance: true,
      exitInterviewNotes: 'Positive exit interview. Expressed appreciation for team collaboration.',
      createdAt: new Date('2026-10-20'),
    },
  ];

  private memoryHolidays: Array<any> = [
    { id: '1', name: 'New Year\'s Day', holidayDate: '2026-01-01', holidayType: 'PUBLIC', year: 2026 },
    { id: '2', name: 'Martin Luther King Jr. Day', holidayDate: '2026-01-19', holidayType: 'PUBLIC', year: 2026 },
    { id: '3', name: 'Presidents\' Day', holidayDate: '2026-02-16', holidayType: 'PUBLIC', year: 2026 },
    { id: '4', name: 'Memorial Day', holidayDate: '2026-05-25', holidayType: 'PUBLIC', year: 2026 },
    { id: '5', name: 'Juneteenth National Independence Day', holidayDate: '2026-06-19', holidayType: 'PUBLIC', year: 2026 },
    { id: '6', name: 'Independence Day', holidayDate: '2026-07-03', holidayType: 'PUBLIC', year: 2026 },
    { id: '7', name: 'Labor Day', holidayDate: '2026-09-07', holidayType: 'PUBLIC', year: 2026 },
    { id: '8', name: 'Veterans Day', holidayDate: '2026-11-11', holidayType: 'PUBLIC', year: 2026 },
    { id: '9', name: 'Thanksgiving Day', holidayDate: '2026-11-26', holidayType: 'PUBLIC', year: 2026 },
    { id: '10', name: 'Day After Thanksgiving', holidayDate: '2026-11-27', holidayType: 'COMPANY', year: 2026 },
    { id: '11', name: 'Christmas Day', holidayDate: '2026-12-25', holidayType: 'PUBLIC', year: 2026 },
  ];

  constructor(
    private readonly prisma: PrismaService,
    @Optional() private readonly notificationsService?: NotificationsService,
  ) {}

  // =========================================================================
  // 1. HR MAIN DASHBOARD
  // =========================================================================

  async getDashboardSummary(): Promise<HrmsDashboardResponse> {
    const employees = await this.getAllEmployeesRaw();
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter((e) => e.accountStatus === 'ACTIVE' || e.accountStatus === 'PROBATION').length;
    const noticePeriodEmployees = employees.filter((e) => e.accountStatus === 'NOTICE_PERIOD').length;

    // Joiners this month (November 2026)
    const currentYearMonth = '2026-11';
    const newJoinersThisMonth = employees.filter((e) => {
      const d = e.joiningDate instanceof Date ? e.joiningDate.toISOString() : String(e.joiningDate || '');
      return d.startsWith(currentYearMonth);
    }).length;

    // Attendance stats
    const attendance = this.memoryAttendanceDaily;
    const presentCount = attendance.filter((a) => a.status === 'PRESENT').length;
    const onLeaveCount = attendance.filter((a) => a.status === 'ON_LEAVE').length;
    const absentCount = attendance.filter((a) => a.status === 'ABSENT').length;
    const lateArrivals = attendance.filter((a) => a.isLate).length;
    const earlyDepartures = attendance.filter((a) => a.isEarlyDeparture).length;
    const missingCheckouts = attendance.filter((a) => a.checkIn && !a.checkOut && a.status === 'PRESENT').length;
    const workingRemotely = attendance.filter((a) => a.isRemote && a.status === 'PRESENT').length;
    const totalOvertime = attendance.reduce((sum, a) => sum + (a.overtimeHours || 0), 0);
    const attendancePercentage = Math.round((presentCount / (totalEmployees || 1)) * 1000) / 10;

    // Pending Leaves & Approvals
    const pendingLeaveRequests = this.memoryLeaveRequests.filter((l) => l.status === 'PENDING').length;
    const pendingCorrections = this.memoryAttendanceCorrections.filter((c) => c.status === 'PENDING').length;
    const pendingDocs = this.memoryDocuments.filter((d) => d.verificationStatus === 'PENDING').length;
    const pendingExitClearances = this.memoryExitRecords.filter((e) => !e.hrClearance || !e.itClearance || !e.financeClearance).length;
    const pendingHrApprovals = pendingLeaveRequests + pendingCorrections + pendingDocs + pendingExitClearances;

    // Milestones
    const upcomingBirthdays = 4;
    const upcomingWorkAnniversaries = 3;
    const employeesWithMissingAttendance = missingCheckouts;

    const kpis: HrmsKpiSummary = {
      totalEmployees,
      activeEmployees,
      newJoinersThisMonth,
      employeesOnLeaveToday: onLeaveCount,
      employeesPresentToday: presentCount,
      employeesAbsentToday: absentCount,
      pendingLeaveRequests,
      pendingHrApprovals,
      employeesOnNoticePeriod: noticePeriodEmployees,
      upcomingBirthdays,
      upcomingWorkAnniversaries,
      employeesWithMissingAttendance,
    };

    const attendanceSummary: AttendanceOverviewSummary = {
      presentCount,
      onLeaveCount,
      absentCount,
      lateArrivals,
      earlyDepartures,
      missingCheckouts,
      workingRemotely,
      attendancePercentage,
      totalOvertimeHoursToday: totalOvertime,
    };

    // Department Distribution
    const departmentDistribution: DepartmentHeadcountStat[] = [
      { id: '1', name: 'Software Engineering', code: 'ENG', headcount: 5, activeLeaves: 0, presentToday: 4, attendanceRate: 80.0, managerName: 'Sarah Jenkins' },
      { id: '2', name: 'Information Technology', code: 'IT', headcount: 3, activeLeaves: 0, presentToday: 3, attendanceRate: 100.0, managerName: 'Marcus Chen' },
      { id: '3', name: 'Human Resources', code: 'HR', headcount: 1, activeLeaves: 0, presentToday: 1, attendanceRate: 100.0, managerName: 'Elena Rostova' },
      { id: '4', name: 'Operations & Logistics', code: 'OPS', headcount: 1, activeLeaves: 1, presentToday: 0, attendanceRate: 0.0, managerName: 'Rajesh Kumar' },
    ];

    const upcomingMilestones: UpcomingMilestoneItem[] = [
      { id: 'M-1', employeeId: '00000000-0000-0000-0000-000000000004', employeeName: 'David Ross', departmentName: 'Software Engineering', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', milestoneType: 'BIRTHDAY', date: '2026-11-09', daysRemaining: 4, highlightText: 'Turns 32' },
      { id: 'M-2', employeeId: '00000000-0000-0000-0000-000000000002', employeeName: 'Marcus Chen', departmentName: 'Information Technology', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', milestoneType: 'WORK_ANNIVERSARY', date: '2026-11-14', daysRemaining: 9, highlightText: '2 Years of Dedicated Service' },
      { id: 'M-3', employeeId: '00000000-0000-0000-0000-000000000006', employeeName: 'Chloe Dupont', departmentName: 'Software Engineering', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', milestoneType: 'PROBATION_END', date: '2026-11-15', daysRemaining: 10, highlightText: '30-Day Evaluation Review Due' },
      { id: 'M-4', employeeId: '00000000-0000-0000-0000-000000000009', employeeName: 'Hannah Schmidt', departmentName: 'Software Engineering', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', milestoneType: 'NEW_JOINER', date: '2026-11-01', daysRemaining: 0, highlightText: 'Joined 4 days ago as QA Lead' },
    ];

    const pendingActions: PendingHrActionItem[] = [
      { id: 'LEV-9011', type: 'LEAVE', title: 'Casual Leave Request (2 Days)', employeeId: '00000000-0000-0000-0000-000000000004', employeeName: 'David Ross', submittedDate: '2026-11-05', urgency: 'HIGH', details: 'Family wedding event in Seattle' },
      { id: 'COR-001', type: 'ATTENDANCE_CORRECTION', title: 'Missing Clock-Out Correction', employeeId: '00000000-0000-0000-0000-000000000004', employeeName: 'David Ross', submittedDate: '2026-11-04', urgency: 'NORMAL', details: 'Client onsite diagnosis; requested 18:00 check-out' },
      { id: 'DOC-8003', type: 'DOCUMENT_VERIFICATION', title: 'Degree Certificate Verification', employeeId: '00000000-0000-0000-0000-000000000006', employeeName: 'Chloe Dupont', submittedDate: '2026-10-16', urgency: 'NORMAL', details: 'Master of Science Diploma verification' },
      { id: 'EXT-001', type: 'EXIT_CLEARANCE', title: 'IT Asset & VPN Clearance Pending', employeeId: '00000000-0000-0000-0000-000000000008', employeeName: 'Vikram Patel', submittedDate: '2026-10-20', urgency: 'CRITICAL', details: 'Last working day: Nov 20, 2026. Laptop and SOC tokens pending recovery.' },
    ];

    const recentActivities: RecentEmployeeActivity[] = [
      { id: 'ACT-1', employeeId: '00000000-0000-0000-0000-000000000010', employeeName: 'Liam O\'Connor', activityType: 'NEW_HIRE', description: 'Onboarded to Software Engineering as Distributed Systems Engineer', timestamp: new Date(Date.now() - 3600 * 1000 * 12).toISOString() },
      { id: 'ACT-2', employeeId: '00000000-0000-0000-0000-000000000007', employeeName: 'Rajesh Kumar', activityType: 'LEAVE_APPROVED', description: '5-Day Earned Vacation approved by Executive Leadership', timestamp: new Date(Date.now() - 3600 * 1000 * 24).toISOString() },
      { id: 'ACT-3', employeeId: '00000000-0000-0000-0000-000000000008', employeeName: 'Vikram Patel', activityType: 'RESIGNATION', description: 'Resignation registered with 30 days notice period', timestamp: new Date(Date.now() - 3600 * 1000 * 48).toISOString() },
      { id: 'ACT-4', employeeId: '00000000-0000-0000-0000-000000000004', employeeName: 'David Ross', activityType: 'PROMOTION', description: 'Title advanced to Staff Software Architect following annual evaluation', timestamp: new Date('2026-06-01').toISOString() },
    ];

    const monthlyGrowthTrend = [
      { month: 'Jun 2026', joiners: 2, exits: 0, netHeadcount: 142 },
      { month: 'Jul 2026', joiners: 3, exits: 1, netHeadcount: 144 },
      { month: 'Aug 2026', joiners: 2, exits: 0, netHeadcount: 146 },
      { month: 'Sep 2026', joiners: 1, exits: 1, netHeadcount: 146 },
      { month: 'Oct 2026', joiners: 2, exits: 0, netHeadcount: 148 },
      { month: 'Nov 2026', joiners: 2, exits: 1, netHeadcount: 149 },
    ];

    return {
      kpis,
      attendance: attendanceSummary,
      departmentDistribution,
      upcomingMilestones,
      pendingActions,
      recentActivities,
      monthlyGrowthTrend,
    };
  }

  // =========================================================================
  // 2. EMPLOYEE DIRECTORY & PROFILE MANAGEMENT
  // =========================================================================

  async getEmployees(query: HrmsEmployeeQueryDto, currentUser: any) {
    const rawList = await this.getAllEmployeesRaw();
    let filtered = [...rawList];

    if (query.search && query.search.trim()) {
      const q = query.search.trim().toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.firstName.toLowerCase().includes(q) ||
          e.lastName.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          (e.employeeCode && e.employeeCode.toLowerCase().includes(q)) ||
          (e.jobTitle && e.jobTitle.toLowerCase().includes(q)),
      );
    }

    if (query.departmentId) {
      filtered = filtered.filter((e) => e.departmentId === query.departmentId);
    }
    if (query.designationId) {
      filtered = filtered.filter((e) => e.designationId === query.designationId);
    }
    if (query.managerId) {
      filtered = filtered.filter((e) => e.managerId === query.managerId);
    }
    if (query.status) {
      filtered = filtered.filter((e) => e.accountStatus === query.status);
    }
    if (query.location) {
      filtered = filtered.filter((e) => e.workLocation.toLowerCase().includes(query.location!.toLowerCase()));
    }

    const total = filtered.length;
    const page = Math.max(1, Number(query.page || 1));
    const limit = Math.max(1, Number(query.limit || 20));
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    // Permission check for sensitive contact info (phone & personal email)
    const canSeeConfidential =
      currentUser?.roleCode === 'SUPER_ADMIN' ||
      currentUser?.roleCode === 'ADMIN' ||
      currentUser?.roleCode === 'HR_MANAGER' ||
      currentUser?.roleCode === 'HR_ADMINISTRATOR';

    const sanitized = paginated.map((emp) => ({
      ...emp,
      phone: canSeeConfidential ? emp.phone : '•'.repeat(8) + ' [RESTRICTED]',
      personalEmail: canSeeConfidential ? emp.personalEmail : '•'.repeat(12) + '@private',
    }));

    return {
      data: sanitized,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getEmployeeProfile(id: string, currentUser: any) {
    const employee = await this.findEmployeeById(id);
    if (!employee) throw new NotFoundException(`Employee '${id}' not found`);

    const canSeeConfidential =
      currentUser?.id === employee.id ||
      currentUser?.roleCode === 'SUPER_ADMIN' ||
      currentUser?.roleCode === 'ADMIN' ||
      currentUser?.roleCode === 'HR_MANAGER' ||
      currentUser?.roleCode === 'HR_ADMINISTRATOR';

    const timeline = this.memoryLifecycleHistory.filter((l) => l.employeeId === employee.id);
    const documents = this.memoryDocuments.filter((d) => d.employeeId === employee.id);
    const leaveBalances = this.memoryLeaveBalances.get(employee.id) || [
      { leaveTypeCode: 'CASUAL_LEAVE', leaveTypeName: 'Casual Leave', allocatedDays: 12, usedDays: 0, pendingDays: 0, remainingDays: 12 },
      { leaveTypeCode: 'SICK_LEAVE', leaveTypeName: 'Sick Leave', allocatedDays: 10, usedDays: 0, pendingDays: 0, remainingDays: 10 },
      { leaveTypeCode: 'EARNED_LEAVE', leaveTypeName: 'Earned Vacation', allocatedDays: 18, usedDays: 0, pendingDays: 0, remainingDays: 18 },
    ];
    const leaves = this.memoryLeaveRequests.filter((l) => l.employeeId === employee.id);
    const onboarding = this.memoryOnboardingTasks.filter((o) => o.employeeId === employee.id);

    return {
      ...employee,
      phone: canSeeConfidential ? employee.phone : '•'.repeat(8) + ' [RESTRICTED]',
      personalEmail: canSeeConfidential ? employee.personalEmail : '•'.repeat(12) + '@private',
      timeline,
      documents,
      leaveBalances,
      leaves,
      onboarding,
      assignedAssets: [
        { id: 'AST-01', assetTag: 'AST-MBP-2026-04', type: 'HARDWARE', model: 'Apple MacBook Pro M3 Max 36GB', serialNumber: 'C02G879XMD6T', assignedDate: '2025-02-15', status: 'ACTIVE' },
        { id: 'AST-02', assetTag: 'AST-MON-4K-02', type: 'HARDWARE', model: 'Dell UltraSharp 32" 4K USB-C Hub', serialNumber: 'CN-0K982X', assignedDate: '2025-02-15', status: 'ACTIVE' },
      ],
      itCredentialsStatus: {
        emailCreated: true,
        vpnAccessGranted: true,
        sshKeysUploaded: true,
        mfaEnabled: true,
      },
    };
  }

  async createEmployee(dto: CreateHrmsEmployeeDto, actor: any) {
    const referenceId = generateReferenceId('EMP');
    const employeeCode = referenceId;

    const newEmp: any = {
      id: crypto.randomUUID(),
      referenceId,
      employeeCode,
      firstName: dto.firstName.trim(),
      lastName: dto.lastName.trim(),
      email: dto.email.trim().toLowerCase(),
      personalEmail: dto.personalEmail?.trim() || null,
      phone: dto.phone?.trim() || '+1-555-0199',
      departmentId: dto.departmentId,
      departmentName: 'Software Engineering',
      designationId: dto.designationId || null,
      designationName: dto.jobTitle || 'Team Member',
      jobTitle: dto.jobTitle || 'Team Member',
      roleCode: dto.roleCode || 'EMPLOYEE',
      managerId: dto.managerId || null,
      managerName: 'Alexander Vance',
      employmentType: dto.employmentType || 'FULL_TIME',
      joiningDate: dto.joiningDate || new Date().toISOString().split('T')[0],
      workLocation: dto.workLocation || 'Headquarters',
      accountStatus: dto.status || EmploymentStatus.ACTIVE,
      isActive: true,
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(dto.firstName + ' ' + dto.lastName)}&background=4f46e5&color=fff`,
      createdAt: new Date(),
    };

    // If Prisma DB connected, persist to PostgreSQL
    if (this.prisma.isConnected) {
      try {
        const dbUser = await this.prisma.user.create({
          data: {
            referenceId,
            employeeCode,
            email: newEmp.email,
            personalEmail: newEmp.personalEmail,
            passwordHash: await require('bcryptjs').hash(dto.initialPassword || 'Welcome@2026!', 10),
            firstName: newEmp.firstName,
            lastName: newEmp.lastName,
            phone: newEmp.phone,
            roleId: '00000000-0000-0000-0000-000000000004', // Employee role
            roleCode: newEmp.roleCode,
            departmentId: newEmp.departmentId,
            jobTitle: newEmp.jobTitle,
            employmentType: newEmp.employmentType,
            joiningDate: new Date(newEmp.joiningDate),
            workLocation: newEmp.workLocation,
            accountStatus: newEmp.accountStatus,
            isActive: true,
          },
        });
        newEmp.id = dbUser.id;
      } catch (err) {
        this.logger.warn(`Could not persist user to DB: ${(err as Error).message}`);
      }
    }

    // Auto-create standard Onboarding Checklist tasks
    const obTasks = [
      { id: crypto.randomUUID(), employeeId: newEmp.id, category: 'HR', taskName: 'Appointment Letter Countersignature', isCompleted: false, assignedRole: 'HR_MANAGER', dueDate: '2026-11-15' },
      { id: crypto.randomUUID(), employeeId: newEmp.id, category: 'HR', taskName: 'Identity & National Tax ID Verification', isCompleted: false, assignedRole: 'HR_MANAGER', dueDate: '2026-11-15' },
      { id: crypto.randomUUID(), employeeId: newEmp.id, category: 'HR', taskName: 'Direct Deposit / Banking Setup', isCompleted: false, assignedRole: 'HR_MANAGER', dueDate: '2026-11-16' },
      { id: crypto.randomUUID(), employeeId: newEmp.id, category: 'IT', taskName: 'Enterprise Email & Single Sign-On Account Provisioning', isCompleted: false, assignedRole: 'IT_MANAGER', dueDate: '2026-11-12' },
      { id: crypto.randomUUID(), employeeId: newEmp.id, category: 'IT', taskName: 'Workstation / Laptop Hardware Handover & MDM Setup', isCompleted: false, assignedRole: 'IT_MANAGER', dueDate: '2026-11-14' },
    ];
    this.memoryOnboardingTasks.push(...obTasks);

    // Auto-create standard Leave Balances
    this.memoryLeaveBalances.set(newEmp.id, [
      { leaveTypeCode: 'CASUAL_LEAVE', leaveTypeName: 'Casual Leave', allocatedDays: 12, usedDays: 0, pendingDays: 0, remainingDays: 12 },
      { leaveTypeCode: 'SICK_LEAVE', leaveTypeName: 'Sick Leave', allocatedDays: 10, usedDays: 0, pendingDays: 0, remainingDays: 10 },
      { leaveTypeCode: 'EARNED_LEAVE', leaveTypeName: 'Earned Vacation', allocatedDays: 18, usedDays: 0, pendingDays: 0, remainingDays: 18 },
      { leaveTypeCode: 'PRIVILEGE_LEAVE', leaveTypeName: 'Privilege Leave', allocatedDays: 15, usedDays: 0, pendingDays: 0, remainingDays: 15 },
    ]);

    // Record lifecycle history
    this.memoryLifecycleHistory.unshift({
      id: crypto.randomUUID(),
      employeeId: newEmp.id,
      changeType: 'JOINING',
      previousValue: null,
      newValue: `${newEmp.jobTitle} (${newEmp.departmentName})`,
      effectiveDate: newEmp.joiningDate,
      reason: 'Employee onboarded by HR',
      changedByName: `${actor?.firstName || 'HR'} ${actor?.lastName || 'Operations'}`.trim(),
      createdAt: new Date(),
    });

    this.memoryEmployees.unshift(newEmp);

    if (this.notificationsService) {
      await this.notificationsService.create({
        userId: '00000000-0000-0000-0000-000000000001',
        title: 'New Employee Added',
        message: `${newEmp.firstName} ${newEmp.lastName} (${newEmp.employeeCode}) was successfully added to ${newEmp.departmentName}.`,
        type: 'SUCCESS',
        entityType: 'TASK',
      });
    }

    return newEmp;
  }

  async updateEmployee(id: string, dto: UpdateHrmsEmployeeDto, actor: any) {
    const emp = await this.findEmployeeById(id);
    if (!emp) throw new NotFoundException(`Employee '${id}' not found`);

    const changes: string[] = [];
    if (dto.firstName) emp.firstName = dto.firstName;
    if (dto.lastName) emp.lastName = dto.lastName;
    if (dto.personalEmail) emp.personalEmail = dto.personalEmail;
    if (dto.phone) emp.phone = dto.phone;
    if (dto.jobTitle && dto.jobTitle !== emp.jobTitle) {
      changes.push(`Job Title changed from '${emp.jobTitle}' to '${dto.jobTitle}'`);
      emp.jobTitle = dto.jobTitle;
    }
    if (dto.departmentId && dto.departmentId !== emp.departmentId) {
      changes.push(`Department transferred to new division ID: ${dto.departmentId}`);
      emp.departmentId = dto.departmentId;
    }
    if (dto.status && dto.status !== emp.accountStatus) {
      changes.push(`Status changed from '${emp.accountStatus}' to '${dto.status}'`);
      emp.accountStatus = dto.status;
    }
    if (dto.workLocation) emp.workLocation = dto.workLocation;

    if (changes.length > 0) {
      this.memoryLifecycleHistory.unshift({
        id: crypto.randomUUID(),
        employeeId: emp.id,
        changeType: dto.jobTitle ? 'PROMOTION' : 'DEPARTMENT_TRANSFER',
        previousValue: null,
        newValue: changes.join('; '),
        effectiveDate: new Date().toISOString().split('T')[0],
        reason: dto.changeReason || 'Profile update requested by People Operations',
        changedByName: `${actor?.firstName || 'HR'} ${actor?.lastName || 'Admin'}`.trim(),
        createdAt: new Date(),
      });
    }

    return emp;
  }

  async updateEmployeeStatus(id: string, dto: UpdateEmployeeStatusDto, actor: any) {
    const emp = await this.findEmployeeById(id);
    if (!emp) throw new NotFoundException(`Employee '${id}' not found`);

    const oldStatus = emp.accountStatus;
    emp.accountStatus = dto.status;

    this.memoryLifecycleHistory.unshift({
      id: crypto.randomUUID(),
      employeeId: emp.id,
      changeType: 'STATUS_CHANGE',
      previousValue: oldStatus,
      newValue: dto.status,
      effectiveDate: dto.effectiveDate || new Date().toISOString().split('T')[0],
      reason: dto.reason,
      changedByName: `${actor?.firstName || 'HR'} ${actor?.lastName || 'Operations'}`.trim(),
      createdAt: new Date(),
    });

    return {
      success: true,
      message: `Employee ${emp.referenceId} status successfully transitioned to ${dto.status}`,
      employee: emp,
    };
  }

  async archiveEmployee(id: string, actor: any) {
    return this.updateEmployeeStatus(
      id,
      {
        status: EmploymentStatus.ARCHIVED,
        reason: 'Archived from active workforce registry; compliance records retained.',
      },
      actor,
    );
  }

  async exportEmployees(format = 'csv'): Promise<{ buffer: Buffer; fileName: string; mimeType: string }> {
    const employees = await this.getAllEmployeesRaw();
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Q Clocker Enterprise HRMS';
    workbook.created = new Date();

    const sheet = workbook.addWorksheet('Employee Directory');
    sheet.columns = [
      { header: 'Employee Code', key: 'code', width: 16 },
      { header: 'First Name', key: 'firstName', width: 18 },
      { header: 'Last Name', key: 'lastName', width: 18 },
      { header: 'Work Email', key: 'email', width: 28 },
      { header: 'Department', key: 'department', width: 24 },
      { header: 'Designation / Title', key: 'jobTitle', width: 28 },
      { header: 'Employment Status', key: 'status', width: 18 },
      { header: 'Work Location', key: 'location', width: 24 },
      { header: 'Joining Date', key: 'joiningDate', width: 16 },
    ];

    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
    sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1E1B4B' } };

    employees.forEach((e) => {
      sheet.addRow({
        code: e.employeeCode || e.referenceId,
        firstName: e.firstName,
        lastName: e.lastName,
        email: e.email,
        department: e.departmentName,
        jobTitle: e.jobTitle,
        status: e.accountStatus,
        location: e.workLocation,
        joiningDate: e.joiningDate instanceof Date ? e.joiningDate.toISOString().split('T')[0] : e.joiningDate,
      });
    });

    if (format === 'csv') {
      const csvBuffer = await workbook.csv.writeBuffer();
      return {
        buffer: Buffer.from(csvBuffer),
        fileName: `Q_Clocker_Employees_${new Date().toISOString().split('T')[0]}.csv`,
        mimeType: 'text/csv',
      };
    }

    const xlsxBuffer = await workbook.xlsx.writeBuffer();
    return {
      buffer: Buffer.from(xlsxBuffer),
      fileName: `Q_Clocker_Employees_${new Date().toISOString().split('T')[0]}.xlsx`,
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };
  }

  // =========================================================================
  // 3. ATTENDANCE MANAGEMENT
  // =========================================================================

  async getAttendanceToday() {
    const records = this.memoryAttendanceDaily;
    const summary: AttendanceOverviewSummary = {
      presentCount: records.filter((r) => r.status === 'PRESENT').length,
      onLeaveCount: records.filter((r) => r.status === 'ON_LEAVE').length,
      absentCount: records.filter((r) => r.status === 'ABSENT').length,
      lateArrivals: records.filter((r) => r.isLate).length,
      earlyDepartures: records.filter((r) => r.isEarlyDeparture).length,
      missingCheckouts: records.filter((r) => r.checkIn && !r.checkOut && r.status === 'PRESENT').length,
      workingRemotely: records.filter((r) => r.isRemote && r.status === 'PRESENT').length,
      attendancePercentage: Math.round((records.filter((r) => r.status === 'PRESENT').length / (records.length || 1)) * 1000) / 10,
      totalOvertimeHoursToday: records.reduce((sum, r) => sum + (r.overtimeHours || 0), 0),
    };

    return {
      date: new Date().toISOString().split('T')[0],
      summary,
      records,
    };
  }

  async getAttendanceMatrix(period = 'monthly', month = '2026-11') {
    const employees = await this.getAllEmployeesRaw();
    const daysInMonth = 30;
    const days = Array.from({ length: daysInMonth }, (_, i) => {
      const dayNum = i + 1;
      const dateStr = `${month}-${String(dayNum).padStart(2, '0')}`;
      const isWeekend = new Date(dateStr).getDay() === 0 || new Date(dateStr).getDay() === 6;
      return { day: dayNum, date: dateStr, isWeekend };
    });

    const matrix = employees.map((emp) => {
      const records = days.map((d) => {
        if (d.isWeekend) return { status: 'WEEKEND', code: 'W' };
        if (emp.accountStatus === 'ON_LEAVE') return { status: 'ON_LEAVE', code: 'L' };
        // Realistic distribution
        const rand = (parseInt(emp.id.slice(-2), 16) + d.day) % 20;
        if (rand === 0) return { status: 'ABSENT', code: 'A' };
        if (rand === 1) return { status: 'LATE', code: 'LT' };
        return { status: 'PRESENT', code: 'P' };
      });

      const totalPresent = records.filter((r) => r.status === 'PRESENT' || r.status === 'LATE').length;
      const totalLeaves = records.filter((r) => r.status === 'ON_LEAVE').length;
      const totalAbsents = records.filter((r) => r.status === 'ABSENT').length;

      return {
        employeeId: emp.id,
        employeeName: `${emp.firstName} ${emp.lastName}`,
        departmentName: emp.departmentName,
        totalPresent,
        totalLeaves,
        totalAbsents,
        attendancePercentage: Math.round((totalPresent / 22) * 1000) / 10,
        days: records,
      };
    });

    return {
      period,
      month,
      days,
      matrix,
    };
  }

  async punchAttendance(dto: AttendancePunchDto, user: any) {
    const existing = this.memoryAttendanceDaily.find((a) => a.employeeId === user.id);
    const nowTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

    if (dto.type === 'CHECK_IN') {
      if (existing) {
        existing.checkIn = nowTime;
        existing.status = 'PRESENT';
        return { success: true, message: `Checked in at ${nowTime}`, record: existing };
      }
      const record = {
        employeeId: user.id,
        employeeName: `${user.firstName} ${user.lastName}`,
        departmentName: 'Software Engineering',
        checkIn: nowTime,
        checkOut: null,
        status: 'PRESENT',
        isLate: false,
        isEarlyDeparture: false,
        isRemote: false,
        overtimeHours: 0,
      };
      this.memoryAttendanceDaily.push(record);
      return { success: true, message: `Checked in at ${nowTime}`, record };
    }

    if (existing) {
      existing.checkOut = nowTime;
      return { success: true, message: `Checked out at ${nowTime}`, record: existing };
    }

    return { success: false, message: 'Check-in must precede check-out' };
  }

  async requestAttendanceCorrection(dto: AttendanceCorrectionRequestDto, user: any) {
    const correction = {
      id: generateReferenceId('COR'),
      employeeId: user.id,
      employeeName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Employee User',
      date: dto.date,
      originalCheckIn: '09:00',
      originalCheckOut: null,
      requestedCheckIn: dto.requestedCheckIn,
      requestedCheckOut: dto.requestedCheckOut,
      reason: dto.reason,
      status: 'PENDING',
      createdAt: new Date(),
    };

    this.memoryAttendanceCorrections.unshift(correction);
    return {
      success: true,
      message: 'Attendance correction request submitted for HR authorization',
      correction,
    };
  }

  async decideAttendanceCorrection(id: string, dto: AttendanceCorrectionDecisionDto, actor: any) {
    const item = this.memoryAttendanceCorrections.find((c) => c.id === id);
    if (!item) throw new NotFoundException(`Correction request '${id}' not found`);

    item.status = dto.action === 'APPROVE' ? 'APPROVED' : 'REJECTED';
    item.decidedAt = new Date();
    item.decidedByName = `${actor?.firstName || 'HR'} ${actor?.lastName || 'Lead'}`.trim();
    item.decidedComments = dto.comments || null;

    return {
      success: true,
      message: `Correction request ${id} ${item.status.toLowerCase()}`,
      correction: item,
    };
  }

  // =========================================================================
  // 4. LEAVE MANAGEMENT
  // =========================================================================

  async getLeaveTypes() {
    return this.memoryLeaveTypes;
  }

  async getLeaveBalances(employeeId?: string, user?: any) {
    const targetId = employeeId || user?.id || '00000000-0000-0000-0000-000000000004';
    return (
      this.memoryLeaveBalances.get(targetId) || [
        { leaveTypeCode: 'CASUAL_LEAVE', leaveTypeName: 'Casual Leave (CL)', allocatedDays: 12, usedDays: 2, pendingDays: 1, remainingDays: 9 },
        { leaveTypeCode: 'SICK_LEAVE', leaveTypeName: 'Sick Leave (SL)', allocatedDays: 10, usedDays: 1, pendingDays: 0, remainingDays: 9 },
        { leaveTypeCode: 'EARNED_LEAVE', leaveTypeName: 'Earned Vacation (EL)', allocatedDays: 18, usedDays: 4, pendingDays: 0, remainingDays: 14 },
        { leaveTypeCode: 'PRIVILEGE_LEAVE', leaveTypeName: 'Privilege Leave (PL)', allocatedDays: 15, usedDays: 0, pendingDays: 0, remainingDays: 15 },
      ]
    );
  }

  async getLeaveRequests(status?: string) {
    let list = this.memoryLeaveRequests;
    if (status) {
      list = list.filter((l) => l.status === status.toUpperCase());
    }
    return list;
  }

  async applyLeave(dto: CreateLeaveRequestDto, user: any) {
    // 1. Validate dates
    const start = new Date(dto.startDate);
    const end = new Date(dto.endDate);
    if (end < start) {
      throw new BadRequestException('End date cannot be prior to start date');
    }

    // 2. Validate leave balance
    const balances = await this.getLeaveBalances(user.id);
    const matched = balances.find((b: any) => b.leaveTypeCode === dto.leaveTypeCode);
    if (matched && matched.remainingDays < dto.totalDays) {
      throw new BadRequestException(`Insufficient leave balance. Remaining: ${matched.remainingDays} days, Requested: ${dto.totalDays} days`);
    }

    const referenceId = generateReferenceId('LEV');
    const newReq = {
      id: referenceId,
      referenceId,
      employeeId: user.id,
      employeeName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Employee User',
      employeeCode: 'EMP-DEV001',
      departmentName: 'Software Engineering',
      leaveTypeCode: dto.leaveTypeCode,
      leaveTypeName: matched?.leaveTypeName || dto.leaveTypeCode,
      startDate: dto.startDate,
      endDate: dto.endDate,
      totalDays: dto.totalDays,
      reason: dto.reason,
      attachmentUrl: dto.attachmentUrl || null,
      status: 'PENDING',
      approverId: '00000000-0000-0000-0000-000000000003', // HR Manager
      approverName: 'Elena Rostova',
      createdAt: new Date(),
    };

    this.memoryLeaveRequests.unshift(newReq);
    if (matched) {
      matched.pendingDays += dto.totalDays;
      matched.remainingDays -= dto.totalDays;
    }

    return newReq;
  }

  async decideLeave(id: string, dto: LeaveRequestDecisionDto, actor: any) {
    const req = this.memoryLeaveRequests.find((l) => l.id === id || l.referenceId === id);
    if (!req) throw new NotFoundException(`Leave request '${id}' not found`);

    if (actor?.id === req.employeeId) {
      throw new ForbiddenException('Segregation of duties: You cannot approve or reject your own leave request');
    }

    req.status = dto.action === 'APPROVE' ? 'APPROVED' : dto.action === 'REJECT' ? 'REJECTED' : 'CORRECTION_REQUESTED';
    req.approverComments = dto.comments || null;
    req.decidedAt = new Date();
    req.approverName = `${actor?.firstName || 'HR'} ${actor?.lastName || 'Lead'}`.trim();

    return {
      success: true,
      message: `Leave request ${req.referenceId} marked as ${req.status}`,
      request: req,
    };
  }

  // =========================================================================
  // 5. ONBOARDING & CHECKLIST COORDINATION
  // =========================================================================

  async getOnboardingDashboard() {
    const employees = await this.getAllEmployeesRaw();
    const probationEmployees = employees.filter((e) => e.accountStatus === 'PROBATION');
    const allTasks = this.memoryOnboardingTasks;

    const completed = allTasks.filter((t) => t.isCompleted).length;
    const total = allTasks.length;
    const completionPercentage = Math.round((completed / (total || 1)) * 100);

    const hrPending = allTasks.filter((t) => !t.isCompleted && t.category === 'HR').length;
    const itPending = allTasks.filter((t) => !t.isCompleted && t.category === 'IT').length;

    return {
      upcomingJoinersCount: 2,
      joiningThisWeekCount: 1,
      joiningThisMonthCount: 2,
      onboardingPendingCount: probationEmployees.length,
      completionPercentage,
      hrTasksPending: hrPending,
      itTasksPending: itPending,
      activeOnboardingEmployees: probationEmployees.map((emp) => {
        const empTasks = allTasks.filter((t) => t.employeeId === emp.id);
        const empDone = empTasks.filter((t) => t.isCompleted).length;
        const progress = Math.round((empDone / (empTasks.length || 1)) * 100);
        return {
          ...emp,
          progress,
          tasksCount: empTasks.length,
          completedCount: empDone,
        };
      }),
    };
  }

  async getOnboardingChecklist(employeeId: string) {
    return this.memoryOnboardingTasks.filter((t) => t.employeeId === employeeId);
  }

  async toggleOnboardingTask(id: string, dto: ToggleOnboardingTaskDto, actor: any) {
    const task = this.memoryOnboardingTasks.find((t) => t.id === id);
    if (!task) throw new NotFoundException(`Onboarding task '${id}' not found`);

    task.isCompleted = dto.isCompleted;
    task.completedAt = dto.isCompleted ? new Date() : null;
    task.completedByName = dto.isCompleted ? `${actor?.firstName || 'HR'} ${actor?.lastName || 'Lead'}`.trim() : null;
    task.notes = dto.notes || task.notes;

    return {
      success: true,
      message: `Onboarding task '${task.taskName}' ${dto.isCompleted ? 'marked completed' : 'reopened'}`,
      task,
    };
  }

  // =========================================================================
  // 6. EMPLOYEE DOCUMENTS
  // =========================================================================

  async getDocuments(category?: string, employeeId?: string) {
    let list = this.memoryDocuments;
    if (category) list = list.filter((d) => d.category === category);
    if (employeeId) list = list.filter((d) => d.employeeId === employeeId);
    return list;
  }

  async uploadDocument(dto: UploadDocumentDto, actor: any) {
    const referenceId = generateReferenceId('DOC');
    const emp = await this.findEmployeeById(dto.employeeId);

    const doc = {
      id: referenceId,
      referenceId,
      employeeId: dto.employeeId,
      employeeName: emp ? `${emp.firstName} ${emp.lastName}` : 'Employee',
      category: dto.category,
      title: dto.title,
      fileName: dto.fileName,
      fileSize: dto.fileSize || 1048576,
      mimeType: dto.mimeType || 'application/pdf',
      fileUrl: dto.fileUrl || `https://storage.qclocker.io/docs/${referenceId}.pdf`,
      verificationStatus: 'PENDING',
      expiresAt: dto.expiresAt || null,
      createdAt: new Date(),
    };

    this.memoryDocuments.unshift(doc);
    return doc;
  }

  async verifyDocument(id: string, dto: VerifyDocumentDto, actor: any) {
    const doc = this.memoryDocuments.find((d) => d.id === id || d.referenceId === id);
    if (!doc) throw new NotFoundException(`Document '${id}' not found`);

    doc.verificationStatus = dto.status;
    doc.verifiedAt = new Date();
    doc.verifiedByName = `${actor?.firstName || 'HR'} ${actor?.lastName || 'Lead'}`.trim();
    doc.verificationNotes = dto.notes || null;

    return {
      success: true,
      message: `Document ${doc.referenceId} marked as ${doc.verificationStatus}`,
      document: doc,
    };
  }

  // =========================================================================
  // 7. OFFBOARDING & EXIT MANAGEMENT
  // =========================================================================

  async getExitDashboard() {
    return {
      activeExits: this.memoryExitRecords,
      totalNoticePeriod: this.memoryExitRecords.filter((e) => e.overallStatus === 'NOTICE_PERIOD').length,
      pendingClearances: this.memoryExitRecords.filter((e) => !e.hrClearance || !e.itClearance || !e.financeClearance).length,
    };
  }

  async initiateExit(dto: InitiateExitDto, actor: any) {
    const emp = await this.findEmployeeById(dto.employeeId);
    if (!emp) throw new NotFoundException(`Employee '${dto.employeeId}' not found`);

    const referenceId = generateReferenceId('EXT');
    const exitRec = {
      id: referenceId,
      referenceId,
      employeeId: emp.id,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      departmentName: emp.departmentName,
      jobTitle: emp.jobTitle,
      resignationDate: dto.resignationDate,
      noticePeriodDays: dto.noticePeriodDays || 30,
      lastWorkingDay: dto.lastWorkingDay,
      reason: dto.reason,
      overallStatus: 'NOTICE_PERIOD',
      hrClearance: false,
      itClearance: false,
      financeClearance: false,
      exitInterviewNotes: dto.exitInterviewNotes || null,
      createdAt: new Date(),
    };

    emp.accountStatus = 'NOTICE_PERIOD';
    this.memoryExitRecords.unshift(exitRec);

    // Record lifecycle history
    this.memoryLifecycleHistory.unshift({
      id: crypto.randomUUID(),
      employeeId: emp.id,
      changeType: 'RESIGNATION',
      previousValue: 'Active',
      newValue: `Notice Period (Last Day: ${dto.lastWorkingDay})`,
      effectiveDate: dto.resignationDate,
      reason: dto.reason,
      changedByName: `${actor?.firstName || 'HR'} ${actor?.lastName || 'Operations'}`.trim(),
      createdAt: new Date(),
    });

    return exitRec;
  }

  async updateExitClearance(id: string, dto: UpdateExitClearanceDto, actor: any) {
    const rec = this.memoryExitRecords.find((e) => e.id === id || e.referenceId === id);
    if (!rec) throw new NotFoundException(`Exit record '${id}' not found`);

    if (dto.hrClearance !== undefined) rec.hrClearance = dto.hrClearance;
    if (dto.itClearance !== undefined) rec.itClearance = dto.itClearance;
    if (dto.financeClearance !== undefined) rec.financeClearance = dto.financeClearance;

    if (rec.hrClearance && rec.itClearance && rec.financeClearance) {
      rec.overallStatus = 'COMPLETED';
      const emp = await this.findEmployeeById(rec.employeeId);
      if (emp) emp.accountStatus = 'RESIGNED';
    }

    return rec;
  }

  // =========================================================================
  // 8. UNIFIED HR APPROVAL CENTER
  // =========================================================================

  async getApprovalsQueue(type?: string) {
    const items: PendingHrActionItem[] = [];

    // Leaves
    this.memoryLeaveRequests
      .filter((l) => l.status === 'PENDING')
      .forEach((l) => {
        items.push({
          id: l.id,
          type: 'LEAVE',
          title: `Leave: ${l.leaveTypeName} (${l.totalDays} Days)`,
          employeeId: l.employeeId,
          employeeName: l.employeeName,
          submittedDate: l.createdAt instanceof Date ? l.createdAt.toISOString().split('T')[0] : String(l.createdAt),
          urgency: 'HIGH',
          details: `${l.startDate} to ${l.endDate} — Reason: ${l.reason}`,
        });
      });

    // Attendance corrections
    this.memoryAttendanceCorrections
      .filter((c) => c.status === 'PENDING')
      .forEach((c) => {
        items.push({
          id: c.id,
          type: 'ATTENDANCE_CORRECTION',
          title: `Attendance Correction for ${c.date}`,
          employeeId: c.employeeId,
          employeeName: c.employeeName,
          submittedDate: c.createdAt instanceof Date ? c.createdAt.toISOString().split('T')[0] : String(c.createdAt),
          urgency: 'NORMAL',
          details: `Requested: ${c.requestedCheckIn} to ${c.requestedCheckOut} (${c.reason})`,
        });
      });

    // Document verifications
    this.memoryDocuments
      .filter((d) => d.verificationStatus === 'PENDING')
      .forEach((d) => {
        items.push({
          id: d.id,
          type: 'DOCUMENT_VERIFICATION',
          title: `Document: ${d.title}`,
          employeeId: d.employeeId,
          employeeName: d.employeeName,
          submittedDate: d.createdAt instanceof Date ? d.createdAt.toISOString().split('T')[0] : String(d.createdAt),
          urgency: 'NORMAL',
          details: `${d.category} — File: ${d.fileName}`,
        });
      });

    // Exits
    this.memoryExitRecords
      .filter((e) => !e.hrClearance || !e.itClearance || !e.financeClearance)
      .forEach((e) => {
        items.push({
          id: e.id,
          type: 'EXIT_CLEARANCE',
          title: `Exit Clearance: ${e.employeeName}`,
          employeeId: e.employeeId,
          employeeName: e.employeeName,
          submittedDate: e.createdAt instanceof Date ? e.createdAt.toISOString().split('T')[0] : String(e.createdAt),
          urgency: 'CRITICAL',
          details: `Last day: ${e.lastWorkingDay} — HR: ${e.hrClearance ? 'OK' : 'PENDING'}, IT: ${e.itClearance ? 'OK' : 'PENDING'}`,
        });
      });

    if (type) {
      return items.filter((i) => i.type === type.toUpperCase());
    }
    return items;
  }

  async decideApproval(id: string, type: string, dto: DecideApprovalDto, actor: any) {
    const t = type.toUpperCase();
    if (t === 'LEAVE') {
      return this.decideLeave(id, { action: dto.action, comments: dto.comments }, actor);
    }
    if (t === 'ATTENDANCE_CORRECTION') {
      return this.decideAttendanceCorrection(
        id,
        { action: dto.action === 'APPROVE' ? 'APPROVE' : 'REJECT', comments: dto.comments },
        actor,
      );
    }
    if (t === 'DOCUMENT_VERIFICATION') {
      return this.verifyDocument(
        id,
        { status: dto.action === 'APPROVE' ? 'VERIFIED' : 'REJECTED', notes: dto.comments },
        actor,
      );
    }
    if (t === 'EXIT_CLEARANCE') {
      return this.updateExitClearance(id, { hrClearance: dto.action === 'APPROVE', itClearance: dto.action === 'APPROVE' }, actor);
    }
    return { success: true, message: `Approval ${id} decided with action ${dto.action}` };
  }

  // =========================================================================
  // 9. UNIFIED HR CALENDAR
  // =========================================================================

  async getCalendarEvents(year = 2026, month = 11) {
    const events: Array<any> = [];

    // Holidays
    this.memoryHolidays.forEach((h) => {
      events.push({
        id: `HOL-${h.id}`,
        title: `Holiday: ${h.name}`,
        date: h.holidayDate,
        type: 'HOLIDAY',
        category: h.holidayType,
        color: '#dc2626',
      });
    });

    // Approved leaves
    this.memoryLeaveRequests
      .filter((l) => l.status === 'APPROVED')
      .forEach((l) => {
        events.push({
          id: `LEV-${l.id}`,
          title: `On Leave: ${l.employeeName} (${l.leaveTypeName})`,
          date: l.startDate,
          endDate: l.endDate,
          type: 'LEAVE',
          employeeId: l.employeeId,
          color: '#f59e0b',
        });
      });

    // Birthdays
    events.push({
      id: 'BD-1',
      title: 'Birthday: David Ross',
      date: '2026-11-09',
      type: 'BIRTHDAY',
      employeeId: '00000000-0000-0000-0000-000000000004',
      color: '#8b5cf6',
    });

    // Anniversaries
    events.push({
      id: 'ANN-1',
      title: 'Work Anniversary: Marcus Chen (2 Yrs)',
      date: '2026-11-14',
      type: 'ANNIVERSARY',
      employeeId: '00000000-0000-0000-0000-000000000002',
      color: '#10b981',
    });

    return events;
  }

  // =========================================================================
  // 10. HR REPORTS & ANALYTICS
  // =========================================================================

  async getAnalytics(startDate?: string, endDate?: string) {
    const employees = await this.getAllEmployeesRaw();
    const total = employees.length;

    return {
      period: { startDate: startDate || '2026-01-01', endDate: endDate || '2026-11-05' },
      headcount: {
        total,
        active: employees.filter((e) => e.accountStatus === 'ACTIVE').length,
        probation: employees.filter((e) => e.accountStatus === 'PROBATION').length,
        noticePeriod: employees.filter((e) => e.accountStatus === 'NOTICE_PERIOD').length,
        turnoverRateAnnualized: 4.2,
      },
      departmentMetrics: [
        { department: 'Software Engineering', count: 5, percentage: 50.0, avgAttendance: 94.2 },
        { department: 'Information Technology', count: 3, percentage: 30.0, avgAttendance: 97.5 },
        { department: 'Human Resources', count: 1, percentage: 10.0, avgAttendance: 98.0 },
        { department: 'Operations & Logistics', count: 1, percentage: 10.0, avgAttendance: 91.0 },
      ],
      leaveUtilization: [
        { type: 'Casual Leave (CL)', allocatedDays: 120, usedDays: 32, utilizationRate: 26.6 },
        { type: 'Sick Leave (SL)', allocatedDays: 100, usedDays: 18, utilizationRate: 18.0 },
        { type: 'Earned Vacation (EL)', allocatedDays: 180, usedDays: 64, utilizationRate: 35.5 },
        { type: 'Privilege Leave (PL)', allocatedDays: 150, usedDays: 15, utilizationRate: 10.0 },
      ],
      onboardingEfficiency: {
        avgCompletionDays: 6.4,
        slaComplianceRate: 96.8,
        pendingVerificationItems: 3,
      },
    };
  }

  async exportReportPdf(): Promise<Buffer> {
    return new Promise((resolve) => {
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      const buffers: Buffer[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      // Header Banner
      doc.rect(0, 0, 595.28, 70).fill('#1E1B4B');
      doc.fillColor('#FFFFFF').fontSize(20).font('Helvetica-Bold').text('Q CLOCKER ENTERPRISE HRMS', 40, 22);
      doc.fontSize(10).font('Helvetica').text('EXECUTIVE WORKFORCE & PEOPLE OPERATIONS AUDIT REPORT', 40, 46);

      // Metadata Bar
      doc.fillColor('#334155').fontSize(9).font('Helvetica-Bold').text(`GENERATED: ${new Date().toISOString()}`, 40, 85);
      doc.font('Helvetica').text('CONFIDENTIALITY: LEVEL 3 RESTRICTED | PEOPLE OPERATIONS & C-SUITE', 40, 98);

      // Summary Table
      doc.rect(40, 115, 515, 80).fill('#F8FAFC').stroke('#E2E8F0');
      doc.fillColor('#1E293B').fontSize(12).font('Helvetica-Bold').text('ORGANIZATIONAL HEADCOUNT SUMMARY', 55, 128);

      doc.fontSize(10).font('Helvetica');
      doc.text('Total Employees: 10 active personnel', 55, 148);
      doc.text('Active Duty: 8 (80%)', 55, 163);
      doc.text('In Probationary Evaluation: 2 (20%)', 260, 148);
      doc.text('Average Org Attendance Rate: 94.6%', 260, 163);

      // Footer
      doc.fontSize(8).fillColor('#94A3B8').text('Q Clocker Platform v2.5.0-enterprise • Single Source of Truth Engine • Page 1 of 1', 40, 800, { align: 'center' });
      doc.end();
    });
  }

  // =========================================================================
  // HELPER METHODS
  // =========================================================================

  private async getAllEmployeesRaw(): Promise<Array<any>> {
    if (this.prisma.isConnected) {
      try {
        const dbUsers = await this.prisma.user.findMany({
          include: {
            department: true,
            designation: true,
            manager: true,
          },
          orderBy: { createdAt: 'desc' },
        });

        if (dbUsers && dbUsers.length > 0) {
          return dbUsers.map((u) => ({
            id: u.id,
            referenceId: u.referenceId,
            employeeCode: u.employeeCode || u.referenceId,
            firstName: u.firstName,
            lastName: u.lastName,
            email: u.email,
            personalEmail: u.personalEmail,
            phone: u.phone,
            departmentId: u.departmentId,
            departmentName: u.department?.name || 'General Operations',
            designationId: u.designationId,
            designationName: u.designation?.name || u.jobTitle || 'Team Member',
            jobTitle: u.jobTitle || 'Team Member',
            roleCode: u.roleCode,
            managerId: u.managerId,
            managerName: u.manager ? `${u.manager.firstName} ${u.manager.lastName}` : null,
            employmentType: u.employmentType,
            joiningDate: u.joiningDate ? u.joiningDate.toISOString().split('T')[0] : '2026-01-15',
            workLocation: u.workLocation,
            accountStatus: u.accountStatus,
            isActive: u.isActive,
            avatarUrl: u.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.firstName + ' ' + u.lastName)}&background=4f46e5&color=fff`,
            createdAt: u.createdAt,
          }));
        }
      } catch (err) {
        this.logger.warn(`Failed reading users from DB: ${(err as Error).message}`);
      }
    }
    return this.memoryEmployees;
  }

  private async findEmployeeById(id: string): Promise<any | null> {
    const list = await this.getAllEmployeesRaw();
    return list.find((e) => e.id === id || e.referenceId === id || e.employeeCode === id) || null;
  }
}
