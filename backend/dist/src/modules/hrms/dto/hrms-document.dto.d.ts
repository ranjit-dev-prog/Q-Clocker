export declare class UploadDocumentDto {
    employeeId: string;
    category: string;
    title: string;
    fileName: string;
    fileSize?: number;
    mimeType?: string;
    fileUrl?: string;
    expiresAt?: string;
}
export declare class VerifyDocumentDto {
    status: 'VERIFIED' | 'REJECTED';
    notes?: string;
}
