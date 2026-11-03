export declare class BulkImportPreviewDto {
    csvContent: string;
}
export declare class ImportEmployeeRow {
    employee_code?: string;
    first_name: string;
    last_name: string;
    email: string;
    department?: string;
    designation?: string;
    manager_email?: string;
    role?: string;
    joining_date?: string;
    employment_type?: string;
    work_location?: string;
}
export declare class BulkImportConfirmDto {
    employees: ImportEmployeeRow[];
}
