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
exports.AdminResetPasswordDto = exports.ResetPasswordDto = exports.VerifyChallengeDto = exports.ForgotPasswordDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class ForgotPasswordDto {
    email;
}
exports.ForgotPasswordDto = ForgotPasswordDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'employee@qclocker.io', description: 'Registered corporate email address' }),
    (0, class_validator_1.IsEmail)({}, { message: 'Must be a valid corporate email address' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Email address is required' }),
    __metadata("design:type", String)
], ForgotPasswordDto.prototype, "email", void 0);
class VerifyChallengeDto {
    token;
    answer1;
    answer2;
    recoveryCode;
    recoveryPassphrase;
    answers;
}
exports.VerifyChallengeDto = VerifyChallengeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Single-use cryptographic challenge token' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], VerifyChallengeDto.prototype, "token", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Answer to security question 1' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], VerifyChallengeDto.prototype, "answer1", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Answer to security question 2' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], VerifyChallengeDto.prototype, "answer2", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Personal recovery passphrase fallback' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], VerifyChallengeDto.prototype, "recoveryCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Personal recovery passphrase fallback alias' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], VerifyChallengeDto.prototype, "recoveryPassphrase", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Security question answers array' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], VerifyChallengeDto.prototype, "answers", void 0);
class ResetPasswordDto {
    token;
    newPassword;
}
exports.ResetPasswordDto = ResetPasswordDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Single-use verified reset challenge token' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'SecurePass@2026!#',
        description: 'Enterprise compliant password (min 12 chars, upper, lower, number, special char)',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(12, { message: 'Password must be at least 12 characters in length' }),
    (0, class_validator_1.Matches)(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{12,}$/, {
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special symbol',
    }),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "newPassword", void 0);
class AdminResetPasswordDto {
    requirePasswordChange;
}
exports.AdminResetPasswordDto = AdminResetPasswordDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: true, description: 'Force password change on next login' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], AdminResetPasswordDto.prototype, "requirePasswordChange", void 0);
//# sourceMappingURL=password-reset.dto.js.map