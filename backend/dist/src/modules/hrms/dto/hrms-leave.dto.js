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
exports.LeaveRequestDecisionDto = exports.CreateLeaveRequestDto = exports.CreateLeaveTypeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateLeaveTypeDto {
    code;
    name;
    description;
    annualAllowanceDays;
    isPaid;
    requiresAttachment;
}
exports.CreateLeaveTypeDto = CreateLeaveTypeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'CASUAL_LEAVE' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateLeaveTypeDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Casual Leave' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateLeaveTypeDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Standard periodic casual leave for personal reasons' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateLeaveTypeDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateLeaveTypeDto.prototype, "annualAllowanceDays", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: true }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateLeaveTypeDto.prototype, "isPaid", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateLeaveTypeDto.prototype, "requiresAttachment", void 0);
class CreateLeaveRequestDto {
    leaveTypeCode;
    startDate;
    endDate;
    totalDays;
    reason;
    attachmentUrl;
}
exports.CreateLeaveRequestDto = CreateLeaveRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'CASUAL_LEAVE' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateLeaveRequestDto.prototype, "leaveTypeCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-11-10' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateLeaveRequestDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-11-12' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateLeaveRequestDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateLeaveRequestDto.prototype, "totalDays", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Attending family celebration' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateLeaveRequestDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateLeaveRequestDto.prototype, "attachmentUrl", void 0);
class LeaveRequestDecisionDto {
    action;
    comments;
}
exports.LeaveRequestDecisionDto = LeaveRequestDecisionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['APPROVE', 'REJECT', 'REQUEST_INFO'] }),
    (0, class_validator_1.IsEnum)(['APPROVE', 'REJECT', 'REQUEST_INFO']),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], LeaveRequestDecisionDto.prototype, "action", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Approved by People Operations.' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], LeaveRequestDecisionDto.prototype, "comments", void 0);
//# sourceMappingURL=hrms-leave.dto.js.map