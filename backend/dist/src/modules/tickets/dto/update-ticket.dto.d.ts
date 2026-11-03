import { CreateTicketDto } from './create-ticket.dto';
import { TicketStatus } from '../../../common/enums';
declare const UpdateTicketDto_base: import("@nestjs/common").Type<Partial<CreateTicketDto>>;
export declare class UpdateTicketDto extends UpdateTicketDto_base {
    status?: TicketStatus;
    resolutionNotes?: string;
    resolutionSummary?: string;
    rootCause?: string;
    resolutionCategory?: string;
}
export declare class TransitionTicketStatusDto {
    status: TicketStatus;
    reason?: string;
    resolutionNotes?: string;
    resolutionSummary?: string;
    rootCause?: string;
    resolutionCategory?: string;
}
export declare class AssignTicketDto {
    assignedTechnicianId?: string;
    assignedTeamId?: string;
    reason?: string;
}
export declare class EscalateTicketDto {
    escalationReason: string;
    targetRole?: string;
}
export declare class ResolveTicketDto {
    resolutionNotes: string;
    resolutionSummary?: string;
    rootCause?: string;
    resolutionCategory?: string;
}
export declare class ReopenTicketDto {
    reason: string;
}
export {};
