"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
async function bootstrap() {
    const logger = new common_1.Logger('QClockerBootstrap');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const apiPrefix = process.env.API_PREFIX || 'api/v1';
    app.setGlobalPrefix(apiPrefix);
    app.enableCors({
        origin: [
            process.env.FRONTEND_URL || 'http://localhost:4200',
            'http://localhost:3000',
            'http://localhost:8080',
        ],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Q Clocker Enterprise API')
        .setDescription('REST API Documentation for Q Clocker - Employee Task Management, IT Ticketing and Performance Tracking System')
        .setVersion('1.0.0')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter your Bearer JWT Token',
        in: 'header',
    }, 'bearer')
        .addTag('Authentication', 'User authentication, registration and profile retrieval')
        .addTag('Employees', 'Employee and user management across organization')
        .addTag('Departments', 'Organizational departments and team hierarchy')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
        customSiteTitle: 'Q Clocker API Docs',
        swaggerOptions: {
            persistAuthorization: true,
            docExpansion: 'list',
        },
    });
    const port = process.env.PORT || 3000;
    await app.listen(port);
    logger.log(`🚀 Q Clocker Backend REST API running at: http://localhost:${port}/${apiPrefix}`);
    logger.log(`📚 Swagger API Documentation available at: http://localhost:${port}/api/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map