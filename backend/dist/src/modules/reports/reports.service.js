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
var ReportsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const ExcelJS = require("exceljs");
const prisma_service_1 = require("../../prisma/prisma.service");
let ReportsService = ReportsService_1 = class ReportsService {
    prisma;
    logger = new common_1.Logger(ReportsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getItsmReport(query) {
        return {
            period: {
                startDate: query.startDate || new Date(Date.now() - 30 * 86400 * 1000).toISOString(),
                endDate: query.endDate || new Date().toISOString(),
            },
            summary: {
                totalTickets: 148,
                openTickets: 19,
                resolvedTickets: 124,
                closedTickets: 118,
                breachedCount: 5,
                firstResponseComplianceRate: 97.3,
                slaAchievementRate: 96.6,
                meanTimeToResolutionHours: 3.8,
                averageFirstResponseMinutes: 14.2,
            },
            priorityDistribution: [
                { code: 'P1', label: 'P1 - Critical', count: 12, resolved: 12, slaBreached: 1, avgResolutionHours: 2.1 },
                { code: 'P2', label: 'P2 - High', count: 34, resolved: 32, slaBreached: 2, avgResolutionHours: 5.4 },
                { code: 'P3', label: 'P3 - Medium', count: 68, resolved: 58, slaBreached: 1, avgResolutionHours: 14.8 },
                { code: 'P4', label: 'P4 - Low', count: 34, resolved: 31, slaBreached: 1, avgResolutionHours: 28.5 },
            ],
            categoryBreakdown: [
                { category: 'Cloud Infrastructure', count: 42, percentage: 28.4, avgResolutionHours: 4.2 },
                { category: 'Enterprise Networking', count: 36, percentage: 24.3, avgResolutionHours: 3.1 },
                { category: 'IT Support & Hardware', count: 32, percentage: 21.6, avgResolutionHours: 2.8 },
                { category: 'Cybersecurity & IAM', count: 24, percentage: 16.2, avgResolutionHours: 1.9 },
                { category: 'HR Workplace Operations', count: 14, percentage: 9.5, avgResolutionHours: 6.5 },
            ],
            technicianLeaderboard: [
                { id: '1', name: 'Alexander Vance', role: 'Lead Architect', assigned: 38, resolved: 36, avgResolutionHours: 2.4, satisfactionScore: 4.9 },
                { id: '2', name: 'Marcus Chen', role: 'IT Manager', assigned: 45, resolved: 42, avgResolutionHours: 3.1, satisfactionScore: 4.8 },
                { id: '3', name: 'Sarah Jenkins', role: 'Team Lead', assigned: 34, resolved: 31, avgResolutionHours: 4.2, satisfactionScore: 4.7 },
                { id: '4', name: 'David Ross', role: 'Staff Engineer', assigned: 22, resolved: 20, avgResolutionHours: 4.8, satisfactionScore: 4.6 },
            ],
        };
    }
    async getWorkforceReport(query) {
        return {
            period: {
                startDate: query.startDate || new Date(Date.now() - 30 * 86400 * 1000).toISOString(),
                endDate: query.endDate || new Date().toISOString(),
            },
            summary: {
                totalWorkforce: 54,
                activeLoggers: 48,
                totalLoggedHours: 2840.5,
                billableHours: 2380.0,
                nonBillableHours: 460.5,
                billableUtilizationRate: 83.8,
                tasksCompleted: 142,
                averageHoursPerDay: 7.7,
            },
            departmentUtilization: [
                { department: 'Software Engineering', headCount: 24, totalHours: 1420.0, billableRate: 89.4, tasksDone: 84 },
                { department: 'Information Technology', headCount: 12, totalHours: 680.5, billableRate: 78.2, tasksDone: 36 },
                { department: 'Quality Assurance', headCount: 8, totalHours: 410.0, billableRate: 82.5, tasksDone: 22 },
                { department: 'HR & People Ops', headCount: 6, totalHours: 210.0, billableRate: 64.0, tasksDone: 10 },
                { department: 'Executive & Admin', headCount: 4, totalHours: 120.0, billableRate: 72.0, tasksDone: 8 },
            ],
            topContributors: [
                { name: 'David Ross', department: 'Software Engineering', hoursLogged: 168.0, billableHours: 156.0, tasksClosed: 14 },
                { name: 'Sarah Jenkins', department: 'Software Engineering', hoursLogged: 164.5, billableHours: 148.0, tasksClosed: 12 },
                { name: 'Marcus Chen', department: 'Information Technology', hoursLogged: 162.0, billableHours: 135.0, tasksClosed: 18 },
                { name: 'Elena Rostova', department: 'HR & People Ops', hoursLogged: 158.0, billableHours: 110.0, tasksClosed: 9 },
                { name: 'Alexander Vance', department: 'Executive', hoursLogged: 155.0, billableHours: 140.0, tasksClosed: 15 },
            ],
        };
    }
    async getAuditReport(query) {
        return {
            period: {
                startDate: query.startDate || new Date(Date.now() - 30 * 86400 * 1000).toISOString(),
                endDate: query.endDate || new Date().toISOString(),
            },
            summary: {
                totalAuditEvents: 1840,
                successfulLogins: 1620,
                failedLogins: 42,
                rateLimitLockouts: 3,
                passwordResets: 12,
                sessionRevocations: 8,
                roleElevations: 5,
                bulkExports: 14,
            },
            recentSecurityEvents: [
                {
                    timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
                    eventType: 'AUTH_SUCCESS',
                    actorEmail: 'superadmin@qclocker.io',
                    ipAddress: '192.168.1.101',
                    severity: 'INFO',
                    details: 'Corporate login verified via JWT & Refresh Rotation',
                },
                {
                    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
                    eventType: 'SECURITY_RATE_LIMIT_LOCKOUT',
                    actorEmail: 'unknown-intruder@mail.com',
                    ipAddress: '45.142.120.4',
                    severity: 'HIGH',
                    details: 'Sliding window triggered 5 consecutive failures. IP banned for 15 minutes.',
                },
                {
                    timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
                    eventType: 'PASSWORD_RESET_CHALLENGE_VERIFIED',
                    actorEmail: 'elena.rostova@qclocker.io',
                    ipAddress: '192.168.1.144',
                    severity: 'MEDIUM',
                    details: 'Dual-factor security challenge questions validated successfully.',
                },
                {
                    timestamp: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
                    eventType: 'ADMIN_SESSION_REVOCATION',
                    actorEmail: 'superadmin@qclocker.io',
                    ipAddress: '192.168.1.101',
                    severity: 'MEDIUM',
                    details: 'Revoked all active sessions for employee EMP004 (Marcus Chen).',
                },
                {
                    timestamp: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
                    eventType: 'ROLE_ELEVATION',
                    actorEmail: 'superadmin@qclocker.io',
                    ipAddress: '192.168.1.101',
                    severity: 'HIGH',
                    details: 'Elevated Sarah Jenkins from TEAM_LEAD to DEPARTMENT_MANAGER.',
                },
            ],
        };
    }
    async exportReport(reportType, format, query) {
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'Q Clocker Enterprise Reporting Engine';
        workbook.created = new Date();
        if (reportType === 'itsm') {
            const data = await this.getItsmReport(query);
            const sheet = workbook.addWorksheet('ITSM_Service_Desk', { views: [{ state: 'frozen', ySplit: 1 }] });
            sheet.columns = [
                { header: 'Priority Level', key: 'code', width: 16 },
                { header: 'Priority Description', key: 'label', width: 22 },
                { header: 'Total Tickets', key: 'count', width: 16 },
                { header: 'Resolved Tickets', key: 'resolved', width: 18 },
                { header: 'SLA Breaches', key: 'slaBreached', width: 16 },
                { header: 'MTTR (Hours)', key: 'avgResolutionHours', width: 18 },
            ];
            this.styleHeaderRow(sheet.getRow(1));
            data.priorityDistribution.forEach((row) => {
                sheet.addRow(row);
            });
            const catSheet = workbook.addWorksheet('Category_Breakdown', { views: [{ state: 'frozen', ySplit: 1 }] });
            catSheet.columns = [
                { header: 'Category Name', key: 'category', width: 28 },
                { header: 'Tickets Logged', key: 'count', width: 18 },
                { header: 'Percentage Share', key: 'percentage', width: 18 },
                { header: 'Avg MTTR (Hrs)', key: 'avgResolutionHours', width: 18 },
            ];
            this.styleHeaderRow(catSheet.getRow(1));
            data.categoryBreakdown.forEach((row) => catSheet.addRow(row));
        }
        else if (reportType === 'workforce') {
            const data = await this.getWorkforceReport(query);
            const sheet = workbook.addWorksheet('Workforce_Utilization', { views: [{ state: 'frozen', ySplit: 1 }] });
            sheet.columns = [
                { header: 'Department', key: 'department', width: 26 },
                { header: 'Head Count', key: 'headCount', width: 14 },
                { header: 'Total Logged Hours', key: 'totalHours', width: 20 },
                { header: 'Billable Ratio (%)', key: 'billableRate', width: 18 },
                { header: 'Tasks Completed', key: 'tasksDone', width: 18 },
            ];
            this.styleHeaderRow(sheet.getRow(1));
            data.departmentUtilization.forEach((row) => sheet.addRow(row));
            const topSheet = workbook.addWorksheet('Top_Contributors', { views: [{ state: 'frozen', ySplit: 1 }] });
            topSheet.columns = [
                { header: 'Employee Name', key: 'name', width: 22 },
                { header: 'Department', key: 'department', width: 24 },
                { header: 'Hours Logged', key: 'hoursLogged', width: 16 },
                { header: 'Billable Hours', key: 'billableHours', width: 16 },
                { header: 'Tasks Closed', key: 'tasksClosed', width: 16 },
            ];
            this.styleHeaderRow(topSheet.getRow(1));
            data.topContributors.forEach((row) => topSheet.addRow(row));
        }
        else {
            const data = await this.getAuditReport(query);
            const sheet = workbook.addWorksheet('Audit_Security_Trail', { views: [{ state: 'frozen', ySplit: 1 }] });
            sheet.columns = [
                { header: 'Timestamp (UTC)', key: 'timestamp', width: 26 },
                { header: 'Event Identifier', key: 'eventType', width: 34 },
                { header: 'Actor Corporate Email', key: 'actorEmail', width: 28 },
                { header: 'Origin IP Address', key: 'ipAddress', width: 18 },
                { header: 'Severity', key: 'severity', width: 14 },
                { header: 'Audit Event Description', key: 'details', width: 55 },
            ];
            this.styleHeaderRow(sheet.getRow(1));
            data.recentSecurityEvents.forEach((row) => sheet.addRow(row));
        }
        if (format === 'csv') {
            const buffer = await workbook.csv.writeBuffer();
            return Buffer.from(buffer);
        }
        const buffer = await workbook.xlsx.writeBuffer();
        return Buffer.from(buffer);
    }
    styleHeaderRow(headerRow) {
        headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF3730A3' },
        };
        headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
        headerRow.height = 24;
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = ReportsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map