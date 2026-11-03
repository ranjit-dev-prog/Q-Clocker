export declare enum UserRole {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    TEAM_LEAD = "TEAM_LEAD",
    EMPLOYEE = "EMPLOYEE",
    AUDITOR = "AUDITOR"
}
export declare enum TaskStatus {
    DRAFT = "DRAFT",
    ASSIGNED = "ASSIGNED",
    ACCEPTED = "ACCEPTED",
    IN_PROGRESS = "IN_PROGRESS",
    ON_HOLD = "ON_HOLD",
    PENDING_REVIEW = "PENDING_REVIEW",
    COMPLETED = "COMPLETED",
    REJECTED = "REJECTED",
    OVERDUE = "OVERDUE",
    CANCELLED = "CANCELLED"
}
export declare enum Priority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    URGENT = "URGENT",
    CRITICAL = "CRITICAL"
}
export declare enum TaskCategory {
    DEVELOPMENT = "Development",
    MAINTENANCE = "Maintenance",
    OPERATIONS = "Operations",
    SECURITY = "Security",
    SUPPORT = "Support",
    RESEARCH = "Research",
    INFRASTRUCTURE = "Infrastructure",
    GENERAL = "General"
}
export declare enum TicketStatus {
    NEW = "NEW",
    ASSIGNED = "ASSIGNED",
    IN_PROGRESS = "IN_PROGRESS",
    PENDING_USER = "PENDING_USER",
    PENDING_VENDOR = "PENDING_VENDOR",
    PENDING_APPROVAL = "PENDING_APPROVAL",
    RESOLVED = "RESOLVED",
    CLOSED = "CLOSED"
}
export declare enum TicketCategory {
    IT_SUPPORT = "IT Support",
    INFRASTRUCTURE = "Infrastructure",
    CYBERSECURITY = "Cybersecurity",
    VAPT = "VAPT",
    NETWORK = "Network",
    APPLICATION = "Application",
    SOFTWARE = "Software",
    HARDWARE = "Hardware",
    ACCESS_MANAGEMENT = "Access Management",
    CLOUD_SECURITY = "Cloud Security",
    COMPLIANCE = "Compliance",
    HR_SUPPORT = "HR Support",
    GENERAL = "General Requests"
}
export declare enum NotificationType {
    TASK_ASSIGNED = "TASK_ASSIGNED",
    TASK_STATUS_UPDATED = "TASK_STATUS_UPDATED",
    TASK_APPROVED = "TASK_APPROVED",
    TASK_REJECTED = "TASK_REJECTED",
    TICKET_ASSIGNED = "TICKET_ASSIGNED",
    TICKET_STATUS_UPDATED = "TICKET_STATUS_UPDATED",
    TICKET_RESOLVED = "TICKET_RESOLVED",
    DEADLINE_WARNING = "DEADLINE_WARNING",
    DEADLINE_OVERDUE = "DEADLINE_OVERDUE",
    FEEDBACK_RECEIVED = "FEEDBACK_RECEIVED",
    TIMESHEET_SUBMITTED = "TIMESHEET_SUBMITTED",
    TIMESHEET_APPROVED = "TIMESHEET_APPROVED",
    APPROVAL_REQUESTED = "APPROVAL_REQUESTED"
}
export declare enum ApprovalStatus {
    DRAFT = "DRAFT",
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}
