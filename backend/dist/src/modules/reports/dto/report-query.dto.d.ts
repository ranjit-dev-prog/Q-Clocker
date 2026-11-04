export declare class ReportQueryDto {
    startDate?: string;
    endDate?: string;
    departmentId?: string;
    reportType?: 'itsm' | 'workforce' | 'audit';
    format?: 'json' | 'xlsx' | 'csv';
}
