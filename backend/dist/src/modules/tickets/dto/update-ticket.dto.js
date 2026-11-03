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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReopenTicketDto = exports.ResolveTicketDto = exports.EscalateTicketDto = exports.AssignTicketDto = exports.TransitionTicketStatusDto = exports.UpdateTicketDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_ticket_dto_1 = require("./create-ticket.dto");
const class_validator_1 = require("class-validator");
const enums_1 = require("../../../common/enums");
class UpdateTicketDto extends (0, swagger_1.PartialType)(create_ticket_dto_1.CreateTicketDto) {
    status;
    resolutionNotes;
    resolutionSummary;
    rootCause;
    resolutionCategory;
}
exports.UpdateTicketDto = UpdateTicketDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: enums_1.TicketStatus }),
    (0, class_validator_1.IsEnum)(enums_1.TicketStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateTicketDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Resolution root-cause and remediation summary' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateTicketDto.prototype, "resolutionNotes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Executive resolution summary' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateTicketDto.prototype, "resolutionSummary", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Root cause identified during investigation' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateTicketDto.prototype, "rootCause", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Categorization of the resolution' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateTicketDto.prototype, "resolutionCategory", void 0);
class TransitionTicketStatusDto {
    status;
    reason;
    resolutionNotes;
    resolutionSummary;
    rootCause;
    resolutionCategory;
}
exports.TransitionTicketStatusDto = TransitionTicketStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: enums_1.TicketStatus, description: 'Target status in the ITSM lifecycle' }),
    (0, class_validator_1.IsEnum)(enums_1.TicketStatus),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], TransitionTicketStatusDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Optional operational reason for the status transition' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TransitionTicketStatusDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Required when transitioning to RESOLVED' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TransitionTicketStatusDto.prototype, "resolutionNotes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Executive resolution summary' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TransitionTicketStatusDto.prototype, "resolutionSummary", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Root cause identified' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TransitionTicketStatusDto.prototype, "rootCause", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Resolution category' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TransitionTicketStatusDto.prototype, "resolutionCategory", void 0);
class AssignTicketDto {
    assignedTechnicianId;
    assignedTeamId;
    reason;
}
exports.AssignTicketDto = AssignTicketDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Technician UUID to assign the ticket to' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AssignTicketDto.prototype, "assignedTechnicianId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Support team UUID to route the ticket to' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AssignTicketDto.prototype, "assignedTeamId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Reason for assignment or transfer' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AssignTicketDto.prototype, "reason", void 0);
class EscalateTicketDto {
    escalationReason;
    targetRole;
}
exports.EscalateTicketDto = EscalateTicketDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Detailed reason for ticket escalation' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], EscalateTicketDto.prototype, "escalationReason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Target escalation role (e.g., IT_MANAGER, ADMIN)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EscalateTicketDto.prototype, "targetRole", void 0);
class ResolveTicketDto {
    resolutionNotes;
    resolutionSummary;
    rootCause;
    resolutionCategory;
}
exports.ResolveTicketDto = ResolveTicketDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Detailed remediation actions and fix applied' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ResolveTicketDto.prototype, "resolutionNotes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Executive high-level resolution summary' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ResolveTicketDto.prototype, "resolutionSummary", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Underlying root cause identified during triage' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ResolveTicketDto.prototype, "rootCause", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Resolution classification (e.g. Patch Applied, Config Change, User Education)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ResolveTicketDto.prototype, "resolutionCategory", void 0);
class ReopenTicketDto {
    reason;
}
exports.ReopenTicketDto = ReopenTicketDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Reason explaining why the resolved issue is recurring or unaddressed' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ReopenTicketDto.prototype, "reason", void 0);
//# sourceMappingURL=update-ticket.dto.js.map