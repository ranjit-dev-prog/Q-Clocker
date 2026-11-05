import { Response } from 'express';
import { HrmsService } from './hrms.service';
import { CreateHrmsEmployeeDto, UpdateHrmsEmployeeDto, UpdateEmployeeStatusDto, HrmsEmployeeQueryDto } from './dto/hrms-employee.dto';
import { AttendancePunchDto, AttendanceCorrectionRequestDto, AttendanceCorrectionDecisionDto } from './dto/hrms-attendance.dto';
import { CreateLeaveRequestDto, LeaveRequestDecisionDto } from './dto/hrms-leave.dto';
import { ToggleOnboardingTaskDto } from './dto/hrms-onboarding.dto';
import { UploadDocumentDto, VerifyDocumentDto } from './dto/hrms-document.dto';
import { InitiateExitDto, UpdateExitClearanceDto } from './dto/hrms-exit.dto';
import { DecideApprovalDto } from './dto/hrms-approval.dto';
export declare class HrmsController {
    private readonly hrmsService;
    constructor(hrmsService: HrmsService);
    getDashboardSummary(): Promise<import("./dto/hrms-dashboard.dto").HrmsDashboardResponse>;
    getEmployees(query: HrmsEmployeeQueryDto, user: any): Promise<{
        data: any[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    exportEmployees(format: string, res: Response): Promise<Response<any, Record<string, any>>>;
    getEmployeeProfile(id: string, user: any): Promise<any>;
    createEmployee(dto: CreateHrmsEmployeeDto, user: any): Promise<any>;
    updateEmployee(id: string, dto: UpdateHrmsEmployeeDto, user: any): Promise<any>;
    updateEmployeeStatus(id: string, dto: UpdateEmployeeStatusDto, user: any): Promise<{
        success: boolean;
        message: string;
        employee: any;
    }>;
    archiveEmployee(id: string, user: any): Promise<{
        success: boolean;
        message: string;
        employee: any;
    }>;
    getAttendanceToday(): Promise<{
        date: string;
        summary: import("./dto/hrms-dashboard.dto").AttendanceOverviewSummary;
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
    decideAttendanceCorrection(id: string, dto: AttendanceCorrectionDecisionDto, user: any): Promise<{
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
    decideLeave(id: string, dto: LeaveRequestDecisionDto, user: any): Promise<{
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
    toggleOnboardingTask(id: string, dto: ToggleOnboardingTaskDto, user: any): Promise<{
        success: boolean;
        message: string;
        task: any;
    }>;
    getDocuments(category?: string, employeeId?: string): Promise<any[]>;
    uploadDocument(dto: UploadDocumentDto, user: any): Promise<{
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
    verifyDocument(id: string, dto: VerifyDocumentDto, user: any): Promise<{
        success: boolean;
        message: string;
        document: any;
    }>;
    getExitDashboard(): Promise<{
        activeExits: any[];
        totalNoticePeriod: number;
        pendingClearances: number;
    }>;
    initiateExit(dto: InitiateExitDto, user: any): Promise<{
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
    updateExitClearance(id: string, dto: UpdateExitClearanceDto, user: any): Promise<any>;
    getApprovalsQueue(type?: string): Promise<import("./dto/hrms-dashboard.dto").PendingHrActionItem[]>;
    decideApproval(id: string, type: string, dto: DecideApprovalDto, user: any): Promise<any>;
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
    exportReportPdf(res: Response): Promise<Response<any, Record<string, any>>>;
}
