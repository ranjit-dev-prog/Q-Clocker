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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DesignationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const designations_service_1 = require("./designations.service");
const create_designation_dto_1 = require("./dto/create-designation.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const enums_1 = require("../../common/enums");
let DesignationsController = class DesignationsController {
    designationsService;
    constructor(designationsService) {
        this.designationsService = designationsService;
    }
    async findAll() {
        return this.designationsService.findAll();
    }
    async findOne(id) {
        return this.designationsService.findOne(id);
    }
    async create(dto) {
        return this.designationsService.create(dto);
    }
};
exports.DesignationsController = DesignationsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all company designations and job profiles' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of designations' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DesignationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get designation details by UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Designation details' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DesignationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN, enums_1.UserRole.HR_MANAGER),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new corporate designation' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Designation created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_designation_dto_1.CreateDesignationDto]),
    __metadata("design:returntype", Promise)
], DesignationsController.prototype, "create", null);
exports.DesignationsController = DesignationsController = __decorate([
    (0, swagger_1.ApiTags)('Designations'),
    (0, common_1.Controller)('designations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [designations_service_1.DesignationsService])
], DesignationsController);
//# sourceMappingURL=designations.controller.js.map