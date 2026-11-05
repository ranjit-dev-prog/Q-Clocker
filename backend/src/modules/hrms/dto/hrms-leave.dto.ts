import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString, IsNumber, IsBoolean } from 'class-validator';

export class CreateLeaveTypeDto {
  @ApiProperty({ example: 'CASUAL_LEAVE' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 'Casual Leave' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Standard periodic casual leave for personal reasons' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 12 })
  @IsNumber()
  annualAllowanceDays: number;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  isPaid?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  requiresAttachment?: boolean;
}

export class CreateLeaveRequestDto {
  @ApiProperty({ example: 'CASUAL_LEAVE' })
  @IsString()
  @IsNotEmpty()
  leaveTypeCode: string;

  @ApiProperty({ example: '2026-11-10' })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ example: '2026-11-12' })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({ example: 3 })
  @IsNumber()
  totalDays: number;

  @ApiProperty({ example: 'Attending family celebration' })
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  attachmentUrl?: string;
}

export class LeaveRequestDecisionDto {
  @ApiProperty({ enum: ['APPROVE', 'REJECT', 'REQUEST_INFO'] })
  @IsEnum(['APPROVE', 'REJECT', 'REQUEST_INFO'])
  @IsNotEmpty()
  action: 'APPROVE' | 'REJECT' | 'REQUEST_INFO';

  @ApiPropertyOptional({ example: 'Approved by People Operations.' })
  @IsString()
  @IsOptional()
  comments?: string;
}

