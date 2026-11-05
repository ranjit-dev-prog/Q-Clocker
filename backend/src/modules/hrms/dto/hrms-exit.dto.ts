import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsDateString, IsNumber, IsBoolean } from 'class-validator';

export class InitiateExitDto {
  @ApiProperty({ example: '00000000-0000-0000-0000-000000000004' })
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @ApiProperty({ example: '2026-11-05' })
  @IsDateString()
  @IsNotEmpty()
  resignationDate: string;

  @ApiPropertyOptional({ example: 30 })
  @IsNumber()
  @IsOptional()
  noticePeriodDays?: number;

  @ApiProperty({ example: '2026-12-05' })
  @IsDateString()
  @IsNotEmpty()
  lastWorkingDay: string;

  @ApiProperty({ example: 'Pursuing higher studies / relocation.' })
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  exitInterviewNotes?: string;
}

export class UpdateExitClearanceDto {
  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  hrClearance?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  itClearance?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  financeClearance?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;
}
