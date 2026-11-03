import { Priority, TicketImpact, TicketUrgency, TicketPriorityCode, SlaStatus, TicketStatus } from '../../../common/enums';
export interface SlaTargetConfig {
    responseHours: number;
    resolutionHours: number;
}
export interface SlaCalculationResult {
    priority: Priority;
    priorityCode: TicketPriorityCode;
    responseHours: number;
    resolutionHours: number;
    firstResponseDueAt: Date;
    resolutionDueAt: Date;
    slaStatus: SlaStatus;
    slaBreached: boolean;
    remainingSeconds: number;
    percentageConsumed: number;
}
export declare class TicketSlaService {
    calculatePriority(impact?: TicketImpact | string, urgency?: TicketUrgency | string): {
        priority: Priority;
        priorityCode: TicketPriorityCode;
    };
    getSlaTargets(priorityCode: TicketPriorityCode): SlaTargetConfig;
    computeInitialSla(impact?: TicketImpact | string, urgency?: TicketUrgency | string, createdAt?: Date): SlaCalculationResult;
    evaluateLiveSla(ticket: {
        createdAt: Date | string;
        resolutionDueAt?: Date | string | null;
        status: TicketStatus | string;
        resolvedAt?: Date | string | null;
        slaPausedAt?: Date | string | null;
        slaPauseDurationSeconds?: number;
        slaHours?: number;
    }): {
        slaStatus: SlaStatus;
        slaBreached: boolean;
        remainingSeconds: number;
        percentageConsumed: number;
    };
}
