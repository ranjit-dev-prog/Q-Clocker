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
exports.CreateUserDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const enums_1 = require("../../../common/enums");
class CreateUserDto {
    employeeCode;
    email;
    personalEmail;
    password;
    firstName;
    lastName;
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
    sendInvitation;
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'EMP001', description: 'Internal employee badge / payroll code' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "employeeCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'jane.doe@qclocker.io', description: 'Official corporate email' }),
    (0, class_validator_1.IsEmail)({}, { message: 'Please provide a valid corporate email address' }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'jane.personal@gmail.com', description: 'Personal email address' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "personalEmail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'P@ssword2026!', description: 'Initial password (min 8 chars, optional if invitation enabled)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8, { message: 'Password must be at least 8 characters long' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Jane', description: 'First name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Doe', description: 'Last name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '+1-555-0199', description: 'Contact phone number' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: enums_1.UserRole, example: enums_1.UserRole.EMPLOYEE, description: 'Role assigned' }),
    (0, class_validator_1.IsEnum)(enums_1.UserRole),
    __metadata("design:type", String)
], CreateUserDto.prototype, "roleCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Department UUID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "departmentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Team UUID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "teamId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Designation UUID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "designationId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Assigned Reporting Manager UUID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "managerId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Frontend Architect', description: 'Official Job Title' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "jobTitle", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: enums_1.EmploymentType, default: enums_1.EmploymentType.FULL_TIME }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enums_1.EmploymentType),
    __metadata("design:type", String)
], CreateUserDto.prototype, "employmentType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-11-01', description: 'Joining date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "joiningDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Headquarters', description: 'Work location / office or remote' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "workLocation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: true, description: 'Whether to create an active user login account' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateUserDto.prototype, "hasLoginAccount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: false, description: 'Send secure email invitation with activation token' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateUserDto.prototype, "sendInvitation", void 0);
//# sourceMappingURL=create-user.dto.js.map