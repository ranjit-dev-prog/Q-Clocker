import { DatabaseService } from '../../database/database.service';
import { NotificationsService } from '../notifications/notifications.service';
import { UsersService } from '../users/users.service';
import { TaxDeclarationDto } from './dto/payroll.dto';
export interface PayslipItem {
    id: string;
    referenceId: string;
    batchId?: string;
    employeeId: string;
    employeeName: string;
    employeeCode: string;
    departmentName: string;
    jobTitle: string;
    month: number;
    year: number;
    basicPay: number;
    hra: number;
    allowances: number;
    overtimePay: number;
    grossEarnings: number;
    taxDeduction: number;
    pfDeduction: number;
    insurance: number;
    unpaidLeaveDeductions: number;
    totalDeductions: number;
    netSalary: number;
    isEncrypted: boolean;
    status: string;
    createdAt: string;
}
export declare class PayrollService {
    private readonly dbService;
    private readonly usersService;
    private readonly notificationsService?;
    private readonly logger;
    private memoryBatches;
    private memoryPayslips;
    private memoryDeclarations;
    constructor(dbService: DatabaseService, usersService: UsersService, notificationsService?: NotificationsService | undefined);
    generatePayrollTemplate(): Promise<Buffer>;
    uploadBatch(file: Express.Multer.File, actorUser: any): Promise<{
        success: boolean;
        batch: {
            id: `${string}-${string}-${string}-${string}-${string}`;
            batchNumber: string;
            month: any;
            year: any;
            totalDisbursed: number;
            employeeCount: number;
            status: string;
            processedByName: string;
            createdAt: string;
        };
        summary: {
            totalRows: number;
            validDisbursed: number;
            totalDisbursed: number;
            errorsCount: number;
            warningsCount: number;
        };
        errors: any[];
        warnings: any[];
        insertedPayslips: PayslipItem[];
    }>;
    getMyPayslips(userId: string): Promise<PayslipItem[]>;
    getAllBatches(): Promise<any[]>;
    generatePayslipPdf(payslipId: string, user: any): Promise<Buffer>;
    getTaxDeclaration(userId: string): Promise<any>;
    saveTaxDeclaration(userId: string, dto: TaxDeclarationDto): Promise<{
        success: boolean;
        message: string;
        data: {
            status: string;
            updatedAt: string;
            financialYear: string;
            regime: "NEW" | "OLD";
            section80c?: number;
            section80d?: number;
            hraRentPaid?: number;
            homeLoanInterest?: number;
            otherExemptions?: number;
        };
    }>;
}
