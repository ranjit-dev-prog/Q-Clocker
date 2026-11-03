import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'superadmin@qclocker.io', description: 'User corporate email address' })
  @IsEmail({}, { message: 'Please provide a valid corporate email address' })
  @IsNotEmpty({ message: 'Email address cannot be empty' })
  email: string;

  @ApiProperty({ example: 'SuperAdmin@2026!', description: 'User password' })
  @IsString()
  @IsNotEmpty({ message: 'Password cannot be empty' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}

