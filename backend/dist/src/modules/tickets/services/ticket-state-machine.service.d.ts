import { TicketStatus, UserRole } from '../../../common/enums';
export interface TransitionContext {
    fromStatus: TicketStatus;
    toStatus: TicketStatus;
    actorRole: UserRole;
    actorId: string;
    reason?: string;
    resolutionNotes?: string;
    resolutionSummary?: string;
    rootCause?: string;
}
export declare class TicketStateMachineService {
    private readonly validTransitions;
    canTransition(from: TicketStatus, to: TicketStatus): boolean;
    validateTransition(ctx: TransitionContext): void;
    getPermittedNextStatuses(currentStatus: TicketStatus): TicketStatus[];
}
