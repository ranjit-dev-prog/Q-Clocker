import { Priority, TicketCategory, TicketStatus } from '../../../common/enums';
export declare class TicketQueryDto {
    status?: TicketStatus;
    priority?: Priority;
    category?: TicketCategory;
    departmentId?: string;
    assignedTechnicianId?: string;
    requesterId?: string;
    search?: string;
}
