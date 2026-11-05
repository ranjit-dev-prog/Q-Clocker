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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HrmsDashboardResponse = exports.RecentEmployeeActivity = exports.PendingHrActionItem = exports.UpcomingMilestoneItem = exports.DepartmentHeadcountStat = exports.AttendanceOverviewSummary = exports.HrmsKpiSummary = void 0;
const swagger_1 = require("@nestjs/swagger");
class HrmsKpiSummary {
    totalEmployees;
    activeEmployees;
    newJoinersThisMonth;
    employeesOnLeaveToday;
    employeesPresentToday;
    employeesAbsentToday;
    pendingLeaveRequests;
    pendingHrApprovals;
    employeesOnNoticePeriod;
    upcomingBirthdays;
    upcomingWorkAnniversaries;
    employeesWithMissingAttendance;
}
exports.HrmsKpiSummary = HrmsKpiSummary;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 148 }),
    __metadata("design:type", Number)
], HrmsKpiSummary.prototype, "totalEmployees", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 142 }),
    __metadata("design:type", Number)
], HrmsKpiSummary.prototype, "activeEmployees", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 8 }),
    __metadata("design:type", Number)
], HrmsKpiSummary.prototype, "newJoinersThisMonth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5 }),
    __metadata("design:type", Number)
], HrmsKpiSummary.prototype, "employeesOnLeaveToday", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 132 }),
    __metadata("design:type", Number)
], HrmsKpiSummary.prototype, "employeesPresentToday", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5 }),
    __metadata("design:type", Number)
], HrmsKpiSummary.prototype, "employeesAbsentToday", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 6 }),
    __metadata("design:type", Number)
], HrmsKpiSummary.prototype, "pendingLeaveRequests", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 11 }),
    __metadata("design:type", Number)
], HrmsKpiSummary.prototype, "pendingHrApprovals", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2 }),
    __metadata("design:type", Number)
], HrmsKpiSummary.prototype, "employeesOnNoticePeriod", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 4 }),
    __metadata("design:type", Number)
], HrmsKpiSummary.prototype, "upcomingBirthdays", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3 }),
    __metadata("design:type", Number)
], HrmsKpiSummary.prototype, "upcomingWorkAnniversaries", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 4 }),
    __metadata("design:type", Number)
], HrmsKpiSummary.prototype, "employeesWithMissingAttendance", void 0);
class AttendanceOverviewSummary {
    presentCount;
    onLeaveCount;
    absentCount;
    lateArrivals;
    earlyDepartures;
    missingCheckouts;
    workingRemotely;
    attendancePercentage;
    totalOvertimeHoursToday;
}
exports.AttendanceOverviewSummary = AttendanceOverviewSummary;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 132 }),
    __metadata("design:type", Number)
], AttendanceOverviewSummary.prototype, "presentCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5 }),
    __metadata("design:type", Number)
], AttendanceOverviewSummary.prototype, "onLeaveCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5 }),
    __metadata("design:type", Number)
], AttendanceOverviewSummary.prototype, "absentCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 8 }),
    __metadata("design:type", Number)
], AttendanceOverviewSummary.prototype, "lateArrivals", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3 }),
    __metadata("design:type", Number)
], AttendanceOverviewSummary.prototype, "earlyDepartures", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 4 }),
    __metadata("design:type", Number)
], AttendanceOverviewSummary.prototype, "missingCheckouts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 24 }),
    __metadata("design:type", Number)
], AttendanceOverviewSummary.prototype, "workingRemotely", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 93.5 }),
    __metadata("design:type", Number)
], AttendanceOverviewSummary.prototype, "attendancePercentage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 14.5 }),
    __metadata("design:type", Number)
], AttendanceOverviewSummary.prototype, "totalOvertimeHoursToday", void 0);
class DepartmentHeadcountStat {
    id;
    name;
    code;
    headcount;
    activeLeaves;
    presentToday;
    attendanceRate;
    managerName;
}
exports.DepartmentHeadcountStat = DepartmentHeadcountStat;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DepartmentHeadcountStat.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DepartmentHeadcountStat.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DepartmentHeadcountStat.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], DepartmentHeadcountStat.prototype, "headcount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], DepartmentHeadcountStat.prototype, "activeLeaves", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], DepartmentHeadcountStat.prototype, "presentToday", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], DepartmentHeadcountStat.prototype, "attendanceRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DepartmentHeadcountStat.prototype, "managerName", void 0);
class UpcomingMilestoneItem {
    id;
    employeeId;
    employeeName;
    departmentName;
    avatarUrl;
    milestoneType;
    date;
    daysRemaining;
    highlightText;
}
exports.UpcomingMilestoneItem = UpcomingMilestoneItem;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UpcomingMilestoneItem.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UpcomingMilestoneItem.prototype, "employeeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UpcomingMilestoneItem.prototype, "employeeName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UpcomingMilestoneItem.prototype, "departmentName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UpcomingMilestoneItem.prototype, "avatarUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['BIRTHDAY', 'WORK_ANNIVERSARY', 'PROBATION_END', 'NEW_JOINER'] }),
    __metadata("design:type", String)
], UpcomingMilestoneItem.prototype, "milestoneType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UpcomingMilestoneItem.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UpcomingMilestoneItem.prototype, "daysRemaining", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UpcomingMilestoneItem.prototype, "highlightText", void 0);
class PendingHrActionItem {
    id;
    type;
    title;
    employeeId;
    employeeName;
    submittedDate;
    urgency;
    details;
}
exports.PendingHrActionItem = PendingHrActionItem;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PendingHrActionItem.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['LEAVE', 'ATTENDANCE_CORRECTION', 'ONBOARDING', 'EXIT_CLEARANCE', 'DOCUMENT_VERIFICATION', 'PROFILE_UPDATE'] }),
    __metadata("design:type", String)
], PendingHrActionItem.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PendingHrActionItem.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PendingHrActionItem.prototype, "employeeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PendingHrActionItem.prototype, "employeeName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PendingHrActionItem.prototype, "submittedDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PendingHrActionItem.prototype, "urgency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PendingHrActionItem.prototype, "details", void 0);
class RecentEmployeeActivity {
    id;
    employeeId;
    employeeName;
    activityType;
    description;
    timestamp;
}
exports.RecentEmployeeActivity = RecentEmployeeActivity;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RecentEmployeeActivity.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RecentEmployeeActivity.prototype, "employeeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RecentEmployeeActivity.prototype, "employeeName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RecentEmployeeActivity.prototype, "activityType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RecentEmployeeActivity.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RecentEmployeeActivity.prototype, "timestamp", void 0);
class HrmsDashboardResponse {
    kpis;
    attendance;
    departmentDistribution;
    upcomingMilestones;
    pendingActions;
    recentActivities;
    monthlyGrowthTrend;
}
exports.HrmsDashboardResponse = HrmsDashboardResponse;
__decorate([
    (0, swagger_1.ApiProperty)({ type: HrmsKpiSummary }),
    __metadata("design:type", HrmsKpiSummary)
], HrmsDashboardResponse.prototype, "kpis", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: AttendanceOverviewSummary }),
    __metadata("design:type", AttendanceOverviewSummary)
], HrmsDashboardResponse.prototype, "attendance", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [DepartmentHeadcountStat] }),
    __metadata("design:type", Array)
], HrmsDashboardResponse.prototype, "departmentDistribution", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [UpcomingMilestoneItem] }),
    __metadata("design:type", Array)
], HrmsDashboardResponse.prototype, "upcomingMilestones", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [PendingHrActionItem] }),
    __metadata("design:type", Array)
], HrmsDashboardResponse.prototype, "pendingActions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [RecentEmployeeActivity] }),
    __metadata("design:type", Array)
], HrmsDashboardResponse.prototype, "recentActivities", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], HrmsDashboardResponse.prototype, "monthlyGrowthTrend", void 0);
//# sourceMappingURL=hrms-dashboard.dto.js.map