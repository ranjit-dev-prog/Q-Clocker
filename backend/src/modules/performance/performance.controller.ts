import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PerformanceService } from './performance.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Performance & Appraisals')
@Controller('performance')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PerformanceController {
  constructor(private readonly performanceService: PerformanceService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get authenticated employee performance review and metrics' })
  @ApiResponse({ status: 200, description: 'Evaluation scores, complexity ratings, and manager review' })
  async getMyPerformance(@CurrentUser() user: any) {
    return this.performanceService.getMyPerformance(user);
  }
}
