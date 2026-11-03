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
exports.HealthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const database_service_1 = require("../../database/database.service");
let HealthController = class HealthController {
    dbService;
    constructor(dbService) {
        this.dbService = dbService;
    }
    check() {
        const isDbConnected = this.dbService.getConnectionStatus();
        const memory = process.memoryUsage();
        return {
            status: 'ok',
            version: '1.0.0',
            timestamp: new Date().toISOString(),
            uptimeSeconds: Math.floor(process.uptime()),
            database: {
                status: isDbConnected ? 'connected' : 'in-memory-fallback',
                engine: 'PostgreSQL 16',
            },
            memory: {
                heapUsedMb: Math.round(memory.heapUsed / 1024 / 1024),
                rssMb: Math.round(memory.rss / 1024 / 1024),
            },
        };
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Liveness and readiness probe for container orchestrators' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Service is healthy and ready' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "check", null);
exports.HealthController = HealthController = __decorate([
    (0, swagger_1.ApiTags)('System Health'),
    (0, common_1.Controller)('health'),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], HealthController);
//# sourceMappingURL=health.controller.js.map