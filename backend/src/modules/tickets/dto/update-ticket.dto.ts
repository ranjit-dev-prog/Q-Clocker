import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateTicketDto } from './create-ticket.dto';
import { IsOptional, IsEnum, IsString, IsNotEmpty, IsUUID } from 'class-validator';
import { TicketStatus } from '../../../common/enums';

export class UpdateTicketDto extends PartialType(CreateTicketDto) {
  @ApiPropertyOptional({ enum: TicketStatus })
  @IsEnum(TicketStatus)
  @IsOptional()
  status?: TicketStatus;

  @ApiPropertyOptional({ description: 'Resolution root-cause and remediation summary' })
  @IsString()
  @IsOptional()
  resolutionNotes?: string;

  @ApiPropertyOptional({ description: 'Executive resolution summary' })
  @IsString()
  @IsOptional()
  resolutionSummary?: string;

  @ApiPropertyOptional({ description: 'Root cause identified during investigation' })
  @IsString()
  @IsOptional()
  rootCause?: string;

  @ApiPropertyOptional({ description: 'Categorization of the resolution' })
  @IsString()
  @IsOptional()
  resolutionCategory?: string;
}

export class TransitionTicketStatusDto {
  @ApiProperty({ enum: TicketStatus, description: 'Target status in the ITSM lifecycle' })
  @IsEnum(TicketStatus)
  @IsNotEmpty()
  status: TicketStatus;

  @ApiPropertyOptional({ description: 'Optional operational reason for the status transition' })
  @IsString()
  @IsOptional()
  reason?: string;

  @ApiPropertyOptional({ description: 'Required when transitioning to RESOLVED' })
  @IsString()
  @IsOptional()
  resolutionNotes?: string;

  @ApiPropertyOptional({ description: 'Executive resolution summary' })
  @IsString()
  @IsOptional()
  resolutionSummary?: string;

  @ApiPropertyOptional({ description: 'Root cause identified' })
  @IsString()
  @IsOptional()
  rootCause?: string;

  @ApiPropertyOptional({ description: 'Resolution category' })
  @IsString()
  @IsOptional()
  resolutionCategory?: string;
}

export class AssignTicketDto {
  @ApiPropertyOptional({ description: 'Technician UUID to assign the ticket to' })
  @IsUUID()
  @IsOptional()
  assignedTechnicianId?: string;

  @ApiPropertyOptional({ description: 'Support team UUID to route the ticket to' })
  @IsUUID()
  @IsOptional()
  assignedTeamId?: string;

  @ApiPropertyOptional({ description: 'Reason for assignment or transfer' })
  @IsString()
  @IsOptional()
  reason?: string;
}

export class EscalateTicketDto {
  @ApiProperty({ description: 'Detailed reason for ticket escalation' })
  @IsString()
  @IsNotEmpty()
  escalationReason: string;

  @ApiPropertyOptional({ description: 'Target escalation role (e.g., IT_MANAGER, ADMIN)' })
  @IsString()
  @IsOptional()
  targetRole?: string;
}

export class ResolveTicketDto {
  @ApiProperty({ description: 'Detailed remediation actions and fix applied' })
  @IsString()
  @IsNotEmpty()
  resolutionNotes: string;

  @ApiPropertyOptional({ description: 'Executive high-level resolution summary' })
  @IsString()
  @IsOptional()
  resolutionSummary?: string;

  @ApiPropertyOptional({ description: 'Underlying root cause identified during triage' })
  @IsString()
  @IsOptional()
  rootCause?: string;

  @ApiPropertyOptional({ description: 'Resolution classification (e.g. Patch Applied, Config Change, User Education)' })
  @IsString()
  @IsOptional()
  resolutionCategory?: string;
}

export class ReopenTicketDto {
  @ApiProperty({ description: 'Reason explaining why the resolved issue is recurring or unaddressed' })
  @IsString()
  @IsNotEmpty()
  reason: string;
}
