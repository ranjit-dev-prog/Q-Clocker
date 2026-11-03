import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID, IsString } from 'class-validator';

export class TicketQueryDto {
  @ApiPropertyOptional({ description: 'Filter by ticket status' })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ description: 'Filter by priority level (e.g. CRITICAL, HIGH, MEDIUM, LOW)' })
  @IsString()
  @IsOptional()
  priority?: string;

  @ApiPropertyOptional({ description: 'Filter by priority code (P1, P2, P3, P4)' })
  @IsString()
  @IsOptional()
  priorityCode?: string;

  @ApiPropertyOptional({ description: 'Filter by category name' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ description: 'Filter by department UUID' })
  @IsUUID()
  @IsOptional()
  departmentId?: string;

  @ApiPropertyOptional({ description: 'Filter by assigned technician UUID' })
  @IsUUID()
  @IsOptional()
  assignedTechnicianId?: string;

  @ApiPropertyOptional({ description: 'Filter by assigned support team UUID' })
  @IsUUID()
  @IsOptional()
  assignedTeamId?: string;

  @ApiPropertyOptional({ description: 'Filter by requester UUID' })
  @IsUUID()
  @IsOptional()
  requesterId?: string;

  @ApiPropertyOptional({ description: 'Filter by SLA condition (WITHIN_SLA, APPROACHING_BREACH, BREACHED, PAUSED, COMPLETED)' })
  @IsString()
  @IsOptional()
  slaStatus?: string;

  @ApiPropertyOptional({ description: 'Global keyword search (Ticket reference, title, description, requester name)' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ description: 'Page number for pagination', default: 1 })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ description: 'Page size limit', default: 25 })
  @IsOptional()
  limit?: number;
}
