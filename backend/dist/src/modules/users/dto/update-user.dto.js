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
exports.UpdateUserDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const enums_1 = require("../../../common/enums");
class UpdateUserDto {
    employeeCode;
    firstName;
    lastName;
    personalEmail;
    phone;
    roleCode;
    departmentId;
    teamId;
    designationId;
    managerId;
    jobTitle;
    employmentType;
    joiningDate;
    workLocation;
    hasLoginAccount;
    accountStatus;
    isActive;
}
exports.UpdateUserDto = UpdateUserDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'EMP001', description: 'Employee badge code' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "employeeCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Jane', description: 'First name' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Doe', description: 'Last name' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'jane.personal@gmail.com' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "personalEmail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '+1-555-0199', description: 'Phone number' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: enums_1.UserRole, example: enums_1.UserRole.TEAM_LEAD, description: 'Role assigned' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enums_1.UserRole),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "roleCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Department UUID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "departmentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Team UUID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "teamId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Designation UUID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "designationId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Assigned Manager UUID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "managerId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Lead Software Architect', description: 'Job Title' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "jobTitle", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: enums_1.EmploymentType }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enums_1.EmploymentType),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "employmentType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-11-01' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "joiningDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Headquarters' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "workLocation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true, description: 'Login account enabled' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateUserDto.prototype, "hasLoginAccount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: enums_1.AccountStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enums_1.AccountStatus),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "accountStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true, description: 'Active status' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateUserDto.prototype, "isActive", void 0);
//# sourceMappingURL=update-user.dto.js.map