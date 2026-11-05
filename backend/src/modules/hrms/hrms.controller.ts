import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Res,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { Response } from 'express';
import { HrmsService } from './hrms.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../common/enums';
import {
  CreateHrmsEmployeeDto,
  UpdateHrmsEmployeeDto,
  UpdateEmployeeStatusDto,
  HrmsEmployeeQueryDto,
} from './dto/hrms-employee.dto';
import {
  AttendancePunchDto,
  AttendanceCorrectionRequestDto,
  AttendanceCorrectionDecisionDto,
} from './dto/hrms-attendance.dto';
import {
  CreateLeaveRequestDto,
  LeaveRequestDecisionDto,
} from './dto/hrms-leave.dto';
import { ToggleOnboardingTaskDto } from './dto/hrms-onboarding.dto';
import {
  UploadDocumentDto,
  VerifyDocumentDto,
} from './dto/hrms-document.dto';
import {
  InitiateExitDto,
  UpdateExitClearanceDto,
} from './dto/hrms-exit.dto';
import { DecideApprovalDto } from './dto/hrms-approval.dto';

@ApiTags('HRMS Core')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('hrms')
export class HrmsController {
  constructor(private readonly hrmsService: HrmsService) {}

  // ========================================================
  // 1. DASHBOARD OVERVIEW & 12 TOP KPIS
  // ========================================================
  @Get('dashboard/summary')
  @ApiOperation({ summary: 'Get enterprise HR dashboard summary and 12 KPI metrics' })
  @ApiResponse({ status: 200, description: 'HR metrics summary returned successfully' })
  async getDashboardSummary() {
    return this.hrmsService.getDashboardSummary();
  }

  // ========================================================
  // 2. EMPLOYEE DIRECTORY & PROFILES
  // ========================================================
  @Get('employees')
  @ApiOperation({ summary: 'Search and filter employee directory' })
  async getEmployees(
    @Query() query: HrmsEmployeeQueryDto,
    @CurrentUser() user: any,
  ) {
    return this.hrmsService.getEmployees(query, user);
  }

  @Get('employees/export')
  @ApiOperation({ summary: 'Export employee directory to CSV/Excel' })
  async exportEmployees(
    @Query('format') format: string,
    @Res() res: Response,
  ) {
    const csvData = await this.hrmsService.exportEmployees(format);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="employees-export.csv"');
    return res.status(HttpStatus.OK).send(csvData);
  }

  @Get('employees/:id/profile')
  @ApiOperation({ summary: 'Get deep employee profile with career timeline and records' })
  async getEmployeeProfile(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.hrmsService.getEmployeeProfile(id, user);
  }

