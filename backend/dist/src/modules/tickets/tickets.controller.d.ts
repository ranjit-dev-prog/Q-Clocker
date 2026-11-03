import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto, ResolveTicketDto } from './dto/update-ticket.dto';
import { TicketQueryDto } from './dto/ticket-query.dto';
import { CreateTicketCommentDto } from './dto/ticket-comment.dto';
export declare class TicketsController {
    private readonly ticketsService;
    constructor(ticketsService: TicketsService);
    create(createTicketDto: CreateTicketDto, user: any): Promise<any>;
    findAll(query: TicketQueryDto, user: any): Promise<any[]>;
    getMetrics(): Promise<{
        totalTickets: number;
        openTickets: number;
        resolvedTickets: number;
        slaBreachedCount: number;
        slaComplianceRate: string;
    }>;
    findOne(id: string): Promise<any>;
    update(id: string, updateTicketDto: UpdateTicketDto, user: any): Promise<any>;
    resolve(id: string, dto: ResolveTicketDto, user: any): Promise<any>;
    addComment(id: string, dto: CreateTicketCommentDto, user: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        comment: string;
        ticketId: string;
        isInternalNote: boolean;
    } | {
        id: `${string}-${string}-${string}-${string}-${string}`;
        ticketId: any;
        userId: any;
        userName: string;
        comment: string;
        isInternalNote: boolean;
        createdAt: Date;
    }>;
}
