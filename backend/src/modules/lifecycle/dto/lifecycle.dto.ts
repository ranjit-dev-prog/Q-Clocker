import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsIn } from 'class-validator';

export class CreateLifecycleEventDto {
  @ApiProperty({ description: 'Target employee UUID' })
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @ApiProperty({ enum: ['BIRTHDAY', 'WORK_ANNIVERSARY', 'PROBATION_END', 'CONTRACT_EXPIRY', 'DOCUMENT_EXPIRY'] })
  @IsIn(['BIRTHDAY', 'WORK_ANNIVERSARY', 'PROBATION_END', 'CONTRACT_EXPIRY', 'DOCUMENT_EXPIRY'])
  eventType: 'BIRTHDAY' | 'WORK_ANNIVERSARY' | 'PROBATION_END' | 'CONTRACT_EXPIRY' | 'DOCUMENT_EXPIRY';

  @ApiProperty({ example: '2026-11-15' })
  @IsString()
  @IsNotEmpty()
  eventDate: string;

  @ApiProperty({ example: '3-Year Work Anniversary' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ description: 'Event details and milestone notes' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ enum: ['INFO', 'UPCOMING', 'CRITICAL'], default: 'UPCOMING' })
  @IsIn(['INFO', 'UPCOMING', 'CRITICAL'])
  @IsOptional()
  urgency?: 'INFO' | 'UPCOMING' | 'CRITICAL';
}

export class ExtendProbationDto {
  @ApiProperty({ example: '2026-12-31', description: 'New probation end date' })
  @IsString()
  @IsNotEmpty()
  newEndDate: string;

  @ApiProperty({ example: 'Additional performance review cycle required in Q4.' })
  @IsString()
  @IsNotEmpty()
  reason: string;
}

