import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateTicketTimeEntryDto {
  @ApiProperty({ description: 'Duration in minutes spent on this triage/fix session', example: 45 })
  @IsNumber()
  @Min(1)
  @Max(1440)
  durationMinutes: number;

  @ApiPropertyOptional({ description: 'Technical notes on the work performed during this session' })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class StartTicketTimerDto {
  @ApiPropertyOptional({ description: 'Optional initial task/session notes' })
  @IsString()
  @IsOptional()
  notes?: string;
}
