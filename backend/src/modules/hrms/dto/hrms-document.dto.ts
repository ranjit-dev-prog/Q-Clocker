import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString, IsNumber } from 'class-validator';

export class UploadDocumentDto {
  @ApiProperty({ example: '00000000-0000-0000-0000-000000000004' })
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @ApiProperty({
    enum: ['RESUME', 'APPOINTMENT_LETTER', 'EMPLOYMENT_AGREEMENT', 'NDA', 'IDENTITY_DOCUMENT', 'EDUCATION_CERTIFICATE', 'EXPERIENCE_LETTER', 'OTHER'],
  })
  @IsEnum(['RESUME', 'APPOINTMENT_LETTER', 'EMPLOYMENT_AGREEMENT', 'NDA', 'IDENTITY_DOCUMENT', 'EDUCATION_CERTIFICATE', 'EXPERIENCE_LETTER', 'OTHER'])
  @IsNotEmpty()
  category: string;

  @ApiProperty({ example: 'Passport / National Identity Document' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'david_ross_passport.pdf' })
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @ApiPropertyOptional({ example: 1048576 })
  @IsNumber()
  @IsOptional()
  fileSize?: number;

  @ApiPropertyOptional({ example: 'application/pdf' })
  @IsString()
  @IsOptional()
  mimeType?: string;

  @ApiPropertyOptional({ example: 'https://storage.qclocker.io/docs/emp-004/passport.pdf' })
  @IsString()
  @IsOptional()
  fileUrl?: string;

  @ApiPropertyOptional({ example: '2030-12-31' })
  @IsDateString()
  @IsOptional()
  expiresAt?: string;
}

export class VerifyDocumentDto {
  @ApiProperty({ enum: ['VERIFIED', 'REJECTED'] })
  @IsEnum(['VERIFIED', 'REJECTED'])
  @IsNotEmpty()
  status: 'VERIFIED' | 'REJECTED';

  @ApiPropertyOptional({ example: 'Verified authentic by HR compliance audit.' })
  @IsString()
  @IsOptional()
  notes?: string;
}

