export declare class CreateWorkLogDto {
    taskId?: string;
    ticketId?: string;
    logDate: string;
    startTime: string;
    endTime: string;
    totalHours: number;
    workDescription: string;
    investigationPerformed?: string;
    actionsTaken?: string;
    challengesFaced?: string;
}
