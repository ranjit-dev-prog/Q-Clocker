import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getSummary(user: any): Promise<import("./dto/dashboard.dto").DashboardSummaryResponse>;
}
