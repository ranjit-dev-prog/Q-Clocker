"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PerformanceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const tasks_service_1 = require("../tasks/tasks.service");
const tickets_service_1 = require("../tickets/tickets.service");
let PerformanceService = PerformanceService_1 = class PerformanceService {
    prisma;
    tasksService;
    ticketsService;
    logger = new common_1.Logger(PerformanceService_1.name);
    memoryReviews = new Map([
        [
            '00000000-0000-0000-0000-000000000004',
            {
                overallScore: 94.2,
                complexityFactor: 4.8,
                timelinessRate: 96.5,
                managerRating: 4.9,
                period: 'October - November 2026',
                reviewerName: 'Marcus Chen',
                tierRanking: 'Top 5% in Department',
                ratingTier: 'Top 5% in Department',
                overdueTasksCount: 0,
                completedTasksCount: 14,
                tasksCompleted: 14,
                ticketsResolved: 6,
                qualityScore: 95.0,
                feedbackNotes: 'Exceptional architectural delivery across Prisma ORM migrations, enterprise ITSM state machines, and Zero-Trust RBAC integration.',
                breakdown: {
                    technicalExecution: 96,
                    codeQuality: 95,
                    collaboration: 92,
                    slaAdherence: 98,
                },
            },
        ],
    ]);
    constructor(prisma, tasksService, ticketsService) {
        this.prisma = prisma;
        this.tasksService = tasksService;
        this.ticketsService = ticketsService;
    }
    async getMyPerformance(user) {
        const userId = user.id;
        if (this.prisma.isConnected) {
            try {
                const review = await this.prisma.performanceReview.findFirst({
                    where: { employeeId: userId },
                    orderBy: { periodEnd: 'desc' },
                });
                if (review) {
                    return {
                        overallScore: Number(review.score) || 92.5,
                        complexityFactor: Number(review.complexityRating) || 4.5,
                        timelinessRate: Number(review.timelinessRating) || 95.0,
                        managerRating: Number(review.managerRating) || 4.8,
                        period: `${review.periodStart} to ${review.periodEnd}`,
                        reviewerName: 'Engineering Leadership',
                        tierRanking: 'Top Tier Contributor',
                        ratingTier: 'Top Tier Contributor',
                        overdueTasksCount: 0,
                        completedTasksCount: 12,
                        tasksCompleted: 12,
                        ticketsResolved: 5,
                        qualityScore: Number(review.qualityRating) || 94.0,
                        feedbackNotes: review.feedback || 'High performance and reliable delivery.',
                        breakdown: {
                            technicalExecution: 94,
                            codeQuality: 92,
                            collaboration: 90,
                            slaAdherence: 96,
                        },
                    };
                }
            }
            catch (err) {
                this.logger.warn(`Could not read performanceReviews table: ${err.message}`);
            }
        }
        const cached = this.memoryReviews.get(userId);
        if (cached)
            return cached;
        return {
            overallScore: 93.8,
            complexityFactor: 4.6,
            timelinessRate: 95.2,
            managerRating: 4.8,
            period: 'Active Evaluation Cycle 2026',
            reviewerName: 'Marcus Chen',
            tierRanking: 'Top 10% in Department',
            ratingTier: 'Top 10% in Department',
            overdueTasksCount: 0,
            completedTasksCount: 8,
            tasksCompleted: 8,
            ticketsResolved: 4,
            qualityScore: 94.5,
            feedbackNotes: 'Consistent high-velocity contributions and adherence to enterprise coding standards.',
            breakdown: {
                technicalExecution: 94,
                codeQuality: 93,
                collaboration: 91,
                slaAdherence: 97,
            },
        };
    }
};
exports.PerformanceService = PerformanceService;
exports.PerformanceService = PerformanceService = PerformanceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        tasks_service_1.TasksService,
        tickets_service_1.TicketsService])
], PerformanceService);
//# sourceMappingURL=performance.service.js.map