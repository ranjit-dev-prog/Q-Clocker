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
exports.TaxDeclarationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class TaxDeclarationDto {
    financialYear;
    regime;
    section80c;
    section80d;
    hraRentPaid;
    homeLoanInterest;
    otherExemptions;
}
exports.TaxDeclarationDto = TaxDeclarationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-2027', description: 'Financial year assessment period' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], TaxDeclarationDto.prototype, "financialYear", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['NEW', 'OLD'], default: 'NEW' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], TaxDeclarationDto.prototype, "regime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Section 80C investments (ELSS, PF, Life Insurance)' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], TaxDeclarationDto.prototype, "section80c", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Section 80D medical health insurance premium' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], TaxDeclarationDto.prototype, "section80d", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Annual rent paid for HRA tax exemption' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], TaxDeclarationDto.prototype, "hraRentPaid", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Home loan interest deduction (Section 24)' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], TaxDeclarationDto.prototype, "homeLoanInterest", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Other permissible deductions and donations' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], TaxDeclarationDto.prototype, "otherExemptions", void 0);
//# sourceMappingURL=payroll.dto.js.map