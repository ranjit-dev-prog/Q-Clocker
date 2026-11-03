"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketStateMachineService = void 0;
const common_1 = require("@nestjs/common");
const enums_1 = require("../../../common/enums");
let TicketStateMachineService = class TicketStateMachineService {
    validTransitions = {
        [enums_1.TicketStatus.NEW]: [
            enums_1.TicketStatus.OPEN,
            enums_1.TicketStatus.ASSIGNED,
            enums_1.TicketStatus.CANCELLED,
        ],
        [enums_1.TicketStatus.OPEN]: [
            enums_1.TicketStatus.ASSIGNED,
            enums_1.TicketStatus.IN_PROGRESS,
            enums_1.TicketStatus.PENDING_USER,
            enums_1.TicketStatus.CANCELLED,
        ],
        [enums_1.TicketStatus.ASSIGNED]: [
            enums_1.TicketStatus.IN_PROGRESS,
            enums_1.TicketStatus.PENDING_USER,
            enums_1.TicketStatus.PENDING_VENDOR,
            enums_1.TicketStatus.ON_HOLD,
            enums_1.TicketStatus.CANCELLED,
        ],
        [enums_1.TicketStatus.IN_PROGRESS]: [
            enums_1.TicketStatus.PENDING_USER,
            enums_1.TicketStatus.PENDING_VENDOR,
            enums_1.TicketStatus.ON_HOLD,
            enums_1.TicketStatus.RESOLVED,
            enums_1.TicketStatus.CANCELLED,
        ],
        [enums_1.TicketStatus.PENDING_USER]: [
            enums_1.TicketStatus.IN_PROGRESS,
            enums_1.TicketStatus.RESOLVED,
            enums_1.TicketStatus.CLOSED,
            enums_1.TicketStatus.CANCELLED,
        ],
        [enums_1.TicketStatus.PENDING_VENDOR]: [
            enums_1.TicketStatus.IN_PROGRESS,
            enums_1.TicketStatus.RESOLVED,
            enums_1.TicketStatus.ON_HOLD,
            enums_1.TicketStatus.CANCELLED,
        ],
        [enums_1.TicketStatus.ON_HOLD]: [
            enums_1.TicketStatus.IN_PROGRESS,
            enums_1.TicketStatus.RESOLVED,
            enums_1.TicketStatus.CANCELLED,
        ],
        [enums_1.TicketStatus.RESOLVED]: [
            enums_1.TicketStatus.CLOSED,
            enums_1.TicketStatus.REOPENED,
        ],
        [enums_1.TicketStatus.CLOSED]: [
            enums_1.TicketStatus.REOPENED,
        ],
        [enums_1.TicketStatus.REOPENED]: [
            enums_1.TicketStatus.ASSIGNED,
            enums_1.TicketStatus.IN_PROGRESS,
            enums_1.TicketStatus.PENDING_USER,
            enums_1.TicketStatus.RESOLVED,
            enums_1.TicketStatus.CANCELLED,
        ],
        [enums_1.TicketStatus.CANCELLED]: [
            enums_1.TicketStatus.NEW,
        ],
    };
    canTransition(from, to) {
        if (from === to)
            return true;
        const allowed = this.validTransitions[from] || [];
        return allowed.includes(to);
    }
    validateTransition(ctx) {
        const { fromStatus, toStatus, actorRole, reason, resolutionNotes } = ctx;
        if (fromStatus === toStatus) {
            return;
        }
        if (!this.canTransition(fromStatus, toStatus)) {
            throw new common_1.BadRequestException(`Invalid status transition: Cannot move ticket from '${fromStatus}' to '${toStatus}'. Permitted transitions from '${fromStatus}' are: [${(this.validTransitions[fromStatus] || []).join(', ')}]`);
        }
        if (fromStatus === enums_1.TicketStatus.CLOSED && toStatus === enums_1.TicketStatus.REOPENED) {
            if (actorRole !== enums_1.UserRole.SUPER_ADMIN &&
                actorRole !== enums_1.UserRole.ADMIN &&
                actorRole !== enums_1.UserRole.IT_MANAGER &&
                actorRole !== enums_1.UserRole.EMPLOYEE) {
                throw new common_1.BadRequestException('Only the requester or IT managers can reopen closed tickets');
            }
            if (!reason || reason.trim().length < 5) {
                throw new common_1.BadRequestException('A reason explaining why the issue persists is mandatory when reopening a ticket');
            }
        }
        if (toStatus === enums_1.TicketStatus.RESOLVED) {
            if (!resolutionNotes || resolutionNotes.trim().length < 5) {
                throw new common_1.BadRequestException('Resolution notes explaining the root cause and remediation steps are mandatory to mark a ticket as RESOLVED');
            }
        }
        if (toStatus === enums_1.TicketStatus.CANCELLED) {
            if (!reason || reason.trim().length < 3) {
                throw new common_1.BadRequestException('A cancellation reason is required when cancelling a ticket');
            }
        }
    }
    getPermittedNextStatuses(currentStatus) {
        return this.validTransitions[currentStatus] || [];
    }
};
exports.TicketStateMachineService = TicketStateMachineService;
exports.TicketStateMachineService = TicketStateMachineService = __decorate([
    (0, common_1.Injectable)()
], TicketStateMachineService);
//# sourceMappingURL=ticket-state-machine.service.js.map