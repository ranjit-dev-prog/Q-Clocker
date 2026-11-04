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
exports.ReportQueryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class ReportQueryDto {
    startDate;
    endDate;
    departmentId;
    reportType;
    format;
}
exports.ReportQueryDto = ReportQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter start date ISO string', example: '2026-10-01T00:00:00Z' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ReportQueryDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter end date ISO string', example: '2026-11-04T23:59:59Z' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ReportQueryDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by Department UUID' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ReportQueryDto.prototype, "departmentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['itsm', 'workforce', 'audit'], default: 'itsm' }),
    (0, class_validator_1.IsIn)(['itsm', 'workforce', 'audit']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ReportQueryDto.prototype, "reportType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['json', 'xlsx', 'csv'], default: 'json' }),
    (0, class_validator_1.IsIn)(['json', 'xlsx', 'csv']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ReportQueryDto.prototype, "format", void 0);
//# sourceMappingURL=report-query.dto.js.map