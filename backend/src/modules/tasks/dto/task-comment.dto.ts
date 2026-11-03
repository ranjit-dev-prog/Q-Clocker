import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateTaskCommentDto {
  @ApiProperty({ description: 'Comment body', example: 'Code review completed. Pending integration test run.' })
  @IsString()
  @IsNotEmpty()
  comment: string;

  @ApiPropertyOptional({ description: 'True if internal note visible only to leads and managers', default: false })
  @IsBoolean()
  @IsOptional()
  isInternal?: boolean;
}
