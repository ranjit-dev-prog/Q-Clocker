import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { DatabaseService } from '../../database/database.service';

@ApiTags('System Health')
@Controller('health')
export class HealthController {
  constructor(private readonly dbService: DatabaseService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Liveness and readiness probe for container orchestrators' })
  @ApiResponse({ status: 200, description: 'Service is healthy and ready' })
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
}
