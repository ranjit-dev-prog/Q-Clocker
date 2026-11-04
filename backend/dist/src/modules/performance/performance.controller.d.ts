import { PerformanceService } from './performance.service';
export declare class PerformanceController {
    private readonly performanceService;
    constructor(performanceService: PerformanceService);
    getMyPerformance(user: any): Promise<import("./dto/performance.dto").PerformanceEvaluation>;
}
