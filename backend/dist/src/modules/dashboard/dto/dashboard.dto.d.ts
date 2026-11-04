export interface DashboardKpis {
    totalWorkforce: number;
    totalEmployees: number;
    activeTasks: number;
    openTickets: number;
    p1CriticalCount: number;
    slaComplianceRate: number;
    avgResolutionTimeHours: number;
    totalDepartments: number;
    pendingApprovals: number;
    hoursLoggedToday: number;
}
export interface WeeklyProductivityDay {
    day: string;
    completed: number;
    total: number;
    hours: number;
}
export interface DepartmentDashboardStat {
    id: string;
    name: string;
    code: string;
    tasks: number;
    score: number;
    trend: string;
    memberCount: number;
}
export interface UpcomingTaskItem {
    id: string;
    code: string;
    title: string;
    assignee: string;
    due: string;
    priority: string;
    isUrgent: boolean;
}
export interface RecentActivityItem {
    id: string;
    user: string;
    action: string;
    target: string;
    time: string;
    icon: string;
    timestamp: string;
}
export interface DashboardSummaryResponse {
    role: string;
    roleDisplayName: string;
    kpis: DashboardKpis;
    weeklyProductivity: WeeklyProductivityDay[];
    departments: DepartmentDashboardStat[];
    upcomingTasks: UpcomingTaskItem[];
    recentActivities: RecentActivityItem[];
    roleSpecificData: Record<string, any>;
    timestamp: string;
}
