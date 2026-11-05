export declare class CreateLeaveTypeDto {
    code: string;
    name: string;
    description?: string;
    annualAllowanceDays: number;
    isPaid?: boolean;
    requiresAttachment?: boolean;
}
export declare class CreateLeaveRequestDto {
    leaveTypeCode: string;
    startDate: string;
    endDate: string;
    totalDays: number;
    reason: string;
    attachmentUrl?: string;
}
export declare class LeaveRequestDecisionDto {
    action: 'APPROVE' | 'REJECT' | 'REQUEST_INFO';
    comments?: string;
}
