import { DatabaseService } from '../../database/database.service';
import { ReportQueryDto } from './dto/report-query.dto';
export declare class ReportsService {
    private readonly dbService;
    private readonly logger;
    constructor(dbService: DatabaseService);
    getItsmReport(query: ReportQueryDto): Promise<{
        period: {
            startDate: string;
            endDate: string;
        };
        summary: {
            totalTickets: number;
            openTickets: number;
            resolvedTickets: number;
            closedTickets: number;
            breachedCount: number;
            firstResponseComplianceRate: number;
            slaAchievementRate: number;
            meanTimeToResolutionHours: number;
            averageFirstResponseMinutes: number;
        };
        priorityDistribution: {
            code: string;
            label: string;
            count: number;
            resolved: number;
            slaBreached: number;
            avgResolutionHours: number;
        }[];
        categoryBreakdown: {
            category: string;
            count: number;
            percentage: number;
            avgResolutionHours: number;
        }[];
        technicianLeaderboard: {
            id: string;
            name: string;
            role: string;
            assigned: number;
            resolved: number;
            avgResolutionHours: number;
            satisfactionScore: number;
        }[];
    }>;
    getWorkforceReport(query: ReportQueryDto): Promise<{
        period: {
            startDate: string;
            endDate: string;
        };
        summary: {
            totalWorkforce: number;
            activeLoggers: number;
            totalLoggedHours: number;
            billableHours: number;
            nonBillableHours: number;
            billableUtilizationRate: number;
            tasksCompleted: number;
            averageHoursPerDay: number;
        };
        departmentUtilization: {
            department: string;
            headCount: number;
            totalHours: number;
            billableRate: number;
            tasksDone: number;
        }[];
        topContributors: {
            name: string;
            department: string;
            hoursLogged: number;
            billableHours: number;
            tasksClosed: number;
        }[];
    }>;
    getAuditReport(query: ReportQueryDto): Promise<{
        period: {
            startDate: string;
            endDate: string;
        };
        summary: {
            totalAuditEvents: number;
            successfulLogins: number;
            failedLogins: number;
            rateLimitLockouts: number;
            passwordResets: number;
            sessionRevocations: number;
            roleElevations: number;
            bulkExports: number;
        };
        recentSecurityEvents: {
            timestamp: string;
            eventType: string;
            actorEmail: string;
            ipAddress: string;
            severity: string;
            details: string;
        }[];
    }>;
    exportReport(reportType: 'itsm' | 'workforce' | 'audit', format: 'xlsx' | 'csv', query: ReportQueryDto): Promise<Buffer>;
    private styleHeaderRow;
}
