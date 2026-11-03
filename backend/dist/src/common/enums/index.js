"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationType = exports.TicketCategory = exports.TicketStatus = exports.Priority = exports.TaskStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["SUPER_ADMIN"] = "SUPER_ADMIN";
    UserRole["ADMIN"] = "ADMIN";
    UserRole["TEAM_LEAD"] = "TEAM_LEAD";
    UserRole["EMPLOYEE"] = "EMPLOYEE";
})(UserRole || (exports.UserRole = UserRole = {}));
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["NOT_STARTED"] = "NOT_STARTED";
    TaskStatus["IN_PROGRESS"] = "IN_PROGRESS";
    TaskStatus["ON_HOLD"] = "ON_HOLD";
    TaskStatus["UNDER_REVIEW"] = "UNDER_REVIEW";
    TaskStatus["COMPLETED"] = "COMPLETED";
    TaskStatus["REJECTED"] = "REJECTED";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
var Priority;
(function (Priority) {
    Priority["LOW"] = "LOW";
    Priority["MEDIUM"] = "MEDIUM";
    Priority["HIGH"] = "HIGH";
    Priority["CRITICAL"] = "CRITICAL";
})(Priority || (exports.Priority = Priority = {}));
var TicketStatus;
(function (TicketStatus) {
    TicketStatus["OPEN"] = "OPEN";
    TicketStatus["ASSIGNED"] = "ASSIGNED";
    TicketStatus["IN_PROGRESS"] = "IN_PROGRESS";
    TicketStatus["PENDING"] = "PENDING";
    TicketStatus["RESOLVED"] = "RESOLVED";
    TicketStatus["CLOSED"] = "CLOSED";
})(TicketStatus || (exports.TicketStatus = TicketStatus = {}));
var TicketCategory;
(function (TicketCategory) {
    TicketCategory["HARDWARE"] = "HARDWARE";
    TicketCategory["SOFTWARE"] = "SOFTWARE";
    TicketCategory["NETWORK"] = "NETWORK";
    TicketCategory["SERVER"] = "SERVER";
    TicketCategory["ACTIVE_DIRECTORY"] = "ACTIVE_DIRECTORY";
    TicketCategory["CYBERSECURITY"] = "CYBERSECURITY";
    TicketCategory["ACCESS_MANAGEMENT"] = "ACCESS_MANAGEMENT";
    TicketCategory["EMAIL"] = "EMAIL";
    TicketCategory["OTHER"] = "OTHER";
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
})(NotificationType || (exports.NotificationType = NotificationType = {}));
//# sourceMappingURL=index.js.map