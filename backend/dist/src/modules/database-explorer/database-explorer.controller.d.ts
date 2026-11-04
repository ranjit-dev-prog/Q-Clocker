import { DatabaseExplorerService } from './database-explorer.service';
export declare class DatabaseExplorerController {
    private readonly explorerService;
    constructor(explorerService: DatabaseExplorerService);
    getTables(): Promise<import("./database-explorer.service").TableSummary[]>;
    getTableSchema(tableName: string): Promise<{
        tableName: string;
        columns: import("./database-explorer.service").ColumnDetail[];
    }>;
    getTableData(tableName: string, page?: number, limit?: number, search?: string): Promise<{
        tableName: string;
        total: number;
        page: number;
        limit: number;
        columns: string[];
        rows: any[];
    }>;
}
