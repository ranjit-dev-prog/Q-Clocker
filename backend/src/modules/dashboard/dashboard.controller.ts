import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Dashboard & Business Intelligence')
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get role-adaptive, database-calculated dashboard telemetry and metrics' })
  @ApiResponse({ status: 200, description: 'Dynamic dashboard KPIs, weekly velocity, and recent activities' })
  async getSummary(@CurrentUser() user: any) {
    return this.dashboardService.getSummary(user);
  }
}

