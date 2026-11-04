import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { DatabaseExplorerService } from './database-explorer.service';

@ApiTags('Database Explorer (Drizzle ORM Studio)')
@Controller('database')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DatabaseExplorerController {
  constructor(private readonly explorerService: DatabaseExplorerService) {}

  @Get('tables')
  @ApiOperation({ summary: 'List all 39 Drizzle ORM relational tables with schemas, categories, and row counts' })
  async getTables() {
    return this.explorerService.getTables();
  }

  @Get('tables/:tableName/schema')
  @ApiOperation({ summary: 'Get column definitions, data types, and primary key constraints for a Drizzle table' })
  async getTableSchema(@Param('tableName') tableName: string) {
    return this.explorerService.getTableSchema(tableName);
  }

  @Get('tables/:tableName/data')
  @ApiOperation({ summary: 'Fetch live database records from Drizzle ORM table with pagination and search' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  async getTableData(
    @Param('tableName') tableName: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    return this.explorerService.getTableData(
      tableName,
      page ? Number(page) : 1,
      limit ? Number(limit) : 20,
      search,
    );
  }
}

