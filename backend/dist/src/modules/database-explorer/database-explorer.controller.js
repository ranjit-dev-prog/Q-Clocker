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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseExplorerController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const database_explorer_service_1 = require("./database-explorer.service");
let DatabaseExplorerController = class DatabaseExplorerController {
    explorerService;
    constructor(explorerService) {
        this.explorerService = explorerService;
    }
    async getTables() {
        return this.explorerService.getTables();
    }
    async getTableSchema(tableName) {
        return this.explorerService.getTableSchema(tableName);
    }
    async getTableData(tableName, page, limit, search) {
        return this.explorerService.getTableData(tableName, page ? Number(page) : 1, limit ? Number(limit) : 20, search);
    }
};
exports.DatabaseExplorerController = DatabaseExplorerController;
__decorate([
    (0, common_1.Get)('tables'),
    (0, swagger_1.ApiOperation)({ summary: 'List all 39 Prisma ORM relational tables with schemas, categories, and row counts' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DatabaseExplorerController.prototype, "getTables", null);
__decorate([
    (0, common_1.Get)('tables/:tableName/schema'),
    (0, swagger_1.ApiOperation)({ summary: 'Get column definitions, data types, and primary key constraints for a Prisma table' }),
    __param(0, (0, common_1.Param)('tableName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DatabaseExplorerController.prototype, "getTableSchema", null);
__decorate([
    (0, common_1.Get)('tables/:tableName/data'),
    (0, swagger_1.ApiOperation)({ summary: 'Fetch live database records from Prisma ORM table with pagination and search' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, type: String }),
    __param(0, (0, common_1.Param)('tableName')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, String]),
    __metadata("design:returntype", Promise)
], DatabaseExplorerController.prototype, "getTableData", null);
exports.DatabaseExplorerController = DatabaseExplorerController = __decorate([
    (0, swagger_1.ApiTags)('Database Explorer (Prisma ORM Studio)'),
    (0, common_1.Controller)('database'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [database_explorer_service_1.DatabaseExplorerService])
], DatabaseExplorerController);
//# sourceMappingURL=database-explorer.controller.js.map