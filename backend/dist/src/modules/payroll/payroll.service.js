"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PayrollService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollService = void 0;
const common_1 = require("@nestjs/common");
const ExcelJS = require("exceljs");
const PDFDocument = require('pdfkit');
const crypto = require("crypto");
const prisma_service_1 = require("../../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
const users_service_1 = require("../users/users.service");
let PayrollService = PayrollService_1 = class PayrollService {
    prisma;
    usersService;
    notificationsService;
    logger = new common_1.Logger(PayrollService_1.name);
    memoryBatches = [
        {
            id: '80000000-0000-0000-0000-000000000001',
            batchNumber: 'PAY-2026-10-BATCH01',
            month: 10,
            year: 2026,
            totalDisbursed: 284500.0,
            employeeCount: 42,
            status: 'DISBURSED',
            processedByName: 'Alexander Vance',
            createdAt: new Date('2026-10-31T18:00:00Z').toISOString(),
        },
    ];
    memoryPayslips = [
        {
            id: '85000000-0000-0000-0000-000000000001',
            referenceId: 'PSL-2026-10-0001',
            batchId: '80000000-0000-0000-0000-000000000001',
            employeeId: '00000000-0000-0000-0000-000000000001',
            employeeName: 'Alexander Vance',
            employeeCode: 'EMP001',
            departmentName: 'Executive',
            jobTitle: 'Chief Executive Officer',
            month: 10,
            year: 2026,
            basicPay: 12000.0,
            hra: 4800.0,
            allowances: 3200.0,
            overtimePay: 0.0,
            grossEarnings: 20000.0,
            taxDeduction: 4200.0,
            pfDeduction: 1200.0,
            insurance: 400.0,
            unpaidLeaveDeductions: 0.0,
            totalDeductions: 5800.0,
            netSalary: 14200.0,
            isEncrypted: true,
            status: 'DISPATCHED',
            createdAt: new Date('2026-10-31T18:00:00Z').toISOString(),
        },
        {
            id: '85000000-0000-0000-0000-000000000002',
            referenceId: 'PSL-2026-10-0002',
            batchId: '80000000-0000-0000-0000-000000000001',
            employeeId: '00000000-0000-0000-0000-000000000004',
            employeeName: 'Marcus Chen',
            employeeCode: 'EMP004',
            departmentName: 'Information Technology',
            jobTitle: 'IT Infrastructure & Operations Manager',
            month: 10,
            year: 2026,
            basicPay: 7000.0,
            hra: 2800.0,
            allowances: 1500.0,
            overtimePay: 500.0,
            grossEarnings: 11800.0,
            taxDeduction: 2100.0,
            pfDeduction: 840.0,
            insurance: 300.0,
            unpaidLeaveDeductions: 0.0,
            totalDeductions: 3240.0,
            netSalary: 8560.0,
            isEncrypted: true,
            status: 'DISPATCHED',
            createdAt: new Date('2026-10-31T18:00:00Z').toISOString(),
        },
        {
            id: '85000000-0000-0000-0000-000000000003',
            referenceId: 'PSL-2026-10-0003',
            batchId: '80000000-0000-0000-0000-000000000001',
            employeeId: '00000000-0000-0000-0000-000000000007',
            employeeName: 'David Ross',
            employeeCode: 'EMP007',
            departmentName: 'Software Engineering',
            jobTitle: 'Full-Stack Software Engineer',
            month: 10,
            year: 2026,
            basicPay: 5500.0,
            hra: 2200.0,
            allowances: 1000.0,
            overtimePay: 650.0,
            grossEarnings: 9350.0,
            taxDeduction: 1450.0,
            pfDeduction: 660.0,
            insurance: 250.0,
            unpaidLeaveDeductions: 0.0,
            totalDeductions: 2360.0,
            netSalary: 6990.0,
            isEncrypted: true,
            status: 'DISPATCHED',
            createdAt: new Date('2026-10-31T18:00:00Z').toISOString(),
        },
    ];
    memoryDeclarations = new Map();
    constructor(prisma, usersService, notificationsService) {
        this.prisma = prisma;
        this.usersService = usersService;
        this.notificationsService = notificationsService;
    }
    async generatePayrollTemplate() {
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'Q Clocker Enterprise Payroll Engine';
        workbook.created = new Date();
        const sheet = workbook.addWorksheet('Payroll_Disbursement', {
            views: [{ state: 'frozen', ySplit: 1 }],
        });
        sheet.columns = [
            { header: 'EmployeeCode', key: 'employeeCode', width: 16 },
            { header: 'CorporateEmail', key: 'email', width: 28 },
            { header: 'Month', key: 'month', width: 10 },
            { header: 'Year', key: 'year', width: 10 },
            { header: 'BasicPay', key: 'basicPay', width: 16 },
            { header: 'HRA', key: 'hra', width: 14 },
            { header: 'Allowances', key: 'allowances', width: 14 },
            { header: 'OvertimePay', key: 'overtimePay', width: 14 },
            { header: 'TaxDeduction', key: 'taxDeduction', width: 16 },
            { header: 'ProvidentFund', key: 'pfDeduction', width: 16 },
            { header: 'Insurance', key: 'insurance', width: 14 },
            { header: 'UnpaidLeaveDeductions', key: 'unpaidLeave', width: 20 },
            { header: 'NetSalary', key: 'netSalary', width: 16 },
        ];
        const header = sheet.getRow(1);
        header.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        header.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF1E1B4B' },
        };
        header.alignment = { vertical: 'middle', horizontal: 'center' };
        header.height = 26;
        sheet.addRow({
            employeeCode: 'EMP004',
            email: 'itmanager@qclocker.io',
            month: 11,
            year: 2026,
            basicPay: 7000.0,
            hra: 2800.0,
            allowances: 1500.0,
            overtimePay: 500.0,
            taxDeduction: 2100.0,
            pfDeduction: 840.0,
            insurance: 300.0,
            unpaidLeave: 0.0,
            netSalary: 8560.0,
        });
        const buffer = await workbook.xlsx.writeBuffer();
        return Buffer.from(buffer);
    }
    async uploadBatch(file, actorUser) {
        if (!file || !file.buffer) {
            throw new common_1.BadRequestException('Payroll batch spreadsheet buffer is required');
        }
        const rowsData = [];
        const isCsv = file.mimetype === 'text/csv' || (file.originalname && file.originalname.endsWith('.csv'));
        if (isCsv) {
            const content = file.buffer.toString('utf-8');
            const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);
            if (lines.length <= 1)
                throw new common_1.BadRequestException('CSV file must have headers and rows');
            const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
                const row = {};
                headers.forEach((h, idx) => (row[h] = values[idx] || ''));
                rowsData.push({ rowNumber: i + 1, data: row });
            }
        }
        else {
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(file.buffer);
            const sheet = workbook.getWorksheet(1) || workbook.worksheets[0];
            if (!sheet || sheet.rowCount < 2)
                throw new common_1.BadRequestException('Workbook must contain rows');
            const headers = [];
            sheet.getRow(1).eachCell((cell, colNum) => {
                headers[colNum] = String(cell.value || '').trim();
            });
            sheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1)
                    return;
                const rowData = {};
                row.eachCell((cell, colNum) => {
                    const h = headers[colNum];
                    if (h) {
                        let val = cell.value;
                        if (val && typeof val === 'object' && 'text' in val)
                            val = val.text;
                        rowData[h] = val;
                    }
                });
                if (Object.keys(rowData).length > 0)
                    rowsData.push({ rowNumber, data: rowData });
            });
        }
        const allEmployees = await this.usersService.findAll({});
        const batchId = crypto.randomUUID();
        const batchNumber = `PAY-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
        let totalDisbursed = 0;
        const insertedPayslips = [];
        const errors = [];
        const warnings = [];
        for (const item of rowsData) {
            const d = item.data;
            const rowNum = item.rowNumber;
            const getVal = (...keys) => {
                for (const k of keys) {
                    for (const actual of Object.keys(d)) {
                        if (actual.toLowerCase() === k.toLowerCase())
                            return d[actual];
                    }
                }
                return '';
            };
            const codeOrEmail = getVal('employeeCode', 'employee_code', 'email', 'corporateEmail');
            const month = Number(getVal('month') || new Date().getMonth() + 1);
            const year = Number(getVal('year') || new Date().getFullYear());
            const basicPay = Number(getVal('basicPay', 'basic_pay') || 0);
            const hra = Number(getVal('hra') || 0);
            const allowances = Number(getVal('allowances') || 0);
            const overtimePay = Number(getVal('overtimePay', 'overtime_pay') || 0);
            const taxDeduction = Number(getVal('taxDeduction', 'tax_deduction') || 0);
            const pfDeduction = Number(getVal('pfDeduction', 'providentFund', 'pf') || 0);
            const insurance = Number(getVal('insurance') || 0);
            const unpaidLeave = Number(getVal('unpaidLeaveDeductions', 'unpaidLeave') || 0);
            const targetEmp = allEmployees.find((e) => (e.employeeCode && e.employeeCode.toLowerCase() === String(codeOrEmail).toLowerCase()) ||
                e.email.toLowerCase() === String(codeOrEmail).toLowerCase());
            if (!targetEmp) {
                errors.push({
                    rowNumber: rowNum,
                    identifier: codeOrEmail,
                    error: `Employee not found in organization directory for "${codeOrEmail}"`,
                });
                continue;
            }
            const grossEarnings = basicPay + hra + allowances + overtimePay;
            const totalDeductions = taxDeduction + pfDeduction + insurance + unpaidLeave;
            const calculatedNet = grossEarnings - totalDeductions;
            const declaredNet = Number(getVal('netSalary', 'net_salary') || calculatedNet);
            if (Math.abs(calculatedNet - declaredNet) > 0.05) {
                warnings.push({
                    rowNumber: rowNum,
                    employee: `${targetEmp.firstName} ${targetEmp.lastName}`,
                    warning: `Discrepancy: Calculated Net ($${calculatedNet.toFixed(2)}) differs from declared Net ($${declaredNet.toFixed(2)}). Calculated Net applied.`,
                });
            }
            if (calculatedNet <= 0) {
                errors.push({
                    rowNumber: rowNum,
                    identifier: codeOrEmail,
                    error: `Negative or zero net pay ($${calculatedNet.toFixed(2)}). Deductions exceed earnings.`,
                });
                continue;
            }
            const payslip = {
                id: crypto.randomUUID(),
                referenceId: `PSL-${year}-${String(month).padStart(2, '0')}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
                batchId,
                employeeId: targetEmp.id,
                employeeName: `${targetEmp.firstName} ${targetEmp.lastName}`,
                employeeCode: targetEmp.employeeCode || 'EMP-GEN',
                departmentName: targetEmp.departmentName || 'General',
                jobTitle: targetEmp.jobTitle || 'Team Member',
                month,
                year,
                basicPay,
                hra,
                allowances,
                overtimePay,
                grossEarnings,
                taxDeduction,
                pfDeduction,
                insurance,
                unpaidLeaveDeductions: unpaidLeave,
                totalDeductions,
                netSalary: calculatedNet,
                isEncrypted: true,
                status: 'DISPATCHED',
                createdAt: new Date().toISOString(),
            };
            totalDisbursed += calculatedNet;
            insertedPayslips.push(payslip);
            this.memoryPayslips.unshift(payslip);
            if (this.notificationsService) {
                this.notificationsService.createNotification({
                    userId: targetEmp.id,
                    title: `Payslip Disbursed: ${month}/${year}`,
                    message: `Your corporate payslip for ${month}/${year} is ready. Net Disbursed: $${calculatedNet.toLocaleString('en-US', { minimumFractionDigits: 2 })}.`,
                    type: 'SUCCESS',
                    entityType: 'SYSTEM',
                    link: '/my-finances',
                });
            }
        }
        const batch = {
            id: batchId,
            batchNumber,
            month: rowsData[0]?.data?.month || new Date().getMonth() + 1,
            year: rowsData[0]?.data?.year || new Date().getFullYear(),
            totalDisbursed,
            employeeCount: insertedPayslips.length,
            status: 'DISBURSED',
            processedByName: `${actorUser.firstName || ''} ${actorUser.lastName || ''}`.trim() || 'HR Admin',
            createdAt: new Date().toISOString(),
        };
        this.memoryBatches.unshift(batch);
        return {
            success: true,
            batch,
            summary: {
                totalRows: rowsData.length,
                validDisbursed: insertedPayslips.length,
                totalDisbursed,
                errorsCount: errors.length,
                warningsCount: warnings.length,
            },
            errors,
            warnings,
            insertedPayslips,
        };
    }
    async getMyPayslips(userId) {
        const list = this.memoryPayslips.filter((p) => p.employeeId === userId);
        return list.sort((a, b) => b.year - a.year || b.month - a.month);
    }
    async getAllBatches() {
        return this.memoryBatches;
    }
    async generatePayslipPdf(payslipId, user) {
        const payslip = this.memoryPayslips.find((p) => p.id === payslipId);
        if (!payslip) {
            throw new common_1.NotFoundException(`Payslip with ID ${payslipId} not found`);
        }
        if (user.role === 'EMPLOYEE' && payslip.employeeId !== user.id) {
            throw new common_1.BadRequestException('Unauthorized access to employee payslip');
        }
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({ margin: 40, size: 'A4' });
            const buffers = [];
            doc.on('data', (c) => buffers.push(c));
            doc.on('end', () => resolve(Buffer.concat(buffers)));
            doc.on('error', reject);
            doc.rect(40, 40, 515, 60).fill('#1E1B4B');
            doc.fillColor('#FFFFFF').fontSize(18).font('Helvetica-Bold').text('Q CLOCKER ENTERPRISE', 60, 52);
            doc.fontSize(9).font('Helvetica').text('Official Earnings & Statutory Deduction Statement', 60, 74);
            doc.fontSize(9).font('Helvetica-Bold').text(`REF: ${payslip.referenceId}`, 380, 55, { align: 'right' });
            doc.fontSize(8).font('Helvetica').text(`Issued: ${new Date(payslip.createdAt).toLocaleDateString()}`, 380, 70, { align: 'right' });
            doc.moveDown(3);
            doc.rect(40, 115, 515, 75).stroke('#CBD5E1');
            doc.fillColor('#0F172A').fontSize(10).font('Helvetica-Bold');
            doc.text('Employee Information', 55, 125);
            doc.fontSize(9).font('Helvetica');
            doc.text(`Employee Name: ${payslip.employeeName}`, 55, 142);
            doc.text(`Employee ID: ${payslip.employeeCode}`, 55, 156);
            doc.text(`Job Designation: ${payslip.jobTitle}`, 55, 170);
            doc.text(`Department: ${payslip.departmentName}`, 320, 142);
            doc.text(`Pay Period: Month ${payslip.month} / ${payslip.year}`, 320, 156);
            doc.text(`Disbursement Status: ${payslip.status}`, 320, 170);
            const tableTop = 210;
            doc.rect(40, tableTop, 250, 22).fill('#4338CA');
            doc.fillColor('#FFFFFF').fontSize(9).font('Helvetica-Bold').text('EARNINGS', 50, tableTop + 6);
            doc.text('AMOUNT (USD)', 200, tableTop + 6, { align: 'right' });
            doc.rect(305, tableTop, 250, 22).fill('#475569');
            doc.fillColor('#FFFFFF').fontSize(9).font('Helvetica-Bold').text('DEDUCTIONS', 315, tableTop + 6);
            doc.text('AMOUNT (USD)', 465, tableTop + 6, { align: 'right' });
            let y = tableTop + 28;
            const earnings = [
                ['Basic Salary', payslip.basicPay],
                ['House Rent Allowance (HRA)', payslip.hra],
                ['Special & Flexi Allowances', payslip.allowances],
                ['Overtime Compensation', payslip.overtimePay],
            ];
            const deductions = [
                ['Income Tax (TDS / Federal)', payslip.taxDeduction],
                ['Provident Fund / 401(k)', payslip.pfDeduction],
                ['Health Insurance Premium', payslip.insurance],
                ['Unpaid Absence Adjustments', payslip.unpaidLeaveDeductions],
            ];
            doc.fillColor('#334155').fontSize(8.5).font('Helvetica');
            for (let i = 0; i < 4; i++) {
                doc.text(earnings[i][0], 50, y);
                doc.text(`$${Number(earnings[i][1]).toFixed(2)}`, 200, y, { align: 'right' });
                doc.text(deductions[i][0], 315, y);
                doc.text(`$${Number(deductions[i][1]).toFixed(2)}`, 465, y, { align: 'right' });
                y += 20;
            }
            doc.rect(40, y, 250, 24).fill('#EEF2FF');
            doc.fillColor('#1E1B4B').fontSize(9).font('Helvetica-Bold');
            doc.text('Gross Earnings', 50, y + 7);
            doc.text(`$${payslip.grossEarnings.toFixed(2)}`, 200, y + 7, { align: 'right' });
            doc.rect(305, y, 250, 24).fill('#F1F5F9');
            doc.fillColor('#0F172A').fontSize(9).font('Helvetica-Bold');
            doc.text('Total Deductions', 315, y + 7);
            doc.text(`$${payslip.totalDeductions.toFixed(2)}`, 465, y + 7, { align: 'right' });
            y += 45;
            doc.rect(40, y, 515, 50).fill('#059669');
            doc.fillColor('#FFFFFF').fontSize(11).font('Helvetica-Bold').text('NET TAKE-HOME DISBURSEMENT', 60, y + 12);
            doc.fontSize(8.5).font('Helvetica').text('Direct transfer credited to registered corporate bank account', 60, y + 28);
            doc.fontSize(18).font('Helvetica-Bold').text(`$${payslip.netSalary.toFixed(2)}`, 380, y + 16, { align: 'right' });
            y += 75;
            doc.rect(40, y, 515, 65).stroke('#E2E8F0');
            doc.fillColor('#64748B').fontSize(8).font('Helvetica');
            doc.text('Confidential Document — Generated electronically by Q Clocker Enterprise Identity & HRMS Platform.', 55, y + 12);
            doc.text('This payslip is tamper-evident and does not require an ink physical signature.', 55, y + 25);
            doc.text(`Digital Verification Hash: SHA256-${crypto.createHash('sha256').update(payslip.referenceId + payslip.netSalary).digest('hex').substring(0, 32).toUpperCase()}`, 55, y + 40);
            doc.end();
        });
    }
    async getTaxDeclaration(userId) {
        const existing = this.memoryDeclarations.get(userId);
        if (existing)
            return existing;
        const defaultDecl = {
            financialYear: '2026-2027',
            regime: 'NEW',
            section80c: 150000,
            section80d: 25000,
            hraRentPaid: 180000,
            homeLoanInterest: 200000,
            otherExemptions: 50000,
            status: 'VERIFIED',
            updatedAt: new Date().toISOString(),
        };
        this.memoryDeclarations.set(userId, defaultDecl);
        return defaultDecl;
    }
    async saveTaxDeclaration(userId, dto) {
        const record = {
            ...dto,
            status: 'SUBMITTED',
            updatedAt: new Date().toISOString(),
        };
        this.memoryDeclarations.set(userId, record);
        return {
            success: true,
            message: 'Tax-saving declaration submitted and queued for HR verification.',
            data: record,
        };
    }
};
exports.PayrollService = PayrollService;
exports.PayrollService = PayrollService = PayrollService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        users_service_1.UsersService,
        notifications_service_1.NotificationsService])
], PayrollService);
//# sourceMappingURL=payroll.service.js.map