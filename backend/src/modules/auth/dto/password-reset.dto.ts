import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, Matches, IsOptional } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'employee@qclocker.io', description: 'Registered corporate email address' })
  @IsEmail({}, { message: 'Must be a valid corporate email address' })
  @IsNotEmpty({ message: 'Email address is required' })
  email: string;
}

export class VerifyChallengeDto {
  @ApiProperty({ description: 'Single-use cryptographic challenge token' })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiPropertyOptional({ description: 'Answer to security question 1' })
  @IsString()
  @IsOptional()
  answer1?: string;

  @ApiPropertyOptional({ description: 'Answer to security question 2' })
  @IsString()
  @IsOptional()
  answer2?: string;

  @ApiPropertyOptional({ description: 'Personal recovery passphrase fallback' })
  @IsString()
  @IsOptional()
  recoveryCode?: string;

  @ApiPropertyOptional({ description: 'Personal recovery passphrase fallback alias' })
  @IsString()
  @IsOptional()
  recoveryPassphrase?: string;

  @ApiPropertyOptional({ description: 'Security question answers array' })
  @IsOptional()
  answers?: Array<{ questionId: string; answer: string }>;
}

export class ResetPasswordDto {
  @ApiProperty({ description: 'Single-use verified reset challenge token' })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    example: 'SecurePass@2026!#',
    description: 'Enterprise compliant password (min 12 chars, upper, lower, number, special char)',
  })
  @IsString()
  @MinLength(12, { message: 'Password must be at least 12 characters in length' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{12,}$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special symbol',
    },
  )
  newPassword: string;
}

export class AdminResetPasswordDto {
  @ApiPropertyOptional({ default: true, description: 'Force password change on next login' })
  @IsOptional()
  requirePasswordChange?: boolean;
}

