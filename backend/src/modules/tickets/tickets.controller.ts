import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import {
  UpdateTicketDto,
  ResolveTicketDto,
  TransitionTicketStatusDto,
  AssignTicketDto,
  EscalateTicketDto,
  ReopenTicketDto,
} from './dto/update-ticket.dto';
import { TicketQueryDto } from './dto/ticket-query.dto';
import { CreateTicketCommentDto } from './dto/ticket-comment.dto';
import { CreateTicketTimeEntryDto, StartTicketTimerDto } from './dto/ticket-time-entry.dto';
import { CreateTaskFromTicketDto, LinkExistingTaskDto } from './dto/ticket-task-link.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('ITSM Ticket Management')
@Controller('tickets')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create an IT service ticket with random TKT reference, priority matrix and SLA' })
  @ApiResponse({ status: 201, description: 'Ticket created successfully' })
  async create(@Body() createTicketDto: CreateTicketDto, @CurrentUser() user: any) {
    return this.ticketsService.create(createTicketDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'List and filter tickets by status, category, priority, SLA status, or keyword' })
  @ApiResponse({ status: 200, description: 'Returns filtered ticket list with live SLA calculations' })
  async findAll(@Query() query: TicketQueryDto, @CurrentUser() user: any) {
    return this.ticketsService.findAll(query, user);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get IT service category catalog and subcategories with default SLAs' })
  @ApiResponse({ status: 200, description: 'Category and subcategory hierarchy' })
  async getCategories() {
    return this.ticketsService.getCategories();
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Get ITSM executive KPIs, SLA compliance rates, and operational metrics' })
  @ApiResponse({ status: 200, description: 'Executive ITSM metrics' })
  async getMetrics() {
    return this.ticketsService.getMetrics();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get full ticket details, history audit log, linked tasks, and time entries' })
  @ApiResponse({ status: 200, description: 'Ticket details' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.ticketsService.findById(id, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update ticket properties' })
  @ApiResponse({ status: 200, description: 'Ticket updated' })
  async update(
    @Param('id') id: string,
    @Body() updateTicketDto: UpdateTicketDto,
    @CurrentUser() user: any,
  ) {
    return this.ticketsService.update(id, updateTicketDto, user);
  }

  @Post(':id/transition')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Transition ticket lifecycle status through validated state machine' })
  @ApiResponse({ status: 200, description: 'Ticket status transitioned' })
  async transition(
    @Param('id') id: string,
    @Body() dto: TransitionTicketStatusDto,
    @CurrentUser() user: any,
  ) {
    return this.ticketsService.transitionStatus(id, dto, user);
  }

  @Post(':id/assign')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assign or reassign ticket to a technician and/or support team' })
  @ApiResponse({ status: 200, description: 'Ticket assignment updated' })
  async assign(
    @Param('id') id: string,
    @Body() dto: AssignTicketDto,
    @CurrentUser() user: any,
  ) {
    return this.ticketsService.assign(id, dto, user);
  }

  @Post(':id/escalate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Escalate ticket to a higher management tier or specialized team' })
  @ApiResponse({ status: 200, description: 'Ticket escalated' })
  async escalate(
    @Param('id') id: string,
    @Body() dto: EscalateTicketDto,
    @CurrentUser() user: any,
  ) {
    return this.ticketsService.escalate(id, dto, user);
  }

  @Post(':id/resolve')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resolve an incident ticket with mandatory root-cause and fix summary' })
  @ApiResponse({ status: 200, description: 'Ticket marked resolved' })
  async resolve(
    @Param('id') id: string,
    @Body() dto: ResolveTicketDto,
    @CurrentUser() user: any,
  ) {
    return this.ticketsService.resolve(id, dto, user);
  }

  @Post(':id/reopen')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reopen a previously resolved ticket with mandatory reason' })
  @ApiResponse({ status: 200, description: 'Ticket reopened' })
  async reopen(
    @Param('id') id: string,
    @Body() dto: ReopenTicketDto,
    @CurrentUser() user: any,
  ) {
    return this.ticketsService.reopen(id, dto, user);
  }

  @Post(':id/comments')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add a public reply or internal technician note' })
  @ApiResponse({ status: 201, description: 'Comment logged' })
  async addComment(
    @Param('id') id: string,
    @Body() dto: CreateTicketCommentDto,
    @CurrentUser() user: any,
  ) {
    return this.ticketsService.addComment(id, dto, user);
  }

  @Post(':id/timer/start')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Start a live triage/fix stopwatch timer for this ticket' })
  @ApiResponse({ status: 200, description: 'Timer started' })
  async startTimer(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() dto?: StartTicketTimerDto,
  ) {
    return this.ticketsService.startTimer(id, user, dto);
  }

  @Post(':id/timer/stop')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Stop the active triage/fix stopwatch timer and persist duration' })
  @ApiResponse({ status: 200, description: 'Timer stopped and duration recorded' })
  async stopTimer(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.ticketsService.stopTimer(id, user);
  }

  @Post(':id/time-entries')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add a manual time log entry to this ticket' })
  @ApiResponse({ status: 201, description: 'Time entry created' })
  async addManualTimeEntry(
    @Param('id') id: string,
    @Body() dto: CreateTicketTimeEntryDto,
    @CurrentUser() user: any,
  ) {
    return this.ticketsService.addManualTimeEntry(id, dto, user);
  }

  @Post(':id/tasks')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a downstream action task from this ticket' })
  @ApiResponse({ status: 201, description: 'Task created and linked' })
  async createTaskFromTicket(
    @Param('id') id: string,
    @Body() dto: CreateTaskFromTicketDto,
    @CurrentUser() user: any,
  ) {
    return this.ticketsService.createTaskFromTicket(id, dto, user);
  }

  @Post(':id/link-task')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Link an existing task to this ticket' })
  @ApiResponse({ status: 200, description: 'Task linked successfully' })
  async linkExistingTask(
    @Param('id') id: string,
    @Body() dto: LinkExistingTaskDto,
    @CurrentUser() user: any,
  ) {
    return this.ticketsService.linkExistingTask(id, dto, user);
  }
}
