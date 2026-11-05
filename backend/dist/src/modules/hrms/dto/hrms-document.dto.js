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
exports.VerifyDocumentDto = exports.UploadDocumentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UploadDocumentDto {
    employeeId;
    category;
    title;
    fileName;
    fileSize;
    mimeType;
    fileUrl;
    expiresAt;
}
exports.UploadDocumentDto = UploadDocumentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '00000000-0000-0000-0000-000000000004' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UploadDocumentDto.prototype, "employeeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ['RESUME', 'APPOINTMENT_LETTER', 'EMPLOYMENT_AGREEMENT', 'NDA', 'IDENTITY_DOCUMENT', 'EDUCATION_CERTIFICATE', 'EXPERIENCE_LETTER', 'OTHER'],
    }),
    (0, class_validator_1.IsEnum)(['RESUME', 'APPOINTMENT_LETTER', 'EMPLOYMENT_AGREEMENT', 'NDA', 'IDENTITY_DOCUMENT', 'EDUCATION_CERTIFICATE', 'EXPERIENCE_LETTER', 'OTHER']),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UploadDocumentDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Passport / National Identity Document' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UploadDocumentDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'david_ross_passport.pdf' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UploadDocumentDto.prototype, "fileName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1048576 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UploadDocumentDto.prototype, "fileSize", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'application/pdf' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UploadDocumentDto.prototype, "mimeType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://storage.qclocker.io/docs/emp-004/passport.pdf' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UploadDocumentDto.prototype, "fileUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2030-12-31' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UploadDocumentDto.prototype, "expiresAt", void 0);
class VerifyDocumentDto {
    status;
    notes;
}
exports.VerifyDocumentDto = VerifyDocumentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['VERIFIED', 'REJECTED'] }),
    (0, class_validator_1.IsEnum)(['VERIFIED', 'REJECTED']),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], VerifyDocumentDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Verified authentic by HR compliance audit.' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], VerifyDocumentDto.prototype, "notes", void 0);
//# sourceMappingURL=hrms-document.dto.js.map