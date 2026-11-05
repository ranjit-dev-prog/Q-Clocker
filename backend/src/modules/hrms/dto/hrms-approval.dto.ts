import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export class DecideApprovalDto {
  @ApiProperty({ enum: ['APPROVE', 'REJECT', 'REQUEST_INFO'] })
  @IsEnum(['APPROVE', 'REJECT', 'REQUEST_INFO'])
  @IsNotEmpty()
  action: 'APPROVE' | 'REJECT' | 'REQUEST_INFO';

  @ApiPropertyOptional({ example: 'Approved by People Operations.' })
  @IsString()
  @IsOptional()
  comments?: string;
}

