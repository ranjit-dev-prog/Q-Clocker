import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class BulkImportPreviewDto {
  @ApiProperty({ description: 'Raw CSV text payload' })
  @IsString()
  @IsNotEmpty()
  csvContent: string;
}

export class ImportEmployeeRow {
  employee_code?: string;
  first_name: string;
  last_name: string;
  email: string;
  department?: string;
  designation?: string;
  manager_email?: string;
  role?: string;
  joining_date?: string;
  employment_type?: string;
  work_location?: string;
}

export class BulkImportConfirmDto {
  @ApiProperty({ description: 'List of validated employee records to persist' })
  @IsArray()
  employees: ImportEmployeeRow[];
}

