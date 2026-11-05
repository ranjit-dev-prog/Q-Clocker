export declare class InitiateExitDto {
    employeeId: string;
    resignationDate: string;
    noticePeriodDays?: number;
    lastWorkingDay: string;
    reason: string;
    exitInterviewNotes?: string;
}
export declare class UpdateExitClearanceDto {
    hrClearance?: boolean;
    itClearance?: boolean;
    financeClearance?: boolean;
    notes?: string;
}
