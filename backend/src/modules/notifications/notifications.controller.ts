import {
  Controller,
  Get,
  Patch,
  Post,
  Param,
  Body,
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
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user notifications feed with optional unread filter' })
  @ApiResponse({ status: 200, description: 'User notification list returned' })
  async getNotifications(
    @CurrentUser('id') userId: string,
    @Query('unreadOnly') unreadOnly?: string,
  ) {
    return this.notificationsService.findAllForUser(userId, unreadOnly === 'true');
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get count of unread notifications for badge display' })
  @ApiResponse({ status: 200, description: 'Count returned' })
  async getUnreadCount(@CurrentUser('id') userId: string) {
    return this.notificationsService.getUnreadCount(userId);
  }

  @Patch(':id/read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark specific notification as read' })
  @ApiResponse({ status: 200, description: 'Notification marked as read' })
  async markRead(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.notificationsService.markAsRead(id, userId);
  }

  @Patch('read-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark all user notifications as read' })
  @ApiResponse({ status: 200, description: 'All notifications marked as read' })
  async markAllRead(@CurrentUser('id') userId: string) {
    return this.notificationsService.markAllAsRead(userId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Send a notification to a specific user' })
  @ApiResponse({ status: 201, description: 'Notification created' })
  async createNotification(
    @Body()
    dto: {
      userId: string;
      title: string;
      message: string;
      type: 'INFO' | 'SUCCESS' | 'WARNING' | 'URGENT' | 'TICKET' | 'TASK' | 'SYSTEM';
      entityType?: 'TICKET' | 'TASK' | 'WORK_LOG' | 'SYSTEM';
      entityId?: string;
    },
  ) {
    return this.notificationsService.create(dto);
  }
}
