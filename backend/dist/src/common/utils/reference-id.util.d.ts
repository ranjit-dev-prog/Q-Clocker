export type EntityPrefix = 'EMP' | 'DEP' | 'TEM' | 'TSK' | 'TKT' | 'TMS' | 'ATT' | 'FUP' | 'APR' | 'WLG' | 'PRJ' | 'AST' | 'SLA' | 'SES';
export declare function generateReferenceId(prefix: EntityPrefix, length?: number): string;
