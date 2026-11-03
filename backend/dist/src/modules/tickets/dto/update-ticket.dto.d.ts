import { CreateTicketDto } from './create-ticket.dto';
import { TicketStatus } from '../../../common/enums';
declare const UpdateTicketDto_base: import("@nestjs/common").Type<Partial<CreateTicketDto>>;
export declare class UpdateTicketDto extends UpdateTicketDto_base {
    status?: TicketStatus;
    resolutionNotes?: string;
}
export declare class ResolveTicketDto {
    resolutionNotes: string;
    rootCause?: string;
}
export {};
