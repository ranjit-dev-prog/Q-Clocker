import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
import { Priority } from '../../../common/enums';

export class LinkExistingTaskDto {
  @ApiProperty({ description: 'UUID of the existing task to link to this ticket' })
  @IsUUID()
  @IsNotEmpty()
  taskId: string;
}

export class CreateTaskFromTicketDto {
  @ApiProperty({ description: 'Task title', example: 'Replace faulty memory module on db-node-02' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ description: 'Detailed work instructions' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ enum: Priority, default: Priority.MEDIUM })
  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @ApiPropertyOptional({ description: 'Assigned employee UUID' })
  @IsUUID()
  @IsOptional()
  assignedEmployeeId?: string;

  @ApiProperty({ description: 'Scheduled start date', example: '2026-11-03T09:00:00Z' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: 'Due date deadline', example: '2026-11-05T18:00:00Z' })
  @IsDateString()
  dueDate: string;

  @ApiPropertyOptional({ description: 'Estimated hours', default: 4 })
  @IsNumber()
  @Min(0.5)
  @Max(1000)
  @IsOptional()
  estimatedHours?: number;
}
