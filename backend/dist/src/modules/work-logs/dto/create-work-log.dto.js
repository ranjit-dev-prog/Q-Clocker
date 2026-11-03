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
exports.CreateWorkLogDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateWorkLogDto {
    taskId;
    ticketId;
    logDate;
    startTime;
    endTime;
    totalHours;
    workDescription;
    investigationPerformed;
    actionsTaken;
    challengesFaced;
}
exports.CreateWorkLogDto = CreateWorkLogDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Linked Task UUID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateWorkLogDto.prototype, "taskId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Linked Ticket UUID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateWorkLogDto.prototype, "ticketId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Log date in YYYY-MM-DD format', example: '2026-11-03' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^\d{4}-\d{2}-\d{2}$/, { message: 'logDate must be in format YYYY-MM-DD' }),
    __metadata("design:type", String)
], CreateWorkLogDto.prototype, "logDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Start time in 24h format HH:mm', example: '09:00' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^\d{2}:\d{2}$/, { message: 'startTime must be in HH:mm format' }),
    __metadata("design:type", String)
], CreateWorkLogDto.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'End time in 24h format HH:mm', example: '13:00' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^\d{2}:\d{2}$/, { message: 'endTime must be in HH:mm format' }),
    __metadata("design:type", String)
], CreateWorkLogDto.prototype, "endTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total hours logged', example: 4.0 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.1),
    (0, class_validator_1.Max)(24),
    __metadata("design:type", Number)
], CreateWorkLogDto.prototype, "totalHours", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Primary work description and deliverables' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateWorkLogDto.prototype, "workDescription", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Technical investigation or root-cause diagnostics performed' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateWorkLogDto.prototype, "investigationPerformed", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Specific engineering actions, commits, or changes taken' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateWorkLogDto.prototype, "actionsTaken", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Impediments, blockers or challenges faced' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateWorkLogDto.prototype, "challengesFaced", void 0);
//# sourceMappingURL=create-work-log.dto.js.map