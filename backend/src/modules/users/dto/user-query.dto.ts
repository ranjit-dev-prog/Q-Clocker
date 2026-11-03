import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { UserRole } from '../../../common/enums';

export class UserQueryDto {
  @ApiPropertyOptional({ description: 'Filter by search query (name or email)' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: UserRole, description: 'Filter by user role' })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({ enum: UserRole, description: 'Filter by user role code' })
  @IsOptional()
  @IsEnum(UserRole)
  roleCode?: UserRole;

  @ApiPropertyOptional({ description: 'Filter by department ID' })
  @IsOptional()
  @IsUUID()
  departmentId?: string;

  @ApiPropertyOptional({ description: 'Filter by active status (true/false)' })
  @IsOptional()
  @IsString()
  isActive?: string;
}
