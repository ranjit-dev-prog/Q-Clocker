import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateTicketCommentDto {
  @ApiProperty({ description: 'Comment text or resolution update', example: 'Renewed intermediate CA certificate in Vault.' })
  @IsString()
  @IsNotEmpty()
  comment: string;

  @ApiPropertyOptional({ description: 'Internal note visible only to support staff and admins', default: false })
  @IsBoolean()
  @IsOptional()
  isInternalNote?: boolean;
}
