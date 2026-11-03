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
exports.WorkLogQueryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class WorkLogQueryDto {
    employeeId;
    logDate;
    taskId;
    ticketId;
}
exports.WorkLogQueryDto = WorkLogQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by employee UUID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], WorkLogQueryDto.prototype, "employeeId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by date YYYY-MM-DD' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], WorkLogQueryDto.prototype, "logDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by linked task UUID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], WorkLogQueryDto.prototype, "taskId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by linked ticket UUID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], WorkLogQueryDto.prototype, "ticketId", void 0);
//# sourceMappingURL=work-log-query.dto.js.map