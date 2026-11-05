export declare class AttendancePunchDto {
    type: 'CHECK_IN' | 'CHECK_OUT';
    source?: string;
    locationCoordinates?: string;
}
export declare class AttendanceCorrectionRequestDto {
    date: string;
    requestedCheckIn: string;
    requestedCheckOut: string;
    reason: string;
}
export declare class AttendanceCorrectionDecisionDto {
    action: 'APPROVE' | 'REJECT';
    comments?: string;
}
