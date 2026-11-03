import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsUUID,
} from 'class-validator';
import {
  Priority,
  TicketCategory,
  TicketType,
  TicketImpact,
  TicketUrgency,
  TicketSource,
} from '../../../common/enums';

export class CreateTicketDto {
  @ApiProperty({ description: 'Ticket subject line', example: 'VPN Gateway Cluster Auth Timeout' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Detailed problem description and reproduction steps' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ enum: TicketType, default: TicketType.INCIDENT })
  @IsEnum(TicketType)
  @IsOptional()
  ticketType?: TicketType;

  @ApiPropertyOptional({ enum: TicketImpact, default: TicketImpact.MEDIUM })
  @IsEnum(TicketImpact)
  @IsOptional()
  impact?: TicketImpact;

  @ApiPropertyOptional({ enum: TicketUrgency, default: TicketUrgency.MEDIUM })
  @IsEnum(TicketUrgency)
  @IsOptional()
  urgency?: TicketUrgency;

  @ApiPropertyOptional({ enum: Priority, default: Priority.MEDIUM })
  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @ApiPropertyOptional({ enum: TicketCategory, default: TicketCategory.IT_SUPPORT })
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ description: 'Subcategory identifier', example: 'OpenVPN Client' })
  @IsString()
  @IsOptional()
  subcategory?: string;

  @ApiPropertyOptional({ description: 'Department UUID handling this ticket' })
  @IsUUID()
  @IsOptional()
  departmentId?: string;

  @ApiPropertyOptional({ description: 'Assigned Support Team UUID' })
  @IsUUID()
  @IsOptional()
  assignedTeamId?: string;

  @ApiPropertyOptional({ description: 'Assigned technician UUID' })
  @IsUUID()
  @IsOptional()
  assignedTechnicianId?: string;

  @ApiPropertyOptional({ enum: TicketSource, default: TicketSource.PORTAL })
  @IsEnum(TicketSource)
  @IsOptional()
  source?: TicketSource;

  @ApiPropertyOptional({ description: 'SLA Policy UUID' })
  @IsUUID()
  @IsOptional()
  slaPolicyId?: string;

  @ApiPropertyOptional({ description: 'Related Task UUID' })
  @IsUUID()
  @IsOptional()
  relatedTaskId?: string;

  @ApiPropertyOptional({ description: 'Related Asset UUID' })
  @IsUUID()
  @IsOptional()
  relatedAssetId?: string;
}
