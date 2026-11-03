import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { WorkLogsService } from './work-logs.service';
import { CreateWorkLogDto } from './dto/create-work-log.dto';
import { WorkLogQueryDto } from './dto/work-log-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Daily Work Logs')
@Controller('work-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class WorkLogsController {
  constructor(private readonly workLogsService: WorkLogsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create daily activity work log with random WLG reference' })
  @ApiResponse({ status: 201, description: 'Work log recorded' })
  async create(@Body() createWorkLogDto: CreateWorkLogDto, @CurrentUser() user: any) {
    return this.workLogsService.create(createWorkLogDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'List employee work logs with optional date or task filters' })
  @ApiResponse({ status: 200, description: 'Returns work logs' })
  async findAll(@Query() query: WorkLogQueryDto, @CurrentUser() user: any) {
    return this.workLogsService.findAll(query, user);
  }

  @Get('daily-summary')
  @ApiOperation({ summary: 'Get aggregated hours and employee activity for a given date' })
  @ApiResponse({ status: 200, description: 'Daily summary' })
  async getDailySummary(@Query('date') date: string, @CurrentUser() user: any) {
    const targetDate = date || new Date().toISOString().substring(0, 10);
    return this.workLogsService.getDailySummary(targetDate, user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get work log details' })
  @ApiResponse({ status: 200, description: 'Work log details' })
  @ApiResponse({ status: 404, description: 'Work log not found' })
  async findOne(@Param('id') id: string) {
    return this.workLogsService.findById(id);
  }
}
