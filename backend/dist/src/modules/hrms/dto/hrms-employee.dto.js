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
exports.HrmsEmployeeQueryDto = exports.UpdateEmployeeStatusDto = exports.UpdateHrmsEmployeeDto = exports.CreateHrmsEmployeeDto = exports.EmploymentStatus = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var EmploymentStatus;
(function (EmploymentStatus) {
    EmploymentStatus["ACTIVE"] = "ACTIVE";
    EmploymentStatus["PROBATION"] = "PROBATION";
    EmploymentStatus["ON_LEAVE"] = "ON_LEAVE";
    EmploymentStatus["NOTICE_PERIOD"] = "NOTICE_PERIOD";
    EmploymentStatus["RESIGNED"] = "RESIGNED";
    EmploymentStatus["TERMINATED"] = "TERMINATED";
    EmploymentStatus["ARCHIVED"] = "ARCHIVED";
})(EmploymentStatus || (exports.EmploymentStatus = EmploymentStatus = {}));
class CreateHrmsEmployeeDto {
    firstName;
    lastName;
    email;
    personalEmail;
    phone;
    departmentId;
    designationId;
    managerId;
    jobTitle;
    employmentType;
    joiningDate;
    workLocation;
    status;
    roleCode;
    hasLoginAccount;
    initialPassword;
}
exports.CreateHrmsEmployeeDto = CreateHrmsEmployeeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'David' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateHrmsEmployeeDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Ross' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateHrmsEmployeeDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'david.ross@qclocker.io' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateHrmsEmployeeDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'david.personal@gmail.com' }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateHrmsEmployeeDto.prototype, "personalEmail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '+1-555-0144' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateHrmsEmployeeDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '10000000-0000-0000-0000-000000000001' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateHrmsEmployeeDto.prototype, "departmentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '30000000-0000-0000-0000-000000000001' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateHrmsEmployeeDto.prototype, "designationId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '00000000-0000-0000-0000-000000000001' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateHrmsEmployeeDto.prototype, "managerId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Senior Software Engineer' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateHrmsEmployeeDto.prototype, "jobTitle", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'FULL_TIME' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateHrmsEmployeeDto.prototype, "employmentType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-11-01' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateHrmsEmployeeDto.prototype, "joiningDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Headquarters' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateHrmsEmployeeDto.prototype, "workLocation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: EmploymentStatus, default: EmploymentStatus.ACTIVE }),
    (0, class_validator_1.IsEnum)(EmploymentStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateHrmsEmployeeDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'EMPLOYEE' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateHrmsEmployeeDto.prototype, "roleCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: true }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateHrmsEmployeeDto.prototype, "hasLoginAccount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateHrmsEmployeeDto.prototype, "initialPassword", void 0);
class UpdateHrmsEmployeeDto {
    firstName;
    lastName;
    personalEmail;
    phone;
    departmentId;
    designationId;
    managerId;
    jobTitle;
    workLocation;
    avatarUrl;
    status;
    changeReason;
}
exports.UpdateHrmsEmployeeDto = UpdateHrmsEmployeeDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateHrmsEmployeeDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateHrmsEmployeeDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateHrmsEmployeeDto.prototype, "personalEmail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateHrmsEmployeeDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateHrmsEmployeeDto.prototype, "departmentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateHrmsEmployeeDto.prototype, "designationId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateHrmsEmployeeDto.prototype, "managerId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateHrmsEmployeeDto.prototype, "jobTitle", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateHrmsEmployeeDto.prototype, "workLocation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateHrmsEmployeeDto.prototype, "avatarUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: EmploymentStatus }),
    (0, class_validator_1.IsEnum)(EmploymentStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateHrmsEmployeeDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateHrmsEmployeeDto.prototype, "changeReason", void 0);
class UpdateEmployeeStatusDto {
    status;
    reason;
    effectiveDate;
}
exports.UpdateEmployeeStatusDto = UpdateEmployeeStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: EmploymentStatus }),
    (0, class_validator_1.IsEnum)(EmploymentStatus),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateEmployeeStatusDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Employee successfully passed 90-day probationary evaluation.' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateEmployeeStatusDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateEmployeeStatusDto.prototype, "effectiveDate", void 0);
class HrmsEmployeeQueryDto {
    search;
    departmentId;
    designationId;
    managerId;
    status;
    location;
    page;
    limit;
}
exports.HrmsEmployeeQueryDto = HrmsEmployeeQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], HrmsEmployeeQueryDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], HrmsEmployeeQueryDto.prototype, "departmentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], HrmsEmployeeQueryDto.prototype, "designationId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], HrmsEmployeeQueryDto.prototype, "managerId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: EmploymentStatus }),
    (0, class_validator_1.IsEnum)(EmploymentStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], HrmsEmployeeQueryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], HrmsEmployeeQueryDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 1 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], HrmsEmployeeQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 20 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], HrmsEmployeeQueryDto.prototype, "limit", void 0);
//# sourceMappingURL=hrms-employee.dto.js.map