import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { PayrollService } from './payroll.service';
import { TaxDeclarationDto } from './dto/payroll.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../common/enums';

@ApiTags('Payroll & Compensation')
@Controller('payroll')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Get('template')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Download bulk payroll Excel (.xlsx) ingestion template' })
  async getTemplate(@Res() res: Response) {
    const buffer = await this.payrollService.generatePayrollTemplate();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="q_clocker_payroll_template.xlsx"');
    return res.end(buffer);
  }

  @Post('upload-batch')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR_MANAGER)
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Upload and process bulk payroll batch spreadsheet' })
  async uploadBatch(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() actor: any,
  ) {
    return this.payrollService.uploadBatch(file, actor);
  }

  @Get('batches')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'List historical payroll processing batches' })
  async getAllBatches() {
    return this.payrollService.getAllBatches();
  }

  @Get('my-payslips')
  @ApiOperation({ summary: 'List payslips for the authenticated employee' })
  async getMyPayslips(@CurrentUser() user: any) {
    return this.payrollService.getMyPayslips(user.id);
  }

  @Get('payslips/:id/download')
  @ApiOperation({ summary: 'Download cryptographically signed PDF payslip' })
  async downloadPayslipPdf(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Res() res: Response,
  ) {
    const buffer = await this.payrollService.generatePayslipPdf(id, user);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="payslip_${id}.pdf"`);
    return res.end(buffer);
  }

  @Get('tax-declaration')
  @ApiOperation({ summary: 'Get employee active tax-saving declarations' })
  async getTaxDeclaration(@CurrentUser() user: any) {
    return this.payrollService.getTaxDeclaration(user.id);
  }

  @Post('tax-declaration')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Submit employee annual tax-saving declarations' })
  async saveTaxDeclaration(
    @CurrentUser() user: any,
    @Body() dto: TaxDeclarationDto,
  ) {
    return this.payrollService.saveTaxDeclaration(user.id, dto);
  }
}

