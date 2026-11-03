import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PermissionsService } from './permissions.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums';

@ApiTags('Permissions')
@Controller('permissions')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.AUDITOR)
  @ApiOperation({ summary: 'List all available granular system permissions' })
  @ApiResponse({ status: 200, description: 'List of permissions' })
  async findAll() {
    return this.permissionsService.findAll();
  }

  @Get('matrix')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.AUDITOR)
  @ApiOperation({ summary: 'Get full permission matrix by role and capability' })
  @ApiResponse({ status: 200, description: 'Permission matrix' })
  async getMatrix() {
    return this.permissionsService.getMatrix();
  }
}
