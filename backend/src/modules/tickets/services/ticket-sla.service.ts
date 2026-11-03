import { Injectable } from '@nestjs/common';
import {
  Priority,
  TicketImpact,
  TicketUrgency,
  TicketPriorityCode,
  SlaStatus,
  TicketStatus,
} from '../../../common/enums';

export interface SlaTargetConfig {
  responseHours: number;
  resolutionHours: number;
}

export interface SlaCalculationResult {
  priority: Priority;
  priorityCode: TicketPriorityCode;
  responseHours: number;
  resolutionHours: number;
  firstResponseDueAt: Date;
  resolutionDueAt: Date;
  slaStatus: SlaStatus;
  slaBreached: boolean;
  remainingSeconds: number;
  percentageConsumed: number;
}

@Injectable()
export class TicketSlaService {
  /**
   * Enterprise Priority Matrix based on ITIL standard: Impact x Urgency
   */
  calculatePriority(
    impact?: TicketImpact | string,
    urgency?: TicketUrgency | string,
  ): { priority: Priority; priorityCode: TicketPriorityCode } {
    const imp = (impact || TicketImpact.MEDIUM).toUpperCase();
    const urg = (urgency || TicketUrgency.MEDIUM).toUpperCase();

    // P1 - Critical
    if (
      (imp === TicketImpact.CRITICAL && urg === TicketUrgency.CRITICAL) ||
      (imp === TicketImpact.CRITICAL && urg === TicketUrgency.HIGH) ||
      (imp === TicketImpact.HIGH && urg === TicketUrgency.CRITICAL)
    ) {
      return { priority: Priority.CRITICAL, priorityCode: TicketPriorityCode.P1 };
    }

    // P2 - High
    if (
      (imp === TicketImpact.CRITICAL && urg === TicketUrgency.MEDIUM) ||
      (imp === TicketImpact.HIGH && urg === TicketUrgency.HIGH) ||
      (imp === TicketImpact.MEDIUM && urg === TicketUrgency.CRITICAL)
    ) {
      return { priority: Priority.HIGH, priorityCode: TicketPriorityCode.P2 };
    }

    // P3 - Medium
    if (
      (imp === TicketImpact.HIGH && urg === TicketUrgency.LOW) ||
      (imp === TicketImpact.MEDIUM && (urg === TicketUrgency.MEDIUM || urg === TicketUrgency.HIGH)) ||
      (imp === TicketImpact.LOW && urg === TicketUrgency.CRITICAL) ||
      (imp === TicketImpact.LOW && urg === TicketUrgency.HIGH)
    ) {
      return { priority: Priority.MEDIUM, priorityCode: TicketPriorityCode.P3 };
    }

    // P4 - Low
    return { priority: Priority.LOW, priorityCode: TicketPriorityCode.P4 };
  }

  /**
   * Target SLA Response and Resolution windows
   */
  getSlaTargets(priorityCode: TicketPriorityCode): SlaTargetConfig {
    switch (priorityCode) {
      case TicketPriorityCode.P1:
        return { responseHours: 1, resolutionHours: 4 };
      case TicketPriorityCode.P2:
        return { responseHours: 2, resolutionHours: 8 };
      case TicketPriorityCode.P3:
        return { responseHours: 4, resolutionHours: 24 };
      case TicketPriorityCode.P4:
      default:
        return { responseHours: 8, resolutionHours: 72 };
    }
  }

  /**
   * Compute initial SLA deadlines from creation time
   */
  computeInitialSla(
    impact?: TicketImpact | string,
    urgency?: TicketUrgency | string,
    createdAt: Date = new Date(),
  ): SlaCalculationResult {
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
      slaStatus: SlaStatus.WITHIN_SLA,
      slaBreached: false,
      remainingSeconds: resolutionHours * 3600,
      percentageConsumed: 0,
    };
  }

  /**
   * Evaluate live SLA progress accounting for pauses, response status, and resolution
   */
  evaluateLiveSla(ticket: {
    createdAt: Date | string;
    resolutionDueAt?: Date | string | null;
    status: TicketStatus | string;
    resolvedAt?: Date | string | null;
    slaPausedAt?: Date | string | null;
    slaPauseDurationSeconds?: number;
    slaHours?: number;
  }): {
    slaStatus: SlaStatus;
    slaBreached: boolean;
    remainingSeconds: number;
    percentageConsumed: number;
  } {
    const createdTime = new Date(ticket.createdAt).getTime();
    const resolutionDueTime = ticket.resolutionDueAt
      ? new Date(ticket.resolutionDueAt).getTime()
      : createdTime + (ticket.slaHours || 24) * 3600 * 1000;

    const totalAllowedMs = Math.max(resolutionDueTime - createdTime, 1000);
    const now = Date.now();

    // If ticket is already resolved/closed
    if (
      ticket.status === TicketStatus.RESOLVED ||
      ticket.status === TicketStatus.CLOSED ||
      ticket.resolvedAt
    ) {
      const resolvedTime = ticket.resolvedAt ? new Date(ticket.resolvedAt).getTime() : now;
      const effectiveDuration = resolvedTime - createdTime - (ticket.slaPauseDurationSeconds || 0) * 1000;
      const breached = effectiveDuration > totalAllowedMs;
      return {
        slaStatus: SlaStatus.COMPLETED,
        slaBreached: breached,
        remainingSeconds: 0,
        percentageConsumed: Math.min(100, Math.round((effectiveDuration / totalAllowedMs) * 100)),
      };
    }

    // Check if SLA is currently paused (Pending User, Pending Vendor, On Hold)
    const isPaused =
      ticket.status === TicketStatus.PENDING_USER ||
      ticket.status === TicketStatus.PENDING_VENDOR ||
      ticket.status === TicketStatus.ON_HOLD;

    if (isPaused) {
      let pauseAccumulated = (ticket.slaPauseDurationSeconds || 0) * 1000;
      if (ticket.slaPausedAt) {
        pauseAccumulated += now - new Date(ticket.slaPausedAt).getTime();
      }
      const activeMs = Math.max(0, now - createdTime - pauseAccumulated);
      const remainingMs = Math.max(0, totalAllowedMs - activeMs);

      return {
        slaStatus: SlaStatus.PAUSED,
        slaBreached: activeMs > totalAllowedMs,
        remainingSeconds: Math.round(remainingMs / 1000),
        percentageConsumed: Math.min(100, Math.round((activeMs / totalAllowedMs) * 100)),
      };
    }

    // Active ticket (In Progress, Open, Assigned, New)
    const activeMs = Math.max(0, now - createdTime - (ticket.slaPauseDurationSeconds || 0) * 1000);
    const remainingMs = totalAllowedMs - activeMs;
    const percentage = Math.round((activeMs / totalAllowedMs) * 100);

    let slaStatus = SlaStatus.WITHIN_SLA;
    let slaBreached = false;

    if (activeMs > totalAllowedMs) {
      slaStatus = SlaStatus.BREACHED;
      slaBreached = true;
    } else if (percentage >= 75) {
      slaStatus = SlaStatus.APPROACHING_BREACH;
    }

    return {
      slaStatus,
      slaBreached,
      remainingSeconds: Math.max(0, Math.round(remainingMs / 1000)),
      percentageConsumed: percentage,
    };
  }
}
