"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const database_module_1 = require("./database/database.module");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const departments_module_1 = require("./modules/departments/departments.module");
const designations_module_1 = require("./modules/designations/designations.module");
const roles_module_1 = require("./modules/roles/roles.module");
const permissions_module_1 = require("./modules/permissions/permissions.module");
const tasks_module_1 = require("./modules/tasks/tasks.module");
const tickets_module_1 = require("./modules/tickets/tickets.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const work_logs_module_1 = require("./modules/work-logs/work-logs.module");
const reports_module_1 = require("./modules/reports/reports.module");
const payroll_module_1 = require("./modules/payroll/payroll.module");
const lifecycle_module_1 = require("./modules/lifecycle/lifecycle.module");
const health_module_1 = require("./modules/health/health.module");
const transform_interceptor_1 = require("./common/interceptors/transform.interceptor");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 120,
                },
            ]),
            database_module_1.DatabaseModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            departments_module_1.DepartmentsModule,
            designations_module_1.DesignationsModule,
            roles_module_1.RolesModule,
            permissions_module_1.PermissionsModule,
            tasks_module_1.TasksModule,
            tickets_module_1.TicketsModule,
            notifications_module_1.NotificationsModule,
            work_logs_module_1.WorkLogsModule,
            reports_module_1.ReportsModule,
            payroll_module_1.PayrollModule,
            lifecycle_module_1.LifecycleModule,
            health_module_1.HealthModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: transform_interceptor_1.TransformInterceptor,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map