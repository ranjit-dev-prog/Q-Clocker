import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID, IsString } from 'class-validator';

export class WorkLogQueryDto {
  @ApiPropertyOptional({ description: 'Filter by employee UUID' })
  @IsUUID()
  @IsOptional()
  employeeId?: string;

  @ApiPropertyOptional({ description: 'Filter by date YYYY-MM-DD' })
  @IsString()
  @IsOptional()
  logDate?: string;

  @ApiPropertyOptional({ description: 'Filter by linked task UUID' })
  @IsUUID()
  @IsOptional()
  taskId?: string;

  @ApiPropertyOptional({ description: 'Filter by linked ticket UUID' })
  @IsUUID()
  @IsOptional()
  ticketId?: string;
}
