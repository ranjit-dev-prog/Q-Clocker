import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DesignationsService } from './designations.service';
import { CreateDesignationDto } from './dto/create-designation.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums';

@ApiTags('Designations')
@Controller('designations')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class DesignationsController {
  constructor(private readonly designationsService: DesignationsService) {}

  @Get()
  @ApiOperation({ summary: 'List all company designations and job profiles' })
  @ApiResponse({ status: 200, description: 'List of designations' })
  async findAll() {
    return this.designationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get designation details by UUID' })
  @ApiResponse({ status: 200, description: 'Designation details' })
  async findOne(@Param('id') id: string) {
    return this.designationsService.findOne(id);
  }

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR_MANAGER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new corporate designation' })
  @ApiResponse({ status: 201, description: 'Designation created successfully' })
  async create(@Body() dto: CreateDesignationDto) {
    return this.designationsService.create(dto);
  }
}
