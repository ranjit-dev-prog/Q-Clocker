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
exports.CreateTicketDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const enums_1 = require("../../../common/enums");
class CreateTicketDto {
    title;
    description;
    departmentId;
    assignedTechnicianId;
    priority;
    category;
    subcategory;
    slaPolicyId;
    relatedTaskId;
    relatedAssetId;
}
exports.CreateTicketDto = CreateTicketDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Ticket subject line', example: 'VPN Gateway Cluster Auth Timeout' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTicketDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Detailed problem description and reproduction steps' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTicketDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Department UUID handling this ticket' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTicketDto.prototype, "departmentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Assigned technician UUID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTicketDto.prototype, "assignedTechnicianId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: enums_1.Priority, default: enums_1.Priority.MEDIUM }),
    (0, class_validator_1.IsEnum)(enums_1.Priority),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTicketDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: enums_1.TicketCategory, default: enums_1.TicketCategory.IT_SUPPORT }),
    (0, class_validator_1.IsEnum)(enums_1.TicketCategory),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTicketDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Subcategory identifier', example: 'OpenVPN Client' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTicketDto.prototype, "subcategory", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'SLA Policy UUID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTicketDto.prototype, "slaPolicyId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Related Task UUID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTicketDto.prototype, "relatedTaskId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Related Asset UUID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTicketDto.prototype, "relatedAssetId", void 0);
//# sourceMappingURL=create-ticket.dto.js.map