import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsIn } from 'class-validator';

export class ReportQueryDto {
  @ApiPropertyOptional({ description: 'Filter start date ISO string', example: '2026-10-01T00:00:00Z' })
  @IsString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ description: 'Filter end date ISO string', example: '2026-11-04T23:59:59Z' })
  @IsString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Filter by Department UUID' })
  @IsString()
  @IsOptional()
  departmentId?: string;

  @ApiPropertyOptional({ enum: ['itsm', 'workforce', 'audit'], default: 'itsm' })
  @IsIn(['itsm', 'workforce', 'audit'])
  @IsOptional()
  reportType?: 'itsm' | 'workforce' | 'audit';

  @ApiPropertyOptional({ enum: ['json', 'xlsx', 'csv'], default: 'json' })
  @IsIn(['json', 'xlsx', 'csv'])
  @IsOptional()
  format?: 'json' | 'xlsx' | 'csv';
}
