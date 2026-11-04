"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LifecycleModule = void 0;
const common_1 = require("@nestjs/common");
const lifecycle_service_1 = require("./lifecycle.service");
const lifecycle_controller_1 = require("./lifecycle.controller");
const notifications_module_1 = require("../notifications/notifications.module");
let LifecycleModule = class LifecycleModule {
};
exports.LifecycleModule = LifecycleModule;
exports.LifecycleModule = LifecycleModule = __decorate([
    (0, common_1.Module)({
        imports: [notifications_module_1.NotificationsModule],
        controllers: [lifecycle_controller_1.LifecycleController],
        providers: [lifecycle_service_1.LifecycleService],
        exports: [lifecycle_service_1.LifecycleService],
    })
], LifecycleModule);
//# sourceMappingURL=lifecycle.module.js.map