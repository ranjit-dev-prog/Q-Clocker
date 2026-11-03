"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../../database/database.service");
const schema = require("../../database/schema");
let RolesService = class RolesService {
    dbService;
    constructor(dbService) {
        this.dbService = dbService;
    }
    async findAll() {
        if (this.dbService.getConnectionStatus()) {
            return this.dbService.db.select().from(schema.roles);
        }
        return [
            {
                id: '00000000-0000-0000-0000-000000000010',
                code: 'SUPER_ADMIN',
                name: 'Super Administrator',
                description: 'Complete organizational control across all departments and configuration',
                isSystem: true,
            },
            {
                id: '00000000-0000-0000-0000-000000000020',
                code: 'ADMIN',
                name: 'IT Manager / Department Admin',
                description: 'Departmental management, ticket dispatch, task review and approvals',
                isSystem: true,
            },
            {
                id: '00000000-0000-0000-0000-000000000030',
                code: 'TEAM_LEAD',
                name: 'Team Lead',
                description: 'Task assignment to squad members, sprint monitoring, and daily review',
                isSystem: true,
            },
            {
                id: '00000000-0000-0000-0000-000000000040',
                code: 'EMPLOYEE',
                name: 'Employee',
                description: 'Task execution, timesheet logging, ticketing and performance review',
                isSystem: true,
            },
        ];
    }
};
exports.RolesService = RolesService;
exports.RolesService = RolesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], RolesService);
//# sourceMappingURL=roles.service.js.map