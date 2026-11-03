import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsUUID,
} from 'class-validator';
import { Priority, TicketCategory, TicketStatus } from '../../../common/enums';

export class CreateTicketDto {
  @ApiProperty({ description: 'Ticket subject line', example: 'VPN Gateway Cluster Auth Timeout' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Detailed problem description and reproduction steps' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ description: 'Department UUID handling this ticket' })
  @IsUUID()
  @IsOptional()
  departmentId?: string;

  @ApiPropertyOptional({ description: 'Assigned technician UUID' })
  @IsUUID()
  @IsOptional()
  assignedTechnicianId?: string;

  @ApiProperty({ enum: Priority, default: Priority.MEDIUM })
  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @ApiProperty({ enum: TicketCategory, default: TicketCategory.IT_SUPPORT })
  @IsEnum(TicketCategory)
  @IsOptional()
  category?: TicketCategory;

  @ApiPropertyOptional({ description: 'Subcategory identifier', example: 'OpenVPN Client' })
  @IsString()
  @IsOptional()
  subcategory?: string;

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
