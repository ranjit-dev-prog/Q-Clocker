import { Priority, TicketType, TicketImpact, TicketUrgency, TicketSource } from '../../../common/enums';
export declare class CreateTicketDto {
    title: string;
    description: string;
    ticketType?: TicketType;
    impact?: TicketImpact;
    urgency?: TicketUrgency;
    priority?: Priority;
    category?: string;
    subcategory?: string;
    departmentId?: string;
    assignedTeamId?: string;
    assignedTechnicianId?: string;
    source?: TicketSource;
    slaPolicyId?: string;
    relatedTaskId?: string;
    relatedAssetId?: string;
}
