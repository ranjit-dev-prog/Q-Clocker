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
exports.CreateTaskFromTicketDto = exports.LinkExistingTaskDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const enums_1 = require("../../../common/enums");
class LinkExistingTaskDto {
    taskId;
}
exports.LinkExistingTaskDto = LinkExistingTaskDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'UUID of the existing task to link to this ticket' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], LinkExistingTaskDto.prototype, "taskId", void 0);
class CreateTaskFromTicketDto {
    title;
    description;
    priority;
    assignedEmployeeId;
    startDate;
    dueDate;
    estimatedHours;
}
exports.CreateTaskFromTicketDto = CreateTaskFromTicketDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Task title', example: 'Replace faulty memory module on db-node-02' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTaskFromTicketDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Detailed work instructions' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTaskFromTicketDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: enums_1.Priority, default: enums_1.Priority.MEDIUM }),
    (0, class_validator_1.IsEnum)(enums_1.Priority),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTaskFromTicketDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Assigned employee UUID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTaskFromTicketDto.prototype, "assignedEmployeeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Scheduled start date', example: '2026-11-03T09:00:00Z' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateTaskFromTicketDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Due date deadline', example: '2026-11-05T18:00:00Z' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateTaskFromTicketDto.prototype, "dueDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Estimated hours', default: 4 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.5),
    (0, class_validator_1.Max)(1000),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateTaskFromTicketDto.prototype, "estimatedHours", void 0);
//# sourceMappingURL=ticket-task-link.dto.js.map