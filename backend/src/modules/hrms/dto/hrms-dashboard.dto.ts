import { ApiProperty } from '@nestjs/swagger';

export class HrmsKpiSummary {
  @ApiProperty({ example: 148 })
  totalEmployees: number;

  @ApiProperty({ example: 142 })
  activeEmployees: number;

  @ApiProperty({ example: 8 })
  newJoinersThisMonth: number;

  @ApiProperty({ example: 5 })
  employeesOnLeaveToday: number;

  @ApiProperty({ example: 132 })
  employeesPresentToday: number;

  @ApiProperty({ example: 5 })
  employeesAbsentToday: number;

  @ApiProperty({ example: 6 })
  pendingLeaveRequests: number;

  @ApiProperty({ example: 11 })
  pendingHrApprovals: number;

  @ApiProperty({ example: 2 })
  employeesOnNoticePeriod: number;

  @ApiProperty({ example: 4 })
  upcomingBirthdays: number;

  @ApiProperty({ example: 3 })
  upcomingWorkAnniversaries: number;

  @ApiProperty({ example: 4 })
  employeesWithMissingAttendance: number;
}

export class AttendanceOverviewSummary {
  @ApiProperty({ example: 132 })
  presentCount: number;

  @ApiProperty({ example: 5 })
  onLeaveCount: number;

  @ApiProperty({ example: 5 })
  absentCount: number;

  @ApiProperty({ example: 8 })
  lateArrivals: number;

  @ApiProperty({ example: 3 })
  earlyDepartures: number;

  @ApiProperty({ example: 4 })
  missingCheckouts: number;

  @ApiProperty({ example: 24 })
  workingRemotely: number;

  @ApiProperty({ example: 93.5 })
  attendancePercentage: number;

  @ApiProperty({ example: 14.5 })
  totalOvertimeHoursToday: number;
}

export class DepartmentHeadcountStat {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  headcount: number;

  @ApiProperty()
  activeLeaves: number;

  @ApiProperty()
  presentToday: number;

  @ApiProperty()
  attendanceRate: number;

  @ApiProperty()
  managerName?: string;
}

export class UpcomingMilestoneItem {
  @ApiProperty()
  id: string;

  @ApiProperty()
  employeeId: string;

  @ApiProperty()
  employeeName: string;

  @ApiProperty()
  departmentName: string;

  @ApiProperty()
  avatarUrl?: string;

  @ApiProperty({ enum: ['BIRTHDAY', 'WORK_ANNIVERSARY', 'PROBATION_END', 'NEW_JOINER'] })
  milestoneType: 'BIRTHDAY' | 'WORK_ANNIVERSARY' | 'PROBATION_END' | 'NEW_JOINER';

  @ApiProperty()
  date: string;

  @ApiProperty()
  daysRemaining: number;

  @ApiProperty()
  highlightText: string;
}

export class PendingHrActionItem {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: ['LEAVE', 'ATTENDANCE_CORRECTION', 'ONBOARDING', 'EXIT_CLEARANCE', 'DOCUMENT_VERIFICATION', 'PROFILE_UPDATE'] })
  type: 'LEAVE' | 'ATTENDANCE_CORRECTION' | 'ONBOARDING' | 'EXIT_CLEARANCE' | 'DOCUMENT_VERIFICATION' | 'PROFILE_UPDATE';

  @ApiProperty()
  title: string;

  @ApiProperty()
  employeeId: string;

  @ApiProperty()
  employeeName: string;

  @ApiProperty()
  submittedDate: string;

  @ApiProperty()
  urgency: 'NORMAL' | 'HIGH' | 'CRITICAL';

  @ApiProperty()
  details: string;
}

export class RecentEmployeeActivity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  employeeId: string;

  @ApiProperty()
  employeeName: string;

  @ApiProperty()
  activityType: 'NEW_HIRE' | 'STATUS_CHANGE' | 'PROMOTION' | 'LEAVE_APPROVED' | 'DOCUMENT_UPLOADED' | 'RESIGNATION';

  @ApiProperty()
  description: string;

  @ApiProperty()
  timestamp: string;
}

export class HrmsDashboardResponse {
  @ApiProperty({ type: HrmsKpiSummary })
  kpis: HrmsKpiSummary;

  @ApiProperty({ type: AttendanceOverviewSummary })
  attendance: AttendanceOverviewSummary;

  @ApiProperty({ type: [DepartmentHeadcountStat] })
  departmentDistribution: DepartmentHeadcountStat[];

  @ApiProperty({ type: [UpcomingMilestoneItem] })
  upcomingMilestones: UpcomingMilestoneItem[];

  @ApiProperty({ type: [PendingHrActionItem] })
  pendingActions: PendingHrActionItem[];

  @ApiProperty({ type: [RecentEmployeeActivity] })
  recentActivities: RecentEmployeeActivity[];

  @ApiProperty()
  monthlyGrowthTrend: Array<{ month: string; joiners: number; exits: number; netHeadcount: number }>;
}
