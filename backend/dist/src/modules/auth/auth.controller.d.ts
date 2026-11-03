import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto, req: Request): Promise<AuthResponseDto>;
    register(registerDto: RegisterDto, req: Request): Promise<AuthResponseDto>;
    refresh(dto: RefreshTokenDto, req: Request): Promise<AuthResponseDto>;
    logout(userId: string, body: {
        refreshToken?: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    logoutAll(userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getSessions(userId: string): Promise<{
        id: string;
        userAgent: string | null;
        ipAddress: string | null;
        expiresAt: Date;
        createdAt: Date;
    }[]>;
    getProfile(userId: string): Promise<{
        id: string;
        referenceId: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        avatarUrl: string | null;
        role: string;
        departmentId: string | null;
        teamId: string | null;
        jobTitle: string | null;
        isActive: boolean;
        createdAt: Date;
    } | {
        id: string;
        referenceId: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string;
        avatarUrl: null;
        role: import("../../common/enums").UserRole;
        departmentId: string | null;
        teamId: null;
        jobTitle: string;
        isActive: boolean;
        createdAt: string;
    }>;
}
