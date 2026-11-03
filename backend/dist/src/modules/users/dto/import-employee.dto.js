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
exports.BulkImportConfirmDto = exports.ImportEmployeeRow = exports.BulkImportPreviewDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class BulkImportPreviewDto {
    csvContent;
}
exports.BulkImportPreviewDto = BulkImportPreviewDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Raw CSV text payload' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BulkImportPreviewDto.prototype, "csvContent", void 0);
class ImportEmployeeRow {
    employee_code;
    first_name;
    last_name;
    email;
    department;
    designation;
    manager_email;
    role;
    joining_date;
    employment_type;
    work_location;
}
exports.ImportEmployeeRow = ImportEmployeeRow;
class BulkImportConfirmDto {
    employees;
}
exports.BulkImportConfirmDto = BulkImportConfirmDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'List of validated employee records to persist' }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], BulkImportConfirmDto.prototype, "employees", void 0);
//# sourceMappingURL=import-employee.dto.js.map