import { Module } from '@nestjs/common';
import { HrmsController } from './hrms.controller';
import { HrmsService } from './hrms.service';
import { UsersModule } from '../users/users.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule, UsersModule, NotificationsModule],
  controllers: [HrmsController],
  providers: [HrmsService],
  exports: [HrmsService],
})
export class HrmsModule {}
