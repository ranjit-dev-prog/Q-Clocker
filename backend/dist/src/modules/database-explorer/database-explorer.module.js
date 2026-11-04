"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseExplorerModule = void 0;
const common_1 = require("@nestjs/common");
const database_explorer_controller_1 = require("./database-explorer.controller");
const database_explorer_service_1 = require("./database-explorer.service");
const database_module_1 = require("../../database/database.module");
const users_module_1 = require("../users/users.module");
const departments_module_1 = require("../departments/departments.module");
const tasks_module_1 = require("../tasks/tasks.module");
const tickets_module_1 = require("../tickets/tickets.module");
const roles_module_1 = require("../roles/roles.module");
const permissions_module_1 = require("../permissions/permissions.module");
const work_logs_module_1 = require("../work-logs/work-logs.module");
const payroll_module_1 = require("../payroll/payroll.module");
const lifecycle_module_1 = require("../lifecycle/lifecycle.module");
let DatabaseExplorerModule = class DatabaseExplorerModule {
};
exports.DatabaseExplorerModule = DatabaseExplorerModule;
exports.DatabaseExplorerModule = DatabaseExplorerModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_module_1.DatabaseModule,
            users_module_1.UsersModule,
            departments_module_1.DepartmentsModule,
            tasks_module_1.TasksModule,
            tickets_module_1.TicketsModule,
            roles_module_1.RolesModule,
            permissions_module_1.PermissionsModule,
            work_logs_module_1.WorkLogsModule,
            payroll_module_1.PayrollModule,
            lifecycle_module_1.LifecycleModule,
        ],
        controllers: [database_explorer_controller_1.DatabaseExplorerController],
        providers: [database_explorer_service_1.DatabaseExplorerService],
        exports: [database_explorer_service_1.DatabaseExplorerService],
    })
], DatabaseExplorerModule);
//# sourceMappingURL=database-explorer.module.js.map