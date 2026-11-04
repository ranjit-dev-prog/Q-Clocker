export interface PerformanceEvaluation {
    overallScore: number;
    complexityFactor: number;
    timelinessRate: number;
    managerRating: number;
    period: string;
    reviewerName: string;
    tierRanking: string;
    ratingTier?: string;
    overdueTasksCount: number;
    completedTasksCount: number;
    tasksCompleted?: number;
    ticketsResolved?: number;
    qualityScore: number;
    feedbackNotes: string;
    breakdown: {
        technicalExecution: number;
        codeQuality: number;
        collaboration: number;
        slaAdherence: number;
    };
}
