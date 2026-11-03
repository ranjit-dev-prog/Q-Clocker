import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateTicketDto } from './create-ticket.dto';
import { IsOptional, IsEnum, IsString } from 'class-validator';
import { TicketStatus } from '../../../common/enums';

export class UpdateTicketDto extends PartialType(CreateTicketDto) {
  @ApiPropertyOptional({ enum: TicketStatus })
  @IsEnum(TicketStatus)
  @IsOptional()
  status?: TicketStatus;

  @ApiPropertyOptional({ description: 'Resolution root-cause and remediation summary' })
  @IsString()
  @IsOptional()
  resolutionNotes?: string;
}

export class ResolveTicketDto {
  @ApiPropertyOptional({ description: 'Resolution explanation and fix applied' })
  @IsString()
  resolutionNotes: string;
}
