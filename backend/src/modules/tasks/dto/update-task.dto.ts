import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';
import { IsOptional, IsEnum, IsNumber, Min, Max, IsString } from 'class-validator';
import { TaskStatus } from '../../../common/enums';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiPropertyOptional({ enum: TaskStatus })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiPropertyOptional({ description: 'Completion percentage 0 to 100', minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  completionPercentage?: number;

  @ApiPropertyOptional({ description: 'Actual hours logged' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  actualHours?: number;

  @ApiPropertyOptional({ description: 'Review feedback from manager or peer' })
  @IsString()
  @IsOptional()
  reviewFeedback?: string;
}

export class UpdateTaskStatusDto {
  @ApiPropertyOptional({ enum: TaskStatus })
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @ApiPropertyOptional({ description: 'Updated completion percentage' })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  completionPercentage?: number;

  @ApiPropertyOptional({ description: 'Actual hours added or logged' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  actualHours?: number;

  @ApiPropertyOptional({ description: 'Review feedback or transition note' })
  @IsString()
  @IsOptional()
  feedback?: string;
}
