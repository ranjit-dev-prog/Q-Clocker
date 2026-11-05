import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString } from 'class-validator';

export class AttendancePunchDto {
  @ApiProperty({ enum: ['CHECK_IN', 'CHECK_OUT'] })
  @IsEnum(['CHECK_IN', 'CHECK_OUT'])
  @IsNotEmpty()
  type: 'CHECK_IN' | 'CHECK_OUT';

  @ApiPropertyOptional({ example: 'PORTAL' })
  @IsString()
  @IsOptional()
  source?: string;

  @ApiPropertyOptional({ example: '37.7749,-122.4194' })
  @IsString()
  @IsOptional()
  locationCoordinates?: string;
}

export class AttendanceCorrectionRequestDto {
  @ApiProperty({ example: '2026-11-04' })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ example: '09:00' })
  @IsString()
  @IsNotEmpty()
  requestedCheckIn: string;

  @ApiProperty({ example: '18:00' })
  @IsString()
  @IsNotEmpty()
  requestedCheckOut: string;

  @ApiProperty({ example: 'Forgot badge during morning office network migration.' })
  @IsString()
  @IsNotEmpty()
  reason: string;
}

export class AttendanceCorrectionDecisionDto {
  @ApiProperty({ enum: ['APPROVE', 'REJECT'] })
  @IsEnum(['APPROVE', 'REJECT'])
  @IsNotEmpty()
  action: 'APPROVE' | 'REJECT';

  @ApiPropertyOptional({ example: 'Approved after verification with IT team lead.' })
  @IsString()
  @IsOptional()
  comments?: string;
}
