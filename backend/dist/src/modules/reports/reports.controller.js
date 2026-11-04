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
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const reports_service_1 = require("./reports.service");
const report_query_dto_1 = require("./dto/report-query.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const enums_1 = require("../../common/enums");
let ReportsController = class ReportsController {
    reportsService;
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    async getItsmReport(query) {
        return this.reportsService.getItsmReport(query);
    }
    async getWorkforceReport(query) {
        return this.reportsService.getWorkforceReport(query);
    }
    async getAuditReport(query) {
        return this.reportsService.getAuditReport(query);
    }
    async exportReport(query, res) {
        const reportType = query.reportType || 'itsm';
        const format = query.format === 'csv' ? 'csv' : 'xlsx';
        const buffer = await this.reportsService.exportReport(reportType, format, query);
        if (format === 'csv') {
            res.setHeader('Content-Type', 'text/csv; charset=utf-8');
            res.setHeader('Content-Disposition', `attachment; filename="q_clocker_${reportType}_report.csv"`);
        }
        else {
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename="q_clocker_${reportType}_report.xlsx"`);
        }
        return res.end(buffer);
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)('itsm'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN, enums_1.UserRole.SYSTEM_ADMINISTRATOR, enums_1.UserRole.IT_MANAGER, enums_1.UserRole.HR_MANAGER, enums_1.UserRole.AUDITOR),
    (0, swagger_1.ApiOperation)({ summary: 'ITSM Service Desk Performance & SLA Analytics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'ITSM metrics retrieved' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [report_query_dto_1.ReportQueryDto]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getItsmReport", null);
__decorate([
    (0, common_1.Get)('workforce'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN, enums_1.UserRole.SYSTEM_ADMINISTRATOR, enums_1.UserRole.IT_MANAGER, enums_1.UserRole.HR_MANAGER, enums_1.UserRole.AUDITOR),
    (0, swagger_1.ApiOperation)({ summary: 'Workforce Timesheet, Utilization & Productivity Analytics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Workforce utilization retrieved' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [report_query_dto_1.ReportQueryDto]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getWorkforceReport", null);
__decorate([
    (0, common_1.Get)('audit'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN, enums_1.UserRole.SYSTEM_ADMINISTRATOR, enums_1.UserRole.AUDITOR),
    (0, swagger_1.ApiOperation)({ summary: 'Security Audit & Compliance Trail Report' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Security audit logs retrieved' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [report_query_dto_1.ReportQueryDto]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getAuditReport", null);
__decorate([
    (0, common_1.Get)('export'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN, enums_1.UserRole.SYSTEM_ADMINISTRATOR, enums_1.UserRole.IT_MANAGER, enums_1.UserRole.HR_MANAGER, enums_1.UserRole.AUDITOR),
    (0, swagger_1.ApiOperation)({ summary: 'Export structured reports to Microsoft Excel (.xlsx) or CSV' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [report_query_dto_1.ReportQueryDto, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "exportReport", null);
exports.ReportsController = ReportsController = __decorate([
    (0, swagger_1.ApiTags)('Reports & Analytics'),
    (0, common_1.Controller)('reports'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map