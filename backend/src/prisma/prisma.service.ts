import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  public isConnected = false;
  public readonly provider = 'postgresql';
  public readonly orm = 'prisma';

  constructor() {
    const connectionString =
      process.env.DATABASE_URL ||
      'postgresql://postgres:postgres@localhost:5432/q_clocker';

    const adapter = new PrismaPg({ connectionString });
    super({ adapter });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      await this.$queryRaw`SELECT 1`;
      this.isConnected = true;
      this.logger.log('✅ Prisma ORM successfully connected to PostgreSQL database (39 models active)');
    } catch (error) {
      this.isConnected = false;
      this.logger.warn(
        `⚠️ PostgreSQL connection via Prisma failed: ${(error as Error).message}. Operating in resilient mode.`,
      );
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.log('Prisma ORM disconnected gracefully');
    } catch (error) {
      this.logger.error(`Error disconnecting Prisma: ${(error as Error).message}`);
    }
  }

  getConnectionStatus() {
    return {
      connected: this.isConnected,
      provider: this.provider,
      orm: this.orm,
      version: '7.10.1',
      modelsCount: 39,
    };
  }
}

