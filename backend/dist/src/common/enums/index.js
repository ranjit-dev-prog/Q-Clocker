"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApprovalStatus = exports.NotificationType = exports.TicketCategory = exports.SlaStatus = exports.TicketSource = exports.TicketPriorityCode = exports.TicketUrgency = exports.TicketImpact = exports.TicketType = exports.TicketStatus = exports.TaskCategory = exports.Priority = exports.TaskStatus = exports.AccountStatus = exports.EmploymentType = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["SUPER_ADMIN"] = "SUPER_ADMIN";
    UserRole["ADMIN"] = "ADMIN";
    UserRole["HR_MANAGER"] = "HR_MANAGER";
    UserRole["HR_EXECUTIVE"] = "HR_EXECUTIVE";
    UserRole["IT_MANAGER"] = "IT_MANAGER";
    UserRole["IT_EXECUTIVE"] = "IT_EXECUTIVE";
    UserRole["TEAM_LEAD"] = "TEAM_LEAD";
    UserRole["EMPLOYEE"] = "EMPLOYEE";
    UserRole["AUDITOR"] = "AUDITOR";
    UserRole["READ_ONLY"] = "READ_ONLY";
})(UserRole || (exports.UserRole = UserRole = {}));
var EmploymentType;
(function (EmploymentType) {
    EmploymentType["FULL_TIME"] = "FULL_TIME";
    EmploymentType["PART_TIME"] = "PART_TIME";
    EmploymentType["CONTRACT"] = "CONTRACT";
    EmploymentType["INTERN"] = "INTERN";
})(EmploymentType || (exports.EmploymentType = EmploymentType = {}));
var AccountStatus;
(function (AccountStatus) {
    AccountStatus["ACTIVE"] = "ACTIVE";
    AccountStatus["INVITATION_PENDING"] = "INVITATION_PENDING";
    AccountStatus["DEACTIVATED"] = "DEACTIVATED";
    AccountStatus["ARCHIVED"] = "ARCHIVED";
})(AccountStatus || (exports.AccountStatus = AccountStatus = {}));
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["DRAFT"] = "DRAFT";
    TaskStatus["ASSIGNED"] = "ASSIGNED";
    TaskStatus["ACCEPTED"] = "ACCEPTED";
    TaskStatus["IN_PROGRESS"] = "IN_PROGRESS";
    TaskStatus["ON_HOLD"] = "ON_HOLD";
    TaskStatus["PENDING_REVIEW"] = "PENDING_REVIEW";
    TaskStatus["COMPLETED"] = "COMPLETED";
    TaskStatus["REJECTED"] = "REJECTED";
    TaskStatus["OVERDUE"] = "OVERDUE";
    TaskStatus["CANCELLED"] = "CANCELLED";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
var Priority;
(function (Priority) {
    Priority["LOW"] = "LOW";
    Priority["MEDIUM"] = "MEDIUM";
    Priority["HIGH"] = "HIGH";
    Priority["URGENT"] = "URGENT";
    Priority["CRITICAL"] = "CRITICAL";
})(Priority || (exports.Priority = Priority = {}));
var TaskCategory;
(function (TaskCategory) {
    TaskCategory["DEVELOPMENT"] = "Development";
    TaskCategory["MAINTENANCE"] = "Maintenance";
    TaskCategory["OPERATIONS"] = "Operations";
    TaskCategory["SECURITY"] = "Security";
    TaskCategory["SUPPORT"] = "Support";
    TaskCategory["RESEARCH"] = "Research";
    TaskCategory["INFRASTRUCTURE"] = "Infrastructure";
    TaskCategory["GENERAL"] = "General";
})(TaskCategory || (exports.TaskCategory = TaskCategory = {}));
var TicketStatus;
(function (TicketStatus) {
    TicketStatus["NEW"] = "NEW";
    TicketStatus["OPEN"] = "OPEN";
    TicketStatus["ASSIGNED"] = "ASSIGNED";
    TicketStatus["IN_PROGRESS"] = "IN_PROGRESS";
    TicketStatus["PENDING_USER"] = "PENDING_USER";
    TicketStatus["PENDING_VENDOR"] = "PENDING_VENDOR";
    TicketStatus["ON_HOLD"] = "ON_HOLD";
    TicketStatus["RESOLVED"] = "RESOLVED";
    TicketStatus["CLOSED"] = "CLOSED";
    TicketStatus["REOPENED"] = "REOPENED";
    TicketStatus["CANCELLED"] = "CANCELLED";
})(TicketStatus || (exports.TicketStatus = TicketStatus = {}));
var TicketType;
(function (TicketType) {
    TicketType["INCIDENT"] = "Incident";
    TicketType["SERVICE_REQUEST"] = "Service Request";
    TicketType["PROBLEM"] = "Problem";
    TicketType["CHANGE_REQUEST"] = "Change Request";
    TicketType["ACCESS_REQUEST"] = "Access Request";
    TicketType["SECURITY_INCIDENT"] = "Security Incident";
    TicketType["HARDWARE_ISSUE"] = "Hardware Issue";
    TicketType["SOFTWARE_ISSUE"] = "Software Issue";
    TicketType["NETWORK_ISSUE"] = "Network Issue";
})(TicketType || (exports.TicketType = TicketType = {}));
var TicketImpact;
(function (TicketImpact) {
    TicketImpact["CRITICAL"] = "CRITICAL";
    TicketImpact["HIGH"] = "HIGH";
    TicketImpact["MEDIUM"] = "MEDIUM";
    TicketImpact["LOW"] = "LOW";
})(TicketImpact || (exports.TicketImpact = TicketImpact = {}));
var TicketUrgency;
(function (TicketUrgency) {
    TicketUrgency["CRITICAL"] = "CRITICAL";
    TicketUrgency["HIGH"] = "HIGH";
    TicketUrgency["MEDIUM"] = "MEDIUM";
    TicketUrgency["LOW"] = "LOW";
})(TicketUrgency || (exports.TicketUrgency = TicketUrgency = {}));
var TicketPriorityCode;
(function (TicketPriorityCode) {
    TicketPriorityCode["P1"] = "P1";
    TicketPriorityCode["P2"] = "P2";
    TicketPriorityCode["P3"] = "P3";
    TicketPriorityCode["P4"] = "P4";
})(TicketPriorityCode || (exports.TicketPriorityCode = TicketPriorityCode = {}));
var TicketSource;
(function (TicketSource) {
    TicketSource["PORTAL"] = "PORTAL";
    TicketSource["EMAIL"] = "EMAIL";
    TicketSource["PHONE"] = "PHONE";
    TicketSource["SLACK"] = "SLACK";
    TicketSource["API"] = "API";
    TicketSource["SYSTEM"] = "SYSTEM";
})(TicketSource || (exports.TicketSource = TicketSource = {}));
var SlaStatus;
(function (SlaStatus) {
    SlaStatus["WITHIN_SLA"] = "WITHIN_SLA";
    SlaStatus["APPROACHING_BREACH"] = "APPROACHING_BREACH";
    SlaStatus["BREACHED"] = "BREACHED";
    SlaStatus["PAUSED"] = "PAUSED";
    SlaStatus["COMPLETED"] = "COMPLETED";
})(SlaStatus || (exports.SlaStatus = SlaStatus = {}));
var TicketCategory;
(function (TicketCategory) {
    TicketCategory["IT_SUPPORT"] = "IT Support";
    TicketCategory["INFRASTRUCTURE"] = "Infrastructure";
    TicketCategory["CYBERSECURITY"] = "Cybersecurity";
    TicketCategory["VAPT"] = "VAPT";
    TicketCategory["NETWORK"] = "Network";
    TicketCategory["APPLICATION"] = "Application";
    TicketCategory["SOFTWARE"] = "Software";
    TicketCategory["HARDWARE"] = "Hardware";
    TicketCategory["ACCESS_MANAGEMENT"] = "Access Management";
    TicketCategory["CLOUD_SECURITY"] = "Cloud Security";
    TicketCategory["COMPLIANCE"] = "Compliance";
    TicketCategory["HR_SUPPORT"] = "HR Support";
    TicketCategory["GENERAL"] = "General Requests";
})(TicketCategory || (exports.TicketCategory = TicketCategory = {}));
var NotificationType;
(function (NotificationType) {
    NotificationType["TASK_ASSIGNED"] = "TASK_ASSIGNED";
    NotificationType["TASK_STATUS_UPDATED"] = "TASK_STATUS_UPDATED";
    NotificationType["TASK_APPROVED"] = "TASK_APPROVED";
    NotificationType["TASK_REJECTED"] = "TASK_REJECTED";
    NotificationType["TICKET_ASSIGNED"] = "TICKET_ASSIGNED";
    NotificationType["TICKET_STATUS_UPDATED"] = "TICKET_STATUS_UPDATED";
    NotificationType["TICKET_RESOLVED"] = "TICKET_RESOLVED";
    NotificationType["DEADLINE_WARNING"] = "DEADLINE_WARNING";
    NotificationType["DEADLINE_OVERDUE"] = "DEADLINE_OVERDUE";
    NotificationType["FEEDBACK_RECEIVED"] = "FEEDBACK_RECEIVED";
    NotificationType["TIMESHEET_SUBMITTED"] = "TIMESHEET_SUBMITTED";
    NotificationType["TIMESHEET_APPROVED"] = "TIMESHEET_APPROVED";
    NotificationType["APPROVAL_REQUESTED"] = "APPROVAL_REQUESTED";
    NotificationType["EMPLOYEE_INVITED"] = "EMPLOYEE_INVITED";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
var ApprovalStatus;
(function (ApprovalStatus) {
    ApprovalStatus["DRAFT"] = "DRAFT";
    ApprovalStatus["PENDING"] = "PENDING";
    ApprovalStatus["APPROVED"] = "APPROVED";
    ApprovalStatus["REJECTED"] = "REJECTED";
})(ApprovalStatus || (exports.ApprovalStatus = ApprovalStatus = {}));
//# sourceMappingURL=index.js.map