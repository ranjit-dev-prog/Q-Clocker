import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ToggleOnboardingTaskDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  @IsNotEmpty()
  isCompleted: boolean;

  @ApiPropertyOptional({ example: 'Verified identity document against national ID registry.' })
  @IsString()
  @IsOptional()
  notes?: string;
}
