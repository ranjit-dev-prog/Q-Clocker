import { Module } from '@nestjs/common';
import { DatabaseExplorerController } from './database-explorer.controller';
import { DatabaseExplorerService } from './database-explorer.service';
import { DatabaseModule } from '../../database/database.module';
import { UsersModule } from '../users/users.module';
import { DepartmentsModule } from '../departments/departments.module';
import { TasksModule } from '../tasks/tasks.module';
import { TicketsModule } from '../tickets/tickets.module';
import { RolesModule } from '../roles/roles.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { WorkLogsModule } from '../work-logs/work-logs.module';
import { PayrollModule } from '../payroll/payroll.module';
import { LifecycleModule } from '../lifecycle/lifecycle.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    DepartmentsModule,
    TasksModule,
    TicketsModule,
    RolesModule,
    PermissionsModule,
    WorkLogsModule,
    PayrollModule,
    LifecycleModule,
  ],
  controllers: [DatabaseExplorerController],
  providers: [DatabaseExplorerService],
  exports: [DatabaseExplorerService],
})
export class DatabaseExplorerModule {}
