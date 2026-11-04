import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { LifecycleService } from './lifecycle.service';
import { ExtendProbationDto } from './dto/lifecycle.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../common/enums';

@ApiTags('Workforce Lifecycle & Compliance')
@Controller('lifecycle')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class LifecycleController {
  constructor(private readonly lifecycleService: LifecycleService) {}

  @Get('celebrations')
  @ApiOperation({ summary: 'Get corporate celebrations feed (Birthdays, Milestones, Anniversaries)' })
  async getCelebrations() {
    return this.lifecycleService.getCelebrationsFeed();
  }

  @Post('events/:id/congratulate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send 1-click peer congratulations on a work anniversary or birthday' })
  async congratulate(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.lifecycleService.congratulate(id, user);
  }

  @Get('reminders')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Dedicated HR Reminders Console (Probation, Contract, Document Expiry)' })
  async getReminders(@Query('urgency') urgency?: string) {
    return this.lifecycleService.getReminders(urgency);
  }

  @Post('reminders/:id/notify')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR_MANAGER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Dispatch urgent push notification reminder to employee and manager' })
  async notifyReminder(
    @Param('id') id: string,
    @CurrentUser() actor: any,
  ) {
    return this.lifecycleService.sendReminderNotification(id, actor);
  }

  @Post('reminders/:id/extend-probation')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR_MANAGER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Extend employee probation period with mandatory audit reason' })
  async extendProbation(
    @Param('id') id: string,
    @Body() dto: ExtendProbationDto,
    @CurrentUser() actor: any,
  ) {
    return this.lifecycleService.extendProbation(id, dto, actor);
  }

  @Post('reminders/:id/resolve')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR_MANAGER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark compliance/probation reminder as resolved' })
  async resolveReminder(@Param('id') id: string) {
    return this.lifecycleService.resolveReminder(id);
  }
}

