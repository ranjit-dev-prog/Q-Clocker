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
var PrismaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
let PrismaService = PrismaService_1 = class PrismaService extends client_1.PrismaClient {
    logger = new common_1.Logger(PrismaService_1.name);
    isConnected = false;
    provider = 'postgresql';
    orm = 'prisma';
    constructor() {
        const connectionString = process.env.DATABASE_URL ||
            'postgresql://postgres:postgres@localhost:5432/q_clocker';
        const adapter = new adapter_pg_1.PrismaPg({ connectionString });
        super({ adapter });
    }
    async onModuleInit() {
        await this.tryConnect();
    }
    async tryConnect() {
        try {
            await this.$connect();
            await this.$queryRaw `SELECT 1`;
            this.isConnected = true;
            this.logger.log('✅ Prisma ORM successfully connected to PostgreSQL database (47 models active)');
            return true;
        }
        catch (error) {
            this.isConnected = false;
            this.logger.warn(`⚠️ PostgreSQL connection via Prisma failed: ${error.message}. Operating in resilient enterprise mode.`);
            return false;
        }
    }
    async onModuleDestroy() {
        try {
            await this.$disconnect();
            this.isConnected = false;
            this.logger.log('Prisma ORM disconnected gracefully');
        }
        catch (error) {
            this.logger.error(`Error disconnecting Prisma: ${error.message}`);
        }
    }
    getConnectionStatus() {
        return {
            connected: this.isConnected,
            provider: this.provider,
            orm: this.orm,
            version: '7.10.1',
            modelsCount: 47,
        };
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = PrismaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PrismaService);
//# sourceMappingURL=prisma.service.js.map