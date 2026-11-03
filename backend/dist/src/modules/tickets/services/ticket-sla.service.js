"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketSlaService = void 0;
const common_1 = require("@nestjs/common");
const enums_1 = require("../../../common/enums");
let TicketSlaService = class TicketSlaService {
    calculatePriority(impact, urgency) {
        const imp = (impact || enums_1.TicketImpact.MEDIUM).toUpperCase();
        const urg = (urgency || enums_1.TicketUrgency.MEDIUM).toUpperCase();
        if ((imp === enums_1.TicketImpact.CRITICAL && urg === enums_1.TicketUrgency.CRITICAL) ||
            (imp === enums_1.TicketImpact.CRITICAL && urg === enums_1.TicketUrgency.HIGH) ||
            (imp === enums_1.TicketImpact.HIGH && urg === enums_1.TicketUrgency.CRITICAL)) {
            return { priority: enums_1.Priority.CRITICAL, priorityCode: enums_1.TicketPriorityCode.P1 };
        }
        if ((imp === enums_1.TicketImpact.CRITICAL && urg === enums_1.TicketUrgency.MEDIUM) ||
            (imp === enums_1.TicketImpact.HIGH && urg === enums_1.TicketUrgency.HIGH) ||
            (imp === enums_1.TicketImpact.MEDIUM && urg === enums_1.TicketUrgency.CRITICAL)) {
            return { priority: enums_1.Priority.HIGH, priorityCode: enums_1.TicketPriorityCode.P2 };
        }
        if ((imp === enums_1.TicketImpact.HIGH && urg === enums_1.TicketUrgency.LOW) ||
            (imp === enums_1.TicketImpact.MEDIUM && (urg === enums_1.TicketUrgency.MEDIUM || urg === enums_1.TicketUrgency.HIGH)) ||
            (imp === enums_1.TicketImpact.LOW && urg === enums_1.TicketUrgency.CRITICAL) ||
            (imp === enums_1.TicketImpact.LOW && urg === enums_1.TicketUrgency.HIGH)) {
            return { priority: enums_1.Priority.MEDIUM, priorityCode: enums_1.TicketPriorityCode.P3 };
        }
        return { priority: enums_1.Priority.LOW, priorityCode: enums_1.TicketPriorityCode.P4 };
    }
    getSlaTargets(priorityCode) {
        switch (priorityCode) {
            case enums_1.TicketPriorityCode.P1:
                return { responseHours: 1, resolutionHours: 4 };
            case enums_1.TicketPriorityCode.P2:
                return { responseHours: 2, resolutionHours: 8 };
            case enums_1.TicketPriorityCode.P3:
                return { responseHours: 4, resolutionHours: 24 };
            case enums_1.TicketPriorityCode.P4:
            default:
                return { responseHours: 8, resolutionHours: 72 };
        }
    }
    computeInitialSla(impact, urgency, createdAt = new Date()) {
        const { priority, priorityCode } = this.calculatePriority(impact, urgency);
        const { responseHours, resolutionHours } = this.getSlaTargets(priorityCode);
        const firstResponseDueAt = new Date(createdAt.getTime() + responseHours * 3600 * 1000);
        const resolutionDueAt = new Date(createdAt.getTime() + resolutionHours * 3600 * 1000);
        return {
            priority,
            priorityCode,
            responseHours,
            resolutionHours,
            firstResponseDueAt,
            resolutionDueAt,
            slaStatus: enums_1.SlaStatus.WITHIN_SLA,
            slaBreached: false,
            remainingSeconds: resolutionHours * 3600,
            percentageConsumed: 0,
        };
    }
    evaluateLiveSla(ticket) {
        const createdTime = new Date(ticket.createdAt).getTime();
        const resolutionDueTime = ticket.resolutionDueAt
            ? new Date(ticket.resolutionDueAt).getTime()
            : createdTime + (ticket.slaHours || 24) * 3600 * 1000;
        const totalAllowedMs = Math.max(resolutionDueTime - createdTime, 1000);
        const now = Date.now();
        if (ticket.status === enums_1.TicketStatus.RESOLVED ||
            ticket.status === enums_1.TicketStatus.CLOSED ||
            ticket.resolvedAt) {
            const resolvedTime = ticket.resolvedAt ? new Date(ticket.resolvedAt).getTime() : now;
            const effectiveDuration = resolvedTime - createdTime - (ticket.slaPauseDurationSeconds || 0) * 1000;
            const breached = effectiveDuration > totalAllowedMs;
            return {
                slaStatus: enums_1.SlaStatus.COMPLETED,
                slaBreached: breached,
                remainingSeconds: 0,
                percentageConsumed: Math.min(100, Math.round((effectiveDuration / totalAllowedMs) * 100)),
            };
        }
        const isPaused = ticket.status === enums_1.TicketStatus.PENDING_USER ||
            ticket.status === enums_1.TicketStatus.PENDING_VENDOR ||
            ticket.status === enums_1.TicketStatus.ON_HOLD;
        if (isPaused) {
            let pauseAccumulated = (ticket.slaPauseDurationSeconds || 0) * 1000;
            if (ticket.slaPausedAt) {
                pauseAccumulated += now - new Date(ticket.slaPausedAt).getTime();
            }
            const activeMs = Math.max(0, now - createdTime - pauseAccumulated);
            const remainingMs = Math.max(0, totalAllowedMs - activeMs);
            return {
                slaStatus: enums_1.SlaStatus.PAUSED,
                slaBreached: activeMs > totalAllowedMs,
                remainingSeconds: Math.round(remainingMs / 1000),
                percentageConsumed: Math.min(100, Math.round((activeMs / totalAllowedMs) * 100)),
            };
        }
        const activeMs = Math.max(0, now - createdTime - (ticket.slaPauseDurationSeconds || 0) * 1000);
        const remainingMs = totalAllowedMs - activeMs;
        const percentage = Math.round((activeMs / totalAllowedMs) * 100);
        let slaStatus = enums_1.SlaStatus.WITHIN_SLA;
        let slaBreached = false;
        if (activeMs > totalAllowedMs) {
            slaStatus = enums_1.SlaStatus.BREACHED;
            slaBreached = true;
        }
        else if (percentage >= 75) {
            slaStatus = enums_1.SlaStatus.APPROACHING_BREACH;
        }
        return {
            slaStatus,
            slaBreached,
            remainingSeconds: Math.max(0, Math.round(remainingMs / 1000)),
            percentageConsumed: percentage,
        };
    }
};
exports.TicketSlaService = TicketSlaService;
exports.TicketSlaService = TicketSlaService = __decorate([
    (0, common_1.Injectable)()
], TicketSlaService);
//# sourceMappingURL=ticket-sla.service.js.map