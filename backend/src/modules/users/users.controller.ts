import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Header,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { ImportEmployeeRow } from './dto/import-employee.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../common/enums';

@ApiTags('Employees')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('admin-dashboard')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Enterprise Admin Dashboard Metrics (Employee, Role, Department distributions)' })
  @ApiResponse({ status: 200, description: 'Aggregated workforce metrics' })
  async getAdminDashboardMetrics() {
    return this.usersService.getAdminDashboardMetrics();
  }

  @Get('import/template')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR_MANAGER)
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="employee_import_template.csv"')
  @ApiOperation({ summary: 'Download employee bulk import CSV template' })
  getImportTemplate() {
    return this.usersService.getImportTemplate();
  }

  @Post('import/preview')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR_MANAGER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Preview and validate CSV employee import with formula injection sanitization' })
  previewImport(
    @Body() body: { csvContent: string },
    @CurrentUser() actor: any,
  ) {
    return this.usersService.previewImport(body.csvContent, actor);
  }

  @Post('import/confirm')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR_MANAGER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Execute batch employee import' })
  confirmImport(
    @Body() body: { rows: ImportEmployeeRow[] },
    @CurrentUser() actor: any,
  ) {
    return this.usersService.confirmImport(body.rows, actor);
  }

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR_MANAGER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new employee account (Super Admin / Admin / HR Manager)' })
  @ApiResponse({ status: 201, description: 'Employee created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden: Insufficient privileges' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async create(
    @Body() createUserDto: CreateUserDto,
    @CurrentUser() actor: any,
  ) {
    return this.usersService.create(createUserDto, actor);
  }

  @Get()
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.SYSTEM_ADMINISTRATOR,
    UserRole.HR_MANAGER,
    UserRole.HR_ADMINISTRATOR,
    UserRole.HR_EXECUTIVE,
    UserRole.IT_MANAGER,
    UserRole.IT_EXECUTIVE,
    UserRole.DEPARTMENT_MANAGER,
    UserRole.TEAM_LEAD,
    UserRole.EMPLOYEE,
    UserRole.AUDITOR,
    UserRole.READ_ONLY,
    UserRole.VIEWER,
  )
  @ApiOperation({ summary: 'List employees with optional filters (Search, Role, Department, Active)' })
  @ApiResponse({ status: 200, description: 'List of employees returned' })
  async findAll(@Query() query: UserQueryDto) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get employee details by UUID' })
  @ApiResponse({ status: 200, description: 'Employee profile returned' })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Update employee account details (Super Admin / Admin / HR Manager)' })
  @ApiResponse({ status: 200, description: 'Employee updated successfully' })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Post(':id/archive')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR_MANAGER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Safely archive an employee without destroying audit or timesheet history' })
  async archive(
    @Param('id') id: string,
    @CurrentUser() actor: any,
  ) {
    return this.usersService.archive(id, actor);
  }

  @Post(':id/reactivate')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR_MANAGER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reactivate an archived employee account' })
  async reactivate(@Param('id') id: string) {
    return this.usersService.reactivate(id);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft-delete employee (Super Admin only)' })
  @ApiResponse({ status: 200, description: 'Employee deactivated and archived' })
  @ApiResponse({ status: 403, description: 'Forbidden: Super Admin only' })
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Get(':id/subordinates')
  @ApiOperation({ summary: 'Get team members/subordinates managed by this employee' })
  @ApiResponse({ status: 200, description: 'List of subordinates' })
  async findSubordinates(@Param('id') id: string) {
    return this.usersService.findSubordinates(id);
  }
}
