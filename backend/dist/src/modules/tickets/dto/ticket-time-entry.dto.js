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
exports.StartTicketTimerDto = exports.CreateTicketTimeEntryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateTicketTimeEntryDto {
    durationMinutes;
    notes;
}
exports.CreateTicketTimeEntryDto = CreateTicketTimeEntryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Duration in minutes spent on this triage/fix session', example: 45 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(1440),
    __metadata("design:type", Number)
], CreateTicketTimeEntryDto.prototype, "durationMinutes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Technical notes on the work performed during this session' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTicketTimeEntryDto.prototype, "notes", void 0);
class StartTicketTimerDto {
    notes;
}
exports.StartTicketTimerDto = StartTicketTimerDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Optional initial task/session notes' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], StartTicketTimerDto.prototype, "notes", void 0);
//# sourceMappingURL=ticket-time-entry.dto.js.map