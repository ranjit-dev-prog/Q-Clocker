import { Priority, TicketCategory } from '../../../common/enums';
export declare class CreateTicketDto {
    title: string;
    description: string;
    departmentId?: string;
    assignedTechnicianId?: string;
    priority?: Priority;
    category?: TicketCategory;
    subcategory?: string;
    slaPolicyId?: string;
    relatedTaskId?: string;
    relatedAssetId?: string;
}
