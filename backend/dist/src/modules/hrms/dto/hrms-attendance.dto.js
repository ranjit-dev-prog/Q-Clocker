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
exports.AttendanceCorrectionDecisionDto = exports.AttendanceCorrectionRequestDto = exports.AttendancePunchDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class AttendancePunchDto {
    type;
    source;
    locationCoordinates;
}
exports.AttendancePunchDto = AttendancePunchDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['CHECK_IN', 'CHECK_OUT'] }),
    (0, class_validator_1.IsEnum)(['CHECK_IN', 'CHECK_OUT']),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AttendancePunchDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'PORTAL' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AttendancePunchDto.prototype, "source", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '37.7749,-122.4194' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AttendancePunchDto.prototype, "locationCoordinates", void 0);
class AttendanceCorrectionRequestDto {
    date;
    requestedCheckIn;
    requestedCheckOut;
    reason;
}
exports.AttendanceCorrectionRequestDto = AttendanceCorrectionRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-11-04' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AttendanceCorrectionRequestDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '09:00' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AttendanceCorrectionRequestDto.prototype, "requestedCheckIn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '18:00' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AttendanceCorrectionRequestDto.prototype, "requestedCheckOut", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Forgot badge during morning office network migration.' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AttendanceCorrectionRequestDto.prototype, "reason", void 0);
class AttendanceCorrectionDecisionDto {
    action;
    comments;
}
exports.AttendanceCorrectionDecisionDto = AttendanceCorrectionDecisionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['APPROVE', 'REJECT'] }),
    (0, class_validator_1.IsEnum)(['APPROVE', 'REJECT']),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AttendanceCorrectionDecisionDto.prototype, "action", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Approved after verification with IT team lead.' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AttendanceCorrectionDecisionDto.prototype, "comments", void 0);
//# sourceMappingURL=hrms-attendance.dto.js.map