import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { DesignationsModule } from './modules/designations/designations.module';
import { RolesModule } from './modules/roles/roles.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { TicketsModule } from './modules/tickets/tickets.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { WorkLogsModule } from './modules/work-logs/work-logs.module';
import { ReportsModule } from './modules/reports/reports.module';
import { PayrollModule } from './modules/payroll/payroll.module';
import { LifecycleModule } from './modules/lifecycle/lifecycle.module';
import { HealthModule } from './modules/health/health.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { PerformanceModule } from './modules/performance/performance.module';
import { DatabaseExplorerModule } from './modules/database-explorer/database-explorer.module';
import { HrmsModule } from './modules/hrms/hrms.module';
import { RolesGuard } from './common/guards/roles.guard';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 120,
      },
    ]),
    PrismaModule,
    AuthModule,
    UsersModule,
    DepartmentsModule,
    DesignationsModule,
    RolesModule,
    PermissionsModule,
    TasksModule,
    TicketsModule,
    NotificationsModule,
    WorkLogsModule,
    ReportsModule,
    PayrollModule,
    LifecycleModule,
    HealthModule,
    DashboardModule,
    PerformanceModule,
    DatabaseExplorerModule,
    HrmsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
