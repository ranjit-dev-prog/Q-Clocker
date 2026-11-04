import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class TaxDeclarationDto {
  @ApiProperty({ example: '2026-2027', description: 'Financial year assessment period' })
  @IsString()
  @IsNotEmpty()
  financialYear: string;

  @ApiProperty({ enum: ['NEW', 'OLD'], default: 'NEW' })
  @IsString()
  @IsNotEmpty()
  regime: 'NEW' | 'OLD';

  @ApiPropertyOptional({ description: 'Section 80C investments (ELSS, PF, Life Insurance)' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  section80c?: number;

  @ApiPropertyOptional({ description: 'Section 80D medical health insurance premium' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  section80d?: number;

  @ApiPropertyOptional({ description: 'Annual rent paid for HRA tax exemption' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  hraRentPaid?: number;

  @ApiPropertyOptional({ description: 'Home loan interest deduction (Section 24)' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  homeLoanInterest?: number;

  @ApiPropertyOptional({ description: 'Other permissible deductions and donations' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  otherExemptions?: number;
}

