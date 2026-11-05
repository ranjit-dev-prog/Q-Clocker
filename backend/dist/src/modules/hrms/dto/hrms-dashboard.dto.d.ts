export declare class HrmsKpiSummary {
    totalEmployees: number;
    activeEmployees: number;
    newJoinersThisMonth: number;
    employeesOnLeaveToday: number;
    employeesPresentToday: number;
    employeesAbsentToday: number;
    pendingLeaveRequests: number;
    pendingHrApprovals: number;
    employeesOnNoticePeriod: number;
    upcomingBirthdays: number;
    upcomingWorkAnniversaries: number;
    employeesWithMissingAttendance: number;
}
export declare class AttendanceOverviewSummary {
    presentCount: number;
    onLeaveCount: number;
    absentCount: number;
    lateArrivals: number;
    earlyDepartures: number;
    missingCheckouts: number;
    workingRemotely: number;
    attendancePercentage: number;
    totalOvertimeHoursToday: number;
}
export declare class DepartmentHeadcountStat {
    id: string;
    name: string;
    code: string;
    headcount: number;
    activeLeaves: number;
    presentToday: number;
    attendanceRate: number;
    managerName?: string;
}
export declare class UpcomingMilestoneItem {
    id: string;
    employeeId: string;
    employeeName: string;
    departmentName: string;
    avatarUrl?: string;
    milestoneType: 'BIRTHDAY' | 'WORK_ANNIVERSARY' | 'PROBATION_END' | 'NEW_JOINER';
    date: string;
    daysRemaining: number;
    highlightText: string;
}
export declare class PendingHrActionItem {
    id: string;
    type: 'LEAVE' | 'ATTENDANCE_CORRECTION' | 'ONBOARDING' | 'EXIT_CLEARANCE' | 'DOCUMENT_VERIFICATION' | 'PROFILE_UPDATE';
    title: string;
    employeeId: string;
    employeeName: string;
    submittedDate: string;
    urgency: 'NORMAL' | 'HIGH' | 'CRITICAL';
    details: string;
}
export declare class RecentEmployeeActivity {
    id: string;
    employeeId: string;
    employeeName: string;
    activityType: 'NEW_HIRE' | 'STATUS_CHANGE' | 'PROMOTION' | 'LEAVE_APPROVED' | 'DOCUMENT_UPLOADED' | 'RESIGNATION';
    description: string;
    timestamp: string;
}
export declare class HrmsDashboardResponse {
    kpis: HrmsKpiSummary;
    attendance: AttendanceOverviewSummary;
    departmentDistribution: DepartmentHeadcountStat[];
    upcomingMilestones: UpcomingMilestoneItem[];
    pendingActions: PendingHrActionItem[];
    recentActivities: RecentEmployeeActivity[];
    monthlyGrowthTrend: Array<{
        month: string;
        joiners: number;
        exits: number;
        netHeadcount: number;
    }>;
}
