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
exports.ExtendProbationDto = exports.CreateLifecycleEventDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateLifecycleEventDto {
    employeeId;
    eventType;
    eventDate;
    title;
    description;
    urgency;
}
exports.CreateLifecycleEventDto = CreateLifecycleEventDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Target employee UUID' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateLifecycleEventDto.prototype, "employeeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['BIRTHDAY', 'WORK_ANNIVERSARY', 'PROBATION_END', 'CONTRACT_EXPIRY', 'DOCUMENT_EXPIRY'] }),
    (0, class_validator_1.IsIn)(['BIRTHDAY', 'WORK_ANNIVERSARY', 'PROBATION_END', 'CONTRACT_EXPIRY', 'DOCUMENT_EXPIRY']),
    __metadata("design:type", String)
], CreateLifecycleEventDto.prototype, "eventType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-11-15' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateLifecycleEventDto.prototype, "eventDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '3-Year Work Anniversary' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateLifecycleEventDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Event details and milestone notes' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateLifecycleEventDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['INFO', 'UPCOMING', 'CRITICAL'], default: 'UPCOMING' }),
    (0, class_validator_1.IsIn)(['INFO', 'UPCOMING', 'CRITICAL']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateLifecycleEventDto.prototype, "urgency", void 0);
class ExtendProbationDto {
    newEndDate;
    reason;
}
exports.ExtendProbationDto = ExtendProbationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-12-31', description: 'New probation end date' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ExtendProbationDto.prototype, "newEndDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Additional performance review cycle required in Q4.' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ExtendProbationDto.prototype, "reason", void 0);
//# sourceMappingURL=lifecycle.dto.js.map