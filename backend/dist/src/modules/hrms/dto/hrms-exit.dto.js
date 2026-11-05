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
exports.UpdateExitClearanceDto = exports.InitiateExitDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class InitiateExitDto {
    employeeId;
    resignationDate;
    noticePeriodDays;
    lastWorkingDay;
    reason;
    exitInterviewNotes;
}
exports.InitiateExitDto = InitiateExitDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '00000000-0000-0000-0000-000000000004' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], InitiateExitDto.prototype, "employeeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-11-05' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], InitiateExitDto.prototype, "resignationDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 30 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], InitiateExitDto.prototype, "noticePeriodDays", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-12-05' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], InitiateExitDto.prototype, "lastWorkingDay", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Pursuing higher studies / relocation.' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], InitiateExitDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], InitiateExitDto.prototype, "exitInterviewNotes", void 0);
class UpdateExitClearanceDto {
    hrClearance;
    itClearance;
    financeClearance;
    notes;
}
exports.UpdateExitClearanceDto = UpdateExitClearanceDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateExitClearanceDto.prototype, "hrClearance", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateExitClearanceDto.prototype, "itClearance", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateExitClearanceDto.prototype, "financeClearance", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateExitClearanceDto.prototype, "notes", void 0);
//# sourceMappingURL=hrms-exit.dto.js.map