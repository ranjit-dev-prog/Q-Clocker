import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { CreateTeamDto } from './dto/create-team.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums';

@ApiTags('Departments & Teams')
@Controller('departments')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new organizational department (Super Admin only)' })
  @ApiResponse({ status: 201, description: 'Department created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden: Super Admin only' })
  async create(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.departmentsService.create(createDepartmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all departments and aggregate telemetry' })
  @ApiResponse({ status: 200, description: 'List of departments' })
  async findAll() {
    return this.departmentsService.findAll();
  }

  @Get('org-chart')
  @ApiOperation({ summary: 'Get full organizational hierarchy chart' })
  @ApiResponse({ status: 200, description: 'Organization chart' })
  async getOrgChart() {
    return this.departmentsService.getOrgChart();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get department details by ID' })
  @ApiResponse({ status: 200, description: 'Department details' })
  async findOne(@Param('id') id: string) {
    return this.departmentsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update department details or manager (Super Admin / Admin)' })
  @ApiResponse({ status: 200, description: 'Department updated successfully' })
  async update(
    @Param('id') id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ) {
    return this.departmentsService.update(id, updateDepartmentDto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Deactivate department (Super Admin only)' })
  @ApiResponse({ status: 200, description: 'Department deactivated' })
  async remove(@Param('id') id: string) {
    return this.departmentsService.remove(id);
  }

  @Post(':id/teams')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create team within department (Super Admin / Admin)' })
  @ApiResponse({ status: 201, description: 'Team created successfully' })
  async createTeam(
    @Param('id') departmentId: string,
    @Body() createTeamDto: CreateTeamDto,
  ) {
    return this.departmentsService.createTeam(departmentId, createTeamDto);
  }

  @Get(':id/teams')
  @ApiOperation({ summary: 'List teams within department' })
  @ApiResponse({ status: 200, description: 'List of teams' })
  async findTeams(@Param('id') departmentId: string) {
    return this.departmentsService.findTeams(departmentId);
  }
}
