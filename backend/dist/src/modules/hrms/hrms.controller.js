"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HrmsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const hrms_service_1 = require("./hrms.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const enums_1 = require("../../common/enums");
const hrms_employee_dto_1 = require("./dto/hrms-employee.dto");
const hrms_attendance_dto_1 = require("./dto/hrms-attendance.dto");
const hrms_leave_dto_1 = require("./dto/hrms-leave.dto");
const hrms_onboarding_dto_1 = require("./dto/hrms-onboarding.dto");
const hrms_document_dto_1 = require("./dto/hrms-document.dto");
const hrms_exit_dto_1 = require("./dto/hrms-exit.dto");
const hrms_approval_dto_1 = require("./dto/hrms-approval.dto");
let HrmsController = class HrmsController {
    hrmsService;
    constructor(hrmsService) {
        this.hrmsService = hrmsService;
    }
    async getDashboardSummary() {
        return this.hrmsService.getDashboardSummary();
    }
    async getEmployees(query, user) {
        return this.hrmsService.getEmployees(query, user);
    }
    async exportEmployees(format, res) {
        const csvData = await this.hrmsService.exportEmployees(format);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="employees-export.csv"');
        return res.status(common_1.HttpStatus.OK).send(csvData);
    }
    async getEmployeeProfile(id, user) {
        return this.hrmsService.getEmployeeProfile(id, user);
    }
    async createEmployee(dto, user) {
        return this.hrmsService.createEmployee(dto, user);
    }
    async updateEmployee(id, dto, user) {
        return this.hrmsService.updateEmployee(id, dto, user);
    }
    async updateEmployeeStatus(id, dto, user) {
        return this.hrmsService.updateEmployeeStatus(id, dto, user);
    }
    async archiveEmployee(id, user) {
        return this.hrmsService.archiveEmployee(id, user);
    }
    async getAttendanceToday() {
        return this.hrmsService.getAttendanceToday();
    }
    async getAttendanceMatrix(period, month) {
        return this.hrmsService.getAttendanceMatrix(period, month);
    }
    async punchAttendance(dto, user) {
        return this.hrmsService.punchAttendance(dto, user);
    }
    async requestAttendanceCorrection(dto, user) {
        return this.hrmsService.requestAttendanceCorrection(dto, user);
    }
    async decideAttendanceCorrection(id, dto, user) {
        return this.hrmsService.decideAttendanceCorrection(id, dto, user);
    }
    async getLeaveTypes() {
        return this.hrmsService.getLeaveTypes();
    }
    async getLeaveBalances(employeeId, user) {
        return this.hrmsService.getLeaveBalances(employeeId, user);
    }
    async getLeaveRequests(status) {
        return this.hrmsService.getLeaveRequests(status);
    }
    async applyLeave(dto, user) {
        return this.hrmsService.applyLeave(dto, user);
    }
    async decideLeave(id, dto, user) {
        return this.hrmsService.decideLeave(id, dto, user);
    }
    async getOnboardingDashboard() {
        return this.hrmsService.getOnboardingDashboard();
    }
    async getOnboardingChecklist(employeeId) {
        return this.hrmsService.getOnboardingChecklist(employeeId);
    }
    async toggleOnboardingTask(id, dto, user) {
        return this.hrmsService.toggleOnboardingTask(id, dto, user);
    }
    async getDocuments(category, employeeId) {
        return this.hrmsService.getDocuments(category, employeeId);
    }
    async uploadDocument(dto, user) {
        return this.hrmsService.uploadDocument(dto, user);
    }
    async verifyDocument(id, dto, user) {
        return this.hrmsService.verifyDocument(id, dto, user);
    }
    async getExitDashboard() {
        return this.hrmsService.getExitDashboard();
    }
    async initiateExit(dto, user) {
        return this.hrmsService.initiateExit(dto, user);
    }
    async updateExitClearance(id, dto, user) {
        return this.hrmsService.updateExitClearance(id, dto, user);
    }
    async getApprovalsQueue(type) {
        return this.hrmsService.getApprovalsQueue(type);
    }
    async decideApproval(id, type, dto, user) {
        return this.hrmsService.decideApproval(id, type || 'LEAVE', dto, user);
    }
    async getCalendarEvents(year, month) {
        return this.hrmsService.getCalendarEvents(year ? Number(year) : undefined, month ? Number(month) : undefined);
    }
    async getAnalytics(startDate, endDate) {
        return this.hrmsService.getAnalytics(startDate, endDate);
    }
    async exportReportPdf(res) {
        const pdfBuffer = await this.hrmsService.exportReportPdf();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="q-clocker-hrms-report.pdf"');
        return res.status(common_1.HttpStatus.OK).send(pdfBuffer);
    }
};
exports.HrmsController = HrmsController;
__decorate([
    (0, common_1.Get)('dashboard/summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get enterprise HR dashboard summary and 12 KPI metrics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'HR metrics summary returned successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HrmsController.prototype, "getDashboardSummary", null);
__decorate([
    (0, common_1.Get)('employees'),
    (0, swagger_1.ApiOperation)({ summary: 'Search and filter employee directory' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [hrms_employee_dto_1.HrmsEmployeeQueryDto, Object]),
    __metadata("design:returntype", Promise)
], HrmsController.prototype, "getEmployees", null);
__decorate([
    (0, common_1.Get)('employees/export'),
    (0, swagger_1.ApiOperation)({ summary: 'Export employee directory to CSV/Excel' }),
    __param(0, (0, common_1.Query)('format')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], HrmsController.prototype, "exportEmployees", null);
__decorate([
    (0, common_1.Get)('employees/:id/profile'),
    (0, swagger_1.ApiOperation)({ summary: 'Get deep employee profile with career timeline and records' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], HrmsController.prototype, "getEmployeeProfile", null);
__decorate([
    (0, common_1.Post)('employees'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN, enums_1.UserRole.HR_MANAGER, enums_1.UserRole.HR_ADMINISTRATOR),
    (0, swagger_1.ApiOperation)({ summary: 'Create and onboard a new employee' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [hrms_employee_dto_1.CreateHrmsEmployeeDto, Object]),
    __metadata("design:returntype", Promise)
], HrmsController.prototype, "createEmployee", null);
__decorate([
    (0, common_1.Put)('employees/:id'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN, enums_1.UserRole.HR_MANAGER, enums_1.UserRole.HR_ADMINISTRATOR),
    (0, swagger_1.ApiOperation)({ summary: 'Update employee profile details' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, hrms_employee_dto_1.UpdateHrmsEmployeeDto, Object]),
    __metadata("design:returntype", Promise)
], HrmsController.prototype, "updateEmployee", null);
__decorate([
    (0, common_1.Patch)('employees/:id/status'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN, enums_1.UserRole.HR_MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Update employee status (ACTIVE, ON_LEAVE, NOTICE_PERIOD, TERMINATED)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, hrms_employee_dto_1.UpdateEmployeeStatusDto, Object]),
    __metadata("design:returntype", Promise)
], HrmsController.prototype, "updateEmployeeStatus", null);
__decorate([
    (0, common_1.Delete)('employees/:id'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Archive/soft-delete an employee' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], HrmsController.prototype, "archiveEmployee", null);
__decorate([
    (0, common_1.Get)('attendance/today'),
    (0, swagger_1.ApiOperation)({ summary: 'Get live attendance roster and today status' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HrmsController.prototype, "getAttendanceToday", null);
__decorate([
    (0, common_1.Get)('attendance/matrix'),
    (0, swagger_1.ApiOperation)({ summary: 'Get monthly or weekly attendance matrix' }),
    (0, swagger_1.ApiQuery)({ name: 'period', required: false, enum: ['monthly', 'weekly'] }),
    (0, swagger_1.ApiQuery)({ name: 'month', required: false, description: 'YYYY-MM' }),
    __param(0, (0, common_1.Query)('period')),
    __param(1, (0, common_1.Query)('month')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], HrmsController.prototype, "getAttendanceMatrix", null);
__decorate([
    (0, common_1.Post)('attendance/punch'),
    (0, swagger_1.ApiOperation)({ summary: 'Record employee attendance punch (IN / OUT)' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [hrms_attendance_dto_1.AttendancePunchDto, Object]),
    __metadata("design:returntype", Promise)
], HrmsController.prototype, "punchAttendance", null);
__decorate([
    (0, common_1.Post)('attendance/corrections'),
    (0, swagger_1.ApiOperation)({ summary: 'Submit an attendance correction request' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [hrms_attendance_dto_1.AttendanceCorrectionRequestDto, Object]),
    __metadata("design:returntype", Promise)
], HrmsController.prototype, "requestAttendanceCorrection", null);
__decorate([
    (0, common_1.Post)('attendance/corrections/:id/decide'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN, enums_1.UserRole.HR_MANAGER, enums_1.UserRole.DEPARTMENT_MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Approve or reject attendance correction request' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, hrms_attendance_dto_1.AttendanceCorrectionDecisionDto, Object]),
    __metadata("design:returntype", Promise)
], HrmsController.prototype, "decideAttendanceCorrection", null);
__decorate([
    (0, common_1.Get)('leaves/types'),
    (0, swagger_1.ApiOperation)({ summary: 'List all company leave policy types' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HrmsController.prototype, "getLeaveTypes", null);
__decorate([
    (0, common_1.Get)('leaves/balances'),
    (0, swagger_1.ApiOperation)({ summary: 'Get employee leave balances' }),
    (0, swagger_1.ApiQuery)({ name: 'employeeId', required: false }),
    __param(0, (0, common_1.Query)('employeeId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], HrmsController.prototype, "getLeaveBalances", null);
__decorate([
    (0, common_1.Get)('leaves/requests'),
    (0, swagger_1.ApiOperation)({ summary: 'List leave applications' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false }),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HrmsController.prototype, "getLeaveRequests", null);
__decorate([
    (0, common_1.Post)('leaves/requests'),
    (0, swagger_1.ApiOperation)({ summary: 'Apply for leave' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [hrms_leave_dto_1.CreateLeaveRequestDto, Object]),
    __metadata("design:returntype", Promise)
], HrmsController.prototype, "applyLeave", null);
__decorate([
    (0, common_1.Post)('leaves/requests/:id/decide'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN, enums_1.UserRole.HR_MANAGER, enums_1.UserRole.DEPARTMENT_MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Approve or reject leave request' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, hrms_leave_dto_1.LeaveRequestDecisionDto, Object]),
    __metadata("design:returntype", Promise)
], HrmsController.prototype, "decideLeave", null);
__decorate([
    (0, common_1.Get)('onboarding/dashboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Get active onboarding candidate progress' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HrmsController.prototype, "getOnboardingDashboard", null);
__decorate([
    (0, common_1.Get)('onboarding/checklists/:employeeId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get onboarding checklist tasks for employee' }),
    __param(0, (0, common_1.Param)('employeeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HrmsController.prototype, "getOnboardingChecklist", null);
__decorate([
    (0, common_1.Patch)('onboarding/checklists/:id/toggle'),
    (0, swagger_1.ApiOperation)({ summary: 'Toggle onboarding task completion' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, hrms_onboarding_dto_1.ToggleOnboardingTaskDto, Object]),
    __metadata("design:returntype", Promise)
], HrmsController.prototype, "toggleOnboardingTask", null);
__decorate([
    (0, common_1.Get)('documents'),
    (0, swagger_1.ApiOperation)({ summary: 'List employee documents with verification statuses' }),
    (0, swagger_1.ApiQuery)({ name: 'category', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'employeeId', required: false }),
    __param(0, (0, common_1.Query)('category')),
    __param(1, (0, common_1.Query)('employeeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], HrmsController.prototype, "getDocuments", null);
__decorate([
    (0, common_1.Post)('documents'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload/register an employee document' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [hrms_document_dto_1.UploadDocumentDto, Object]),
    __metadata("design:returntype", Promise)
], HrmsController.prototype, "uploadDocument", null);
__decorate([
    (0, common_1.Patch)('documents/:id/verify'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN, enums_1.UserRole.HR_MANAGER, enums_1.UserRole.HR_ADMINISTRATOR),
    (0, swagger_1.ApiOperation)({ summary: 'Verify or reject uploaded document' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, hrms_document_dto_1.VerifyDocumentDto, Object]),
    __metadata("design:returntype", Promise)
], HrmsController.prototype, "verifyDocument", null);
__decorate([
    (0, common_1.Get)('exit/dashboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Get exit pipeline and clearance status' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HrmsController.prototype, "getExitDashboard", null);
__decorate([
    (0, common_1.Post)('exit/initiate'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN, enums_1.UserRole.HR_MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Initiate employee resignation/exit workflow' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [hrms_exit_dto_1.InitiateExitDto, Object]),
    __metadata("design:returntype", Promise)
], HrmsController.prototype, "initiateExit", null);
__decorate([
    (0, common_1.Patch)('exit/:id/clearance'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN, enums_1.UserRole.HR_MANAGER, enums_1.UserRole.IT_MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Update exit clearance checklist' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, hrms_exit_dto_1.UpdateExitClearanceDto, Object]),
    __metadata("design:returntype", Promise)
], HrmsController.prototype, "updateExitClearance", null);
__decorate([
    (0, common_1.Get)('approvals'),
    (0, swagger_1.ApiOperation)({ summary: 'Get consolidated pending approval requests' }),
    (0, swagger_1.ApiQuery)({ name: 'type', required: false, description: 'LEAVE, ATTENDANCE, EXPENSE' }),
    __param(0, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HrmsController.prototype, "getApprovalsQueue", null);
__decorate([
    (0, common_1.Post)('approvals/:id/decide'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN, enums_1.UserRole.HR_MANAGER, enums_1.UserRole.DEPARTMENT_MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Approve or reject a request with audit log' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, hrms_approval_dto_1.DecideApprovalDto, Object]),
    __metadata("design:returntype", Promise)
], HrmsController.prototype, "decideApproval", null);
__decorate([
    (0, common_1.Get)('calendar/events'),
    (0, swagger_1.ApiOperation)({ summary: 'Get consolidated HR calendar events' }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'month', required: false }),
    __param(0, (0, common_1.Query)('year')),
    __param(1, (0, common_1.Query)('month')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], HrmsController.prototype, "getCalendarEvents", null);
__decorate([
    (0, common_1.Get)('reports/analytics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get organization analytics and turnover statistics' }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], HrmsController.prototype, "getAnalytics", null);
__decorate([
    (0, common_1.Get)('reports/export-pdf'),
    (0, swagger_1.ApiOperation)({ summary: 'Download executive HR summary report PDF' }),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HrmsController.prototype, "exportReportPdf", null);
exports.HrmsController = HrmsController = __decorate([
    (0, swagger_1.ApiTags)('HRMS Core'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('hrms'),
    __metadata("design:paramtypes", [hrms_service_1.HrmsService])
], HrmsController);
//# sourceMappingURL=hrms.controller.js.map