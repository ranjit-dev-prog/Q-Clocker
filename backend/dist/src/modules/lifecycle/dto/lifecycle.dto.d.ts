export declare class CreateLifecycleEventDto {
    employeeId: string;
    eventType: 'BIRTHDAY' | 'WORK_ANNIVERSARY' | 'PROBATION_END' | 'CONTRACT_EXPIRY' | 'DOCUMENT_EXPIRY';
    eventDate: string;
    title: string;
    description?: string;
    urgency?: 'INFO' | 'UPCOMING' | 'CRITICAL';
}
export declare class ExtendProbationDto {
    newEndDate: string;
    reason: string;
}
