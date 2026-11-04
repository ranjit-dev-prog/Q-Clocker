import {
  Controller,
  Get,
  Query,
  UseGuards,
  Res,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Response } from 'express';
import { ReportsService } from './reports.service';
import { ReportQueryDto } from './dto/report-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums';

@ApiTags('Reports & Analytics')
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('itsm')
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.SYSTEM_ADMINISTRATOR,
    UserRole.IT_MANAGER,
    UserRole.HR_MANAGER,
    UserRole.AUDITOR,
  )
  @ApiOperation({ summary: 'ITSM Service Desk Performance & SLA Analytics' })
  @ApiResponse({ status: 200, description: 'ITSM metrics retrieved' })
  async getItsmReport(@Query() query: ReportQueryDto) {
    return this.reportsService.getItsmReport(query);
  }

  @Get('workforce')
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.SYSTEM_ADMINISTRATOR,
    UserRole.IT_MANAGER,
    UserRole.HR_MANAGER,
    UserRole.AUDITOR,
  )
  @ApiOperation({ summary: 'Workforce Timesheet, Utilization & Productivity Analytics' })
  @ApiResponse({ status: 200, description: 'Workforce utilization retrieved' })
  async getWorkforceReport(@Query() query: ReportQueryDto) {
    return this.reportsService.getWorkforceReport(query);
  }

  @Get('audit')
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.SYSTEM_ADMINISTRATOR,
    UserRole.AUDITOR,
  )
  @ApiOperation({ summary: 'Security Audit & Compliance Trail Report' })
  @ApiResponse({ status: 200, description: 'Security audit logs retrieved' })
  async getAuditReport(@Query() query: ReportQueryDto) {
    return this.reportsService.getAuditReport(query);
  }

  @Get('export')
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.SYSTEM_ADMINISTRATOR,
    UserRole.IT_MANAGER,
    UserRole.HR_MANAGER,
    UserRole.AUDITOR,
  )
  @ApiOperation({ summary: 'Export structured reports to Microsoft Excel (.xlsx) or CSV' })
  async exportReport(
    @Query() query: ReportQueryDto,
    @Res() res: Response,
  ) {
    const reportType = query.reportType || 'itsm';
    const format = query.format === 'csv' ? 'csv' : 'xlsx';

    const buffer = await this.reportsService.exportReport(reportType, format, query);

    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="q_clocker_${reportType}_report.csv"`,
      );
    } else {
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="q_clocker_${reportType}_report.xlsx"`,
      );
    }

    return res.end(buffer);
  }
}
