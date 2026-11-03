import { Injectable, BadRequestException } from '@nestjs/common';
import { TicketStatus, UserRole } from '../../../common/enums';

export interface TransitionContext {
  fromStatus: TicketStatus;
  toStatus: TicketStatus;
  actorRole: UserRole;
  actorId: string;
  reason?: string;
  resolutionNotes?: string;
  resolutionSummary?: string;
  rootCause?: string;
}

@Injectable()
export class TicketStateMachineService {
  /**
   * Enterprise ITSM Controlled Status Transition Matrix
   */
  private readonly validTransitions: Record<TicketStatus, TicketStatus[]> = {
    [TicketStatus.NEW]: [
      TicketStatus.OPEN,
      TicketStatus.ASSIGNED,
      TicketStatus.CANCELLED,
    ],
    [TicketStatus.OPEN]: [
      TicketStatus.ASSIGNED,
      TicketStatus.IN_PROGRESS,
      TicketStatus.PENDING_USER,
      TicketStatus.CANCELLED,
    ],
    [TicketStatus.ASSIGNED]: [
      TicketStatus.IN_PROGRESS,
      TicketStatus.PENDING_USER,
      TicketStatus.PENDING_VENDOR,
      TicketStatus.ON_HOLD,
      TicketStatus.CANCELLED,
    ],
    [TicketStatus.IN_PROGRESS]: [
      TicketStatus.PENDING_USER,
      TicketStatus.PENDING_VENDOR,
      TicketStatus.ON_HOLD,
      TicketStatus.RESOLVED,
      TicketStatus.CANCELLED,
    ],
    [TicketStatus.PENDING_USER]: [
      TicketStatus.IN_PROGRESS,
      TicketStatus.RESOLVED,
      TicketStatus.CLOSED,
      TicketStatus.CANCELLED,
    ],
    [TicketStatus.PENDING_VENDOR]: [
      TicketStatus.IN_PROGRESS,
      TicketStatus.RESOLVED,
      TicketStatus.ON_HOLD,
      TicketStatus.CANCELLED,
    ],
    [TicketStatus.ON_HOLD]: [
      TicketStatus.IN_PROGRESS,
      TicketStatus.RESOLVED,
      TicketStatus.CANCELLED,
    ],
    [TicketStatus.RESOLVED]: [
      TicketStatus.CLOSED,
      TicketStatus.REOPENED,
    ],
    [TicketStatus.CLOSED]: [
      TicketStatus.REOPENED,
    ],
    [TicketStatus.REOPENED]: [
      TicketStatus.ASSIGNED,
      TicketStatus.IN_PROGRESS,
      TicketStatus.PENDING_USER,
      TicketStatus.RESOLVED,
      TicketStatus.CANCELLED,
    ],
    [TicketStatus.CANCELLED]: [
      TicketStatus.NEW, // Only authorized admin can revive
    ],
  };

  /**
   * Check if transition is valid according to the matrix
   */
  canTransition(from: TicketStatus, to: TicketStatus): boolean {
    if (from === to) return true;
    const allowed = this.validTransitions[from] || [];
    return allowed.includes(to);
  }

  /**
   * Validate transition and enforce business rules
   */
  validateTransition(ctx: TransitionContext): void {
    const { fromStatus, toStatus, actorRole, reason, resolutionNotes } = ctx;

    if (fromStatus === toStatus) {
      return;
    }

    if (!this.canTransition(fromStatus, toStatus)) {
      throw new BadRequestException(
        `Invalid status transition: Cannot move ticket from '${fromStatus}' to '${toStatus}'. Permitted transitions from '${fromStatus}' are: [${(this.validTransitions[fromStatus] || []).join(', ')}]`,
      );
    }

    // Role-specific constraints
    if (fromStatus === TicketStatus.CLOSED && toStatus === TicketStatus.REOPENED) {
      if (
        actorRole !== UserRole.SUPER_ADMIN &&
        actorRole !== UserRole.ADMIN &&
        actorRole !== UserRole.IT_MANAGER &&
        actorRole !== UserRole.EMPLOYEE
      ) {
        throw new BadRequestException('Only the requester or IT managers can reopen closed tickets');
      }
      if (!reason || reason.trim().length < 5) {
        throw new BadRequestException('A reason explaining why the issue persists is mandatory when reopening a ticket');
      }
    }

    // Resolution enforcement
    if (toStatus === TicketStatus.RESOLVED) {
      if (!resolutionNotes || resolutionNotes.trim().length < 5) {
        throw new BadRequestException(
          'Resolution notes explaining the root cause and remediation steps are mandatory to mark a ticket as RESOLVED',
        );
      }
    }

    // Cancellation constraint
    if (toStatus === TicketStatus.CANCELLED) {
      if (!reason || reason.trim().length < 3) {
        throw new BadRequestException('A cancellation reason is required when cancelling a ticket');
      }
    }
  }

  getPermittedNextStatuses(currentStatus: TicketStatus): TicketStatus[] {
    return this.validTransitions[currentStatus] || [];
  }
}
