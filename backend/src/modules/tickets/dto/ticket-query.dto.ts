import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsUUID, IsString } from 'class-validator';
import { Priority, TicketCategory, TicketStatus } from '../../../common/enums';

export class TicketQueryDto {
  @ApiPropertyOptional({ enum: TicketStatus })
  @IsEnum(TicketStatus)
  @IsOptional()
  status?: TicketStatus;

  @ApiPropertyOptional({ enum: Priority })
  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @ApiPropertyOptional({ enum: TicketCategory })
  @IsEnum(TicketCategory)
  @IsOptional()
  category?: TicketCategory;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  departmentId?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  assignedTechnicianId?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  requesterId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  search?: string;
}
