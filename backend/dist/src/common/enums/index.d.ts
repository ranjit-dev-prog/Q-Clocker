export declare enum UserRole {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    SYSTEM_ADMINISTRATOR = "SYSTEM_ADMINISTRATOR",
    HR_MANAGER = "HR_MANAGER",
    HR_ADMINISTRATOR = "HR_ADMINISTRATOR",
    HR_EXECUTIVE = "HR_EXECUTIVE",
    IT_MANAGER = "IT_MANAGER",
    IT_EXECUTIVE = "IT_EXECUTIVE",
    DEPARTMENT_MANAGER = "DEPARTMENT_MANAGER",
    TEAM_LEAD = "TEAM_LEAD",
    EMPLOYEE = "EMPLOYEE",
    AUDITOR = "AUDITOR",
    READ_ONLY = "READ_ONLY",
    VIEWER = "VIEWER"
}
export declare enum EmploymentType {
    FULL_TIME = "FULL_TIME",
    PART_TIME = "PART_TIME",
    CONTRACT = "CONTRACT",
    INTERN = "INTERN"
}
export declare enum AccountStatus {
    ACTIVE = "ACTIVE",
    INVITATION_PENDING = "INVITATION_PENDING",
    DEACTIVATED = "DEACTIVATED",
    ARCHIVED = "ARCHIVED"
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
    OPEN = "OPEN",
    ASSIGNED = "ASSIGNED",
    IN_PROGRESS = "IN_PROGRESS",
    PENDING_USER = "PENDING_USER",
    PENDING_VENDOR = "PENDING_VENDOR",
    ON_HOLD = "ON_HOLD",
    RESOLVED = "RESOLVED",
    CLOSED = "CLOSED",
    REOPENED = "REOPENED",
    CANCELLED = "CANCELLED"
}
export declare enum TicketType {
    INCIDENT = "Incident",
    SERVICE_REQUEST = "Service Request",
    PROBLEM = "Problem",
    CHANGE_REQUEST = "Change Request",
    ACCESS_REQUEST = "Access Request",
    SECURITY_INCIDENT = "Security Incident",
    HARDWARE_ISSUE = "Hardware Issue",
    SOFTWARE_ISSUE = "Software Issue",
    NETWORK_ISSUE = "Network Issue"
}
export declare enum TicketImpact {
    CRITICAL = "CRITICAL",
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW"
}
export declare enum TicketUrgency {
    CRITICAL = "CRITICAL",
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW"
}
export declare enum TicketPriorityCode {
    P1 = "P1",
    P2 = "P2",
    P3 = "P3",
    P4 = "P4"
}
export declare enum TicketSource {
    PORTAL = "PORTAL",
    EMAIL = "EMAIL",
    PHONE = "PHONE",
    SLACK = "SLACK",
    API = "API",
    SYSTEM = "SYSTEM"
}
export declare enum SlaStatus {
    WITHIN_SLA = "WITHIN_SLA",
    APPROACHING_BREACH = "APPROACHING_BREACH",
    BREACHED = "BREACHED",
    PAUSED = "PAUSED",
    COMPLETED = "COMPLETED"
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
    FACILITY_ADMIN = "Facility & Admin",
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
    APPROVAL_REQUESTED = "APPROVAL_REQUESTED",
    EMPLOYEE_INVITED = "EMPLOYEE_INVITED"
}
export declare enum ApprovalStatus {
    DRAFT = "DRAFT",
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}