  @Post('employees')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.HR_ADMINISTRATOR)
  @ApiOperation({ summary: 'Create and onboard a new employee' })
  async createEmployee(
    @Body() dto: CreateHrmsEmployeeDto,
    @CurrentUser() user: any,
  ) {
    return this.hrmsService.createEmployee(dto, user);
  }

  @Put('employees/:id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.HR_ADMINISTRATOR)
  @ApiOperation({ summary: 'Update employee profile details' })
  async updateEmployee(
    @Param('id') id: string,
    @Body() dto: UpdateHrmsEmployeeDto,
    @CurrentUser() user: any,
  ) {
    return this.hrmsService.updateEmployee(id, dto, user);
  }

  @Patch('employees/:id/status')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Update employee status (ACTIVE, ON_LEAVE, NOTICE_PERIOD, TERMINATED)' })
  async updateEmployeeStatus(
    @Param('id') id: string,
    @Body() dto: UpdateEmployeeStatusDto,
    @CurrentUser() user: any,
  ) {
    return this.hrmsService.updateEmployeeStatus(id, dto, user);
  }

  @Delete('employees/:id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Archive/soft-delete an employee' })
  async archiveEmployee(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.hrmsService.archiveEmployee(id, user);
  }

  // ========================================================
  // 3. ATTENDANCE MANAGEMENT
  // ========================================================
  @Get('attendance/today')
  @ApiOperation({ summary: 'Get live attendance roster and today status' })
  async getAttendanceToday() {
    return this.hrmsService.getAttendanceToday();
  }

  @Get('attendance/matrix')
  @ApiOperation({ summary: 'Get monthly or weekly attendance matrix' })
  @ApiQuery({ name: 'period', required: false, enum: ['monthly', 'weekly'] })
  @ApiQuery({ name: 'month', required: false, description: 'YYYY-MM' })
  async getAttendanceMatrix(
    @Query('period') period?: string,
    @Query('month') month?: string,
  ) {
    return this.hrmsService.getAttendanceMatrix(period, month);
  }

  @Post('attendance/punch')
  @ApiOperation({ summary: 'Record employee attendance punch (IN / OUT)' })
  async punchAttendance(
    @Body() dto: AttendancePunchDto,
    @CurrentUser() user: any,
  ) {
    return this.hrmsService.punchAttendance(dto, user);
  }

  @Post('attendance/corrections')
  @ApiOperation({ summary: 'Submit an attendance correction request' })
  async requestAttendanceCorrection(
    @Body() dto: AttendanceCorrectionRequestDto,
    @CurrentUser() user: any,
  ) {
    return this.hrmsService.requestAttendanceCorrection(dto, user);
  }

  @Post('attendance/corrections/:id/decide')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.DEPARTMENT_MANAGER)
  @ApiOperation({ summary: 'Approve or reject attendance correction request' })
  async decideAttendanceCorrection(
    @Param('id') id: string,
    @Body() dto: AttendanceCorrectionDecisionDto,
    @CurrentUser() user: any,
  ) {
    return this.hrmsService.decideAttendanceCorrection(id, dto, user);
  }

  // ========================================================
  // 4. LEAVE MANAGEMENT
  // ========================================================
  @Get('leaves/types')
  @ApiOperation({ summary: 'List all company leave policy types' })
  async getLeaveTypes() {
    return this.hrmsService.getLeaveTypes();
  }

  @Get('leaves/balances')
  @ApiOperation({ summary: 'Get employee leave balances' })
  @ApiQuery({ name: 'employeeId', required: false })
  async getLeaveBalances(
    @Query('employeeId') employeeId?: string,
    @CurrentUser() user?: any,
  ) {
    return this.hrmsService.getLeaveBalances(employeeId, user);
  }

  @Get('leaves/requests')
  @ApiOperation({ summary: 'List leave applications' })
  @ApiQuery({ name: 'status', required: false })
  async getLeaveRequests(@Query('status') status?: string) {
    return this.hrmsService.getLeaveRequests(status);
  }

  @Post('leaves/requests')
  @ApiOperation({ summary: 'Apply for leave' })
  async applyLeave(
    @Body() dto: CreateLeaveRequestDto,
    @CurrentUser() user: any,
  ) {
    return this.hrmsService.applyLeave(dto, user);
  }

  @Post('leaves/requests/:id/decide')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.DEPARTMENT_MANAGER)
  @ApiOperation({ summary: 'Approve or reject leave request' })
  async decideLeave(
    @Param('id') id: string,
    @Body() dto: LeaveRequestDecisionDto,
    @CurrentUser() user: any,
  ) {
    return this.hrmsService.decideLeave(id, dto, user);
  }

  // ========================================================
  // 5. ONBOARDING HUB
  // ========================================================
  @Get('onboarding/dashboard')
  @ApiOperation({ summary: 'Get active onboarding candidate progress' })
  async getOnboardingDashboard() {
    return this.hrmsService.getOnboardingDashboard();
  }

  @Get('onboarding/checklists/:employeeId')
  @ApiOperation({ summary: 'Get onboarding checklist tasks for employee' })
  async getOnboardingChecklist(@Param('employeeId') employeeId: string) {
    return this.hrmsService.getOnboardingChecklist(employeeId);
  }

  @Patch('onboarding/checklists/:id/toggle')
  @ApiOperation({ summary: 'Toggle onboarding task completion' })
  async toggleOnboardingTask(
    @Param('id') id: string,
    @Body() dto: ToggleOnboardingTaskDto,
    @CurrentUser() user: any,
  ) {
    return this.hrmsService.toggleOnboardingTask(id, dto, user);
  }

  // ========================================================
  // 6. EMPLOYEE DOCUMENTS
  // ========================================================
  @Get('documents')
  @ApiOperation({ summary: 'List employee documents with verification statuses' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'employeeId', required: false })
  async getDocuments(
    @Query('category') category?: string,
    @Query('employeeId') employeeId?: string,
  ) {
    return this.hrmsService.getDocuments(category, employeeId);
  }

  @Post('documents')
  @ApiOperation({ summary: 'Upload/register an employee document' })
  async uploadDocument(
    @Body() dto: UploadDocumentDto,
    @CurrentUser() user: any,
  ) {
    return this.hrmsService.uploadDocument(dto, user);
  }

  @Patch('documents/:id/verify')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.HR_ADMINISTRATOR)
  @ApiOperation({ summary: 'Verify or reject uploaded document' })
  async verifyDocument(
    @Param('id') id: string,
    @Body() dto: VerifyDocumentDto,
    @CurrentUser() user: any,
  ) {
    return this.hrmsService.verifyDocument(id, dto, user);
  }

  // ========================================================
  // 7. OFFBOARDING & EXIT MANAGEMENT
  // ========================================================
  @Get('exit/dashboard')
  @ApiOperation({ summary: 'Get exit pipeline and clearance status' })
  async getExitDashboard() {
    return this.hrmsService.getExitDashboard();
  }

  @Post('exit/initiate')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Initiate employee resignation/exit workflow' })
  async initiateExit(
    @Body() dto: InitiateExitDto,
    @CurrentUser() user: any,
  ) {
    return this.hrmsService.initiateExit(dto, user);
  }

  @Patch('exit/:id/clearance')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.IT_MANAGER)
  @ApiOperation({ summary: 'Update exit clearance checklist' })
  async updateExitClearance(
    @Param('id') id: string,
    @Body() dto: UpdateExitClearanceDto,
    @CurrentUser() user: any,
  ) {
    return this.hrmsService.updateExitClearance(id, dto, user);
  }

  // ========================================================
  // 8. UNIFIED APPROVAL CENTER
  // ========================================================
  @Get('approvals')
  @ApiOperation({ summary: 'Get consolidated pending approval requests' })
  @ApiQuery({ name: 'type', required: false, description: 'LEAVE, ATTENDANCE, EXPENSE' })
  async getApprovalsQueue(@Query('type') type?: string) {
    return this.hrmsService.getApprovalsQueue(type);
  }

  @Post('approvals/:id/decide')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.DEPARTMENT_MANAGER)
  @ApiOperation({ summary: 'Approve or reject a request with audit log' })
  async decideApproval(
    @Param('id') id: string,
    @Query('type') type: string,
    @Body() dto: DecideApprovalDto,
    @CurrentUser() user: any,
  ) {
    return this.hrmsService.decideApproval(id, type || 'LEAVE', dto, user);
  }

  // ========================================================
  // 9. HR CALENDAR
  // ========================================================
  @Get('calendar/events')
  @ApiOperation({ summary: 'Get consolidated HR calendar events' })
  @ApiQuery({ name: 'year', required: false })
  @ApiQuery({ name: 'month', required: false })
  async getCalendarEvents(
    @Query('year') year?: number,
    @Query('month') month?: number,
  ) {
    return this.hrmsService.getCalendarEvents(year ? Number(year) : undefined, month ? Number(month) : undefined);
  }

  // ========================================================
  // 10. HR REPORTS & ANALYTICS
  // ========================================================
  @Get('reports/analytics')
  @ApiOperation({ summary: 'Get organization analytics and turnover statistics' })
  async getAnalytics(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.hrmsService.getAnalytics(startDate, endDate);
  }

  @Get('reports/export-pdf')
  @ApiOperation({ summary: 'Download executive HR summary report PDF' })
  async exportReportPdf(@Res() res: Response) {
    const pdfBuffer = await this.hrmsService.exportReportPdf();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="q-clocker-hrms-report.pdf"');
    return res.status(HttpStatus.OK).send(pdfBuffer);
  }
}
