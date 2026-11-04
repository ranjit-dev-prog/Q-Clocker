import { LifecycleService } from './lifecycle.service';
import { ExtendProbationDto } from './dto/lifecycle.dto';
export declare class LifecycleController {
    private readonly lifecycleService;
    constructor(lifecycleService: LifecycleService);
    getCelebrations(): Promise<import("./lifecycle.service").LifecycleItem[]>;
    congratulate(id: string, user: any): Promise<{
        success: boolean;
        congratulationsCount: number;
        hasCongratulated: boolean;
    }>;
    getReminders(urgency?: string): Promise<import("./lifecycle.service").LifecycleItem[]>;
    notifyReminder(id: string, actor: any): Promise<{
        success: boolean;
        message: string;
    }>;
    extendProbation(id: string, dto: ExtendProbationDto, actor: any): Promise<{
        success: boolean;
        message: string;
        item: import("./lifecycle.service").LifecycleItem;
    }>;
    resolveReminder(id: string): Promise<{
        success: boolean;
        message: string;
        item: import("./lifecycle.service").LifecycleItem;
    }>;
}
