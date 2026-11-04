import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AuthUserDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  referenceId?: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  role: string;

  @ApiPropertyOptional({ nullable: true })
  departmentId?: string | null;

  @ApiPropertyOptional({ nullable: true })
  teamId?: string | null;

  @ApiPropertyOptional({ nullable: true })
  jobTitle?: string | null;

  @ApiPropertyOptional({ nullable: true })
  avatarUrl?: string | null;

  @ApiPropertyOptional({ type: [String], description: 'Granular permissions list' })
  permissions?: string[];
}

export class AuthResponseDto {
  @ApiProperty({ description: 'JWT Access Token' })
  accessToken: string;

  @ApiPropertyOptional({ description: 'JWT Refresh Token for session renewal' })
  refreshToken?: string;

  @ApiProperty({ description: 'Token expiration timestamp in seconds' })
  expiresIn: number;

  @ApiProperty({ type: AuthUserDto })
  user: AuthUserDto;
}
