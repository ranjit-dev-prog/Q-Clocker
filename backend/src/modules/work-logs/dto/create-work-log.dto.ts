import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsUUID,
  IsNumber,
  Min,
  Max,
  Matches,
} from 'class-validator';

export class CreateWorkLogDto {
  @ApiPropertyOptional({ description: 'Linked Task UUID' })
  @IsUUID()
  @IsOptional()
  taskId?: string;

  @ApiPropertyOptional({ description: 'Linked Ticket UUID' })
  @IsUUID()
  @IsOptional()
  ticketId?: string;

  @ApiProperty({ description: 'Log date in YYYY-MM-DD format', example: '2026-11-03' })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'logDate must be in format YYYY-MM-DD' })
  logDate: string;

  @ApiProperty({ description: 'Start time in 24h format HH:mm', example: '09:00' })
  @IsString()
  @Matches(/^\d{2}:\d{2}$/, { message: 'startTime must be in HH:mm format' })
  startTime: string;

  @ApiProperty({ description: 'End time in 24h format HH:mm', example: '13:00' })
  @IsString()
  @Matches(/^\d{2}:\d{2}$/, { message: 'endTime must be in HH:mm format' })
  endTime: string;

  @ApiProperty({ description: 'Total hours logged', example: 4.0 })
  @IsNumber()
  @Min(0.1)
  @Max(24)
  totalHours: number;

  @ApiProperty({ description: 'Primary work description and deliverables' })
  @IsString()
  @IsNotEmpty()
  workDescription: string;

  @ApiPropertyOptional({ description: 'Technical investigation or root-cause diagnostics performed' })
  @IsString()
  @IsOptional()
  investigationPerformed?: string;

  @ApiPropertyOptional({ description: 'Specific engineering actions, commits, or changes taken' })
  @IsString()
  @IsOptional()
  actionsTaken?: string;

  @ApiPropertyOptional({ description: 'Impediments, blockers or challenges faced' })
  @IsString()
  @IsOptional()
  challengesFaced?: string;
}
