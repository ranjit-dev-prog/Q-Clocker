import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { TasksModule } from '../tasks/tasks.module';
import { TicketsModule } from '../tickets/tickets.module';
import { UsersModule } from '../users/users.module';
import { DepartmentsModule } from '../departments/departments.module';
import { WorkLogsModule } from '../work-logs/work-logs.module';

@Module({
  imports: [
    TasksModule,
    TicketsModule,
    UsersModule,
    DepartmentsModule,
    WorkLogsModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}

