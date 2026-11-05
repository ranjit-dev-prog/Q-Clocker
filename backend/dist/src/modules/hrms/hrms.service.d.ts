import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { HrmsDashboardResponse, AttendanceOverviewSummary, PendingHrActionItem } from './dto/hrms-dashboard.dto';
import { CreateHrmsEmployeeDto, UpdateHrmsEmployeeDto, UpdateEmployeeStatusDto, HrmsEmployeeQueryDto } from './dto/hrms-employee.dto';
import { AttendancePunchDto, AttendanceCorrectionRequestDto, AttendanceCorrectionDecisionDto } from './dto/hrms-attendance.dto';
import { CreateLeaveRequestDto, LeaveRequestDecisionDto } from './dto/hrms-leave.dto';
import { ToggleOnboardingTaskDto } from './dto/hrms-onboarding.dto';
import { UploadDocumentDto, VerifyDocumentDto } from './dto/hrms-document.dto';
import { InitiateExitDto, UpdateExitClearanceDto } from './dto/hrms-exit.dto';
import { DecideApprovalDto } from './dto/hrms-approval.dto';
export declare class HrmsService {
    private readonly prisma;
    private readonly notificationsService?;
    private readonly logger;
    private memoryEmployees;
    private memoryLeaveTypes;
    private memoryLeaveBalances;
    private memoryLeaveRequests;
    private memoryAttendanceDaily;
    private memoryAttendanceCorrections;
    private memoryOnboardingTasks;
    private memoryDocuments;
    private memoryLifecycleHistory;
    private memoryExitRecords;
    private memoryHolidays;
    constructor(prisma: PrismaService, notificationsService?: NotificationsService | undefined);
    getDashboardSummary(): Promise<HrmsDashboardResponse>;
    getEmployees(query: HrmsEmployeeQueryDto, currentUser: any): Promise<{
        data: any[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getEmployeeProfile(id: string, currentUser: any): Promise<any>;
    createEmployee(dto: CreateHrmsEmployeeDto, actor: any): Promise<any>;
    updateEmployee(id: string, dto: UpdateHrmsEmployeeDto, actor: any): Promise<any>;
    updateEmployeeStatus(id: string, dto: UpdateEmployeeStatusDto, actor: any): Promise<{
        success: boolean;
        message: string;
        employee: any;
    }>;
    archiveEmployee(id: string, actor: any): Promise<{
        success: boolean;
        message: string;
        employee: any;
    }>;
    exportEmployees(format?: string): Promise<{
        buffer: Buffer;
        fileName: string;
        mimeType: string;
    }>;
    getAttendanceToday(): Promise<{
        date: string;
        summary: AttendanceOverviewSummary;
        records: any[];
    }>;
    getAttendanceMatrix(period?: string, month?: string): Promise<{
        period: string;
        month: string;
        days: {
            day: number;
            date: string;
            isWeekend: boolean;
        }[];
        matrix: {
            employeeId: any;
            employeeName: string;
            departmentName: any;
            totalPresent: number;
            totalLeaves: number;
            totalAbsents: number;
            attendancePercentage: number;
            days: {
                status: string;
                code: string;
            }[];
        }[];
    }>;
    punchAttendance(dto: AttendancePunchDto, user: any): Promise<{
        success: boolean;
        message: string;
        record: any;
    } | {
        success: boolean;
        message: string;
        record?: undefined;
    }>;
    requestAttendanceCorrection(dto: AttendanceCorrectionRequestDto, user: any): Promise<{
        success: boolean;
        message: string;
        correction: {
            id: string;
            employeeId: any;
            employeeName: string;
            date: string;
            originalCheckIn: string;
            originalCheckOut: null;
            requestedCheckIn: string;
            requestedCheckOut: string;
            reason: string;
            status: string;
            createdAt: Date;
        };
    }>;
    decideAttendanceCorrection(id: string, dto: AttendanceCorrectionDecisionDto, actor: any): Promise<{
        success: boolean;
        message: string;
        correction: any;
    }>;
    getLeaveTypes(): Promise<any[]>;
    getLeaveBalances(employeeId?: string, user?: any): Promise<any[]>;
    getLeaveRequests(status?: string): Promise<any[]>;
    applyLeave(dto: CreateLeaveRequestDto, user: any): Promise<{
        id: string;
        referenceId: string;
        employeeId: any;
        employeeName: string;
        employeeCode: string;
        departmentName: string;
        leaveTypeCode: string;
        leaveTypeName: any;
        startDate: string;
        endDate: string;
        totalDays: number;
        reason: string;
        attachmentUrl: string | null;
        status: string;
        approverId: string;
        approverName: string;
        createdAt: Date;
    }>;
    decideLeave(id: string, dto: LeaveRequestDecisionDto, actor: any): Promise<{
        success: boolean;
        message: string;
        request: any;
    }>;
    getOnboardingDashboard(): Promise<{
        upcomingJoinersCount: number;
        joiningThisWeekCount: number;
        joiningThisMonthCount: number;
        onboardingPendingCount: number;
        completionPercentage: number;
        hrTasksPending: number;
        itTasksPending: number;
        activeOnboardingEmployees: any[];
    }>;
    getOnboardingChecklist(employeeId: string): Promise<any[]>;
    toggleOnboardingTask(id: string, dto: ToggleOnboardingTaskDto, actor: any): Promise<{
        success: boolean;
        message: string;
        task: any;
    }>;
    getDocuments(category?: string, employeeId?: string): Promise<any[]>;
    uploadDocument(dto: UploadDocumentDto, actor: any): Promise<{
        id: string;
        referenceId: string;
        employeeId: string;
        employeeName: string;
        category: string;
        title: string;
        fileName: string;
        fileSize: number;
        mimeType: string;
        fileUrl: string;
        verificationStatus: string;
        expiresAt: string | null;
        createdAt: Date;
    }>;
    verifyDocument(id: string, dto: VerifyDocumentDto, actor: any): Promise<{
        success: boolean;
        message: string;
        document: any;
    }>;
    getExitDashboard(): Promise<{
        activeExits: any[];
        totalNoticePeriod: number;
        pendingClearances: number;
    }>;
    initiateExit(dto: InitiateExitDto, actor: any): Promise<{
        id: string;
        referenceId: string;
        employeeId: any;
        employeeName: string;
        departmentName: any;
        jobTitle: any;
        resignationDate: string;
        noticePeriodDays: number;
        lastWorkingDay: string;
        reason: string;
        overallStatus: string;
        hrClearance: boolean;
        itClearance: boolean;
        financeClearance: boolean;
        exitInterviewNotes: string | null;
        createdAt: Date;
    }>;
    updateExitClearance(id: string, dto: UpdateExitClearanceDto, actor: any): Promise<any>;
    getApprovalsQueue(type?: string): Promise<PendingHrActionItem[]>;
    decideApproval(id: string, type: string, dto: DecideApprovalDto, actor: any): Promise<any>;
    getCalendarEvents(year?: number, month?: number): Promise<any[]>;
    getAnalytics(startDate?: string, endDate?: string): Promise<{
        period: {
            startDate: string;
            endDate: string;
        };
        headcount: {
            total: number;
            active: number;
            probation: number;
            noticePeriod: number;
            turnoverRateAnnualized: number;
        };
        departmentMetrics: {
            department: string;
            count: number;
            percentage: number;
            avgAttendance: number;
        }[];
        leaveUtilization: {
            type: string;
            allocatedDays: number;
            usedDays: number;
            utilizationRate: number;
        }[];
        onboardingEfficiency: {
            avgCompletionDays: number;
            slaComplianceRate: number;
            pendingVerificationItems: number;
        };
    }>;
    exportReportPdf(): Promise<Buffer>;
    private getAllEmployeesRaw;
    private findEmployeeById;
}
