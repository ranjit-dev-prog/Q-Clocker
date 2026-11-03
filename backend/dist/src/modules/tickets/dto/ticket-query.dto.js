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
exports.TicketQueryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class TicketQueryDto {
    status;
    priority;
    priorityCode;
    category;
    departmentId;
    assignedTechnicianId;
    assignedTeamId;
    requesterId;
    slaStatus;
    search;
    page;
    limit;
}
exports.TicketQueryDto = TicketQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by ticket status' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TicketQueryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by priority level (e.g. CRITICAL, HIGH, MEDIUM, LOW)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TicketQueryDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by priority code (P1, P2, P3, P4)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TicketQueryDto.prototype, "priorityCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by category name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TicketQueryDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by department UUID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TicketQueryDto.prototype, "departmentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by assigned technician UUID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TicketQueryDto.prototype, "assignedTechnicianId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by assigned support team UUID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TicketQueryDto.prototype, "assignedTeamId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by requester UUID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TicketQueryDto.prototype, "requesterId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by SLA condition (WITHIN_SLA, APPROACHING_BREACH, BREACHED, PAUSED, COMPLETED)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TicketQueryDto.prototype, "slaStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Global keyword search (Ticket reference, title, description, requester name)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TicketQueryDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page number for pagination', default: 1 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], TicketQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page size limit', default: 25 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], TicketQueryDto.prototype, "limit", void 0);
//# sourceMappingURL=ticket-query.dto.js.map