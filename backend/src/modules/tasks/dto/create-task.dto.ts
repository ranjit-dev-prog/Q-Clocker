import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsUUID,
  IsNumber,
  Min,
  Max,
  IsDateString,
} from 'class-validator';
import { Priority, TaskStatus } from '../../../common/enums';

export class CreateTaskDto {
  @ApiProperty({ description: 'Task title', example: 'Implement Distributed Redis Rate Limiter' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ description: 'Detailed markdown or text description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Assigned Department UUID' })
  @IsUUID()
  @IsOptional()
  departmentId?: string;

  @ApiPropertyOptional({ description: 'Assigned Team UUID' })
  @IsUUID()
  @IsOptional()
  teamId?: string;

  @ApiPropertyOptional({ description: 'Related Project UUID' })
  @IsUUID()
  @IsOptional()
  projectId?: string;

  @ApiProperty({ enum: Priority, default: Priority.MEDIUM })
  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @ApiProperty({ description: 'Task category', default: 'Development' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ description: 'Assigned Employee UUID' })
  @IsUUID()
  @IsOptional()
  assignedEmployeeId?: string;

  @ApiPropertyOptional({ description: 'Reviewer Employee UUID' })
  @IsUUID()
  @IsOptional()
  reviewerId?: string;

  @ApiProperty({ description: 'Task scheduled start date', example: '2026-11-03T09:00:00Z' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: 'Task due date deadline', example: '2026-11-05T18:00:00Z' })
  @IsDateString()
  dueDate: string;

  @ApiPropertyOptional({ description: 'Estimated hours to complete', default: 4 })
  @IsNumber()
  @Min(0)
  @Max(1000)
  @IsOptional()
  estimatedHours?: number;

  @ApiPropertyOptional({ enum: TaskStatus, default: TaskStatus.ASSIGNED })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiPropertyOptional({ description: 'ID of prerequisite task that blocks this one' })
  @IsUUID()
  @IsOptional()
  dependsOnTaskId?: string;
}
