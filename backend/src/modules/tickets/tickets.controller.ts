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
import { UpdateTicketDto, ResolveTicketDto } from './dto/update-ticket.dto';
import { TicketQueryDto } from './dto/ticket-query.dto';
import { CreateTicketCommentDto } from './dto/ticket-comment.dto';
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
  @ApiOperation({ summary: 'Create an IT service ticket with random TKT reference and SLA calculation' })
  @ApiResponse({ status: 201, description: 'Ticket created successfully' })
  async create(@Body() createTicketDto: CreateTicketDto, @CurrentUser() user: any) {
    return this.ticketsService.create(createTicketDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'List and filter tickets by status, category, priority, or technician' })
  @ApiResponse({ status: 200, description: 'Returns filtered ticket list with SLA breach flags' })
  async findAll(@Query() query: TicketQueryDto, @CurrentUser() user: any) {
    return this.ticketsService.findAll(query, user);
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Get ITSM & SLA compliance metrics' })
  @ApiResponse({ status: 200, description: 'SLA compliance and ticket volumes' })
  async getMetrics() {
    return this.ticketsService.getMetrics();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get full ticket details, history audit log, and comments' })
  @ApiResponse({ status: 200, description: 'Ticket details' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  async findOne(@Param('id') id: string) {
    return this.ticketsService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update ticket details, assign technician, or change priority' })
  @ApiResponse({ status: 200, description: 'Ticket updated' })
  async update(
    @Param('id') id: string,
    @Body() updateTicketDto: UpdateTicketDto,
    @CurrentUser() user: any,
  ) {
    return this.ticketsService.update(id, updateTicketDto, user);
  }

  @Post(':id/resolve')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resolve an incident ticket with root-cause and fix summary' })
  @ApiResponse({ status: 200, description: 'Ticket marked resolved' })
  async resolve(
    @Param('id') id: string,
    @Body() dto: ResolveTicketDto,
    @CurrentUser() user: any,
  ) {
    return this.ticketsService.resolve(id, dto, user);
  }

  @Post(':id/comments')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add a user comment or internal technician note to a ticket' })
  @ApiResponse({ status: 201, description: 'Comment logged' })
  async addComment(
    @Param('id') id: string,
    @Body() dto: CreateTicketCommentDto,
    @CurrentUser() user: any,
  ) {
    return this.ticketsService.addComment(id, dto, user);
  }
}
