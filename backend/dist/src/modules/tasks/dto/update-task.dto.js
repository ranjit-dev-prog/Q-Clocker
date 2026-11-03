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
exports.UpdateTaskStatusDto = exports.UpdateTaskDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_task_dto_1 = require("./create-task.dto");
const class_validator_1 = require("class-validator");
const enums_1 = require("../../../common/enums");
class UpdateTaskDto extends (0, swagger_1.PartialType)(create_task_dto_1.CreateTaskDto) {
    status;
    completionPercentage;
    actualHours;
    reviewFeedback;
}
exports.UpdateTaskDto = UpdateTaskDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: enums_1.TaskStatus }),
    (0, class_validator_1.IsEnum)(enums_1.TaskStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateTaskDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Completion percentage 0 to 100', minimum: 0, maximum: 100 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateTaskDto.prototype, "completionPercentage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Actual hours logged' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateTaskDto.prototype, "actualHours", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Review feedback from manager or peer' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateTaskDto.prototype, "reviewFeedback", void 0);
class UpdateTaskStatusDto {
    status;
    completionPercentage;
    actualHours;
    feedback;
}
exports.UpdateTaskStatusDto = UpdateTaskStatusDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: enums_1.TaskStatus }),
    (0, class_validator_1.IsEnum)(enums_1.TaskStatus),
    __metadata("design:type", String)
], UpdateTaskStatusDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Updated completion percentage' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateTaskStatusDto.prototype, "completionPercentage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Actual hours added or logged' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateTaskStatusDto.prototype, "actualHours", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Review feedback or transition note' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateTaskStatusDto.prototype, "feedback", void 0);
//# sourceMappingURL=update-task.dto.js.map