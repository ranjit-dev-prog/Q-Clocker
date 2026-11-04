export declare class TaxDeclarationDto {
    financialYear: string;
    regime: 'NEW' | 'OLD';
    section80c?: number;
    section80d?: number;
    hraRentPaid?: number;
    homeLoanInterest?: number;
    otherExemptions?: number;
}
