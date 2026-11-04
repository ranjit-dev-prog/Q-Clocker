import { Response } from 'express';
import { PayrollService } from './payroll.service';
import { TaxDeclarationDto } from './dto/payroll.dto';
export declare class PayrollController {
    private readonly payrollService;
    constructor(payrollService: PayrollService);
    getTemplate(res: Response): Promise<Response<any, Record<string, any>>>;
    uploadBatch(file: Express.Multer.File, actor: any): Promise<{
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
        insertedPayslips: import("./payroll.service").PayslipItem[];
    }>;
    getAllBatches(): Promise<any[]>;
    getMyPayslips(user: any): Promise<import("./payroll.service").PayslipItem[]>;
    downloadPayslipPdf(id: string, user: any, res: Response): Promise<Response<any, Record<string, any>>>;
    getTaxDeclaration(user: any): Promise<any>;
    saveTaxDeclaration(user: any, dto: TaxDeclarationDto): Promise<{
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
