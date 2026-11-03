import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../../database/database.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UserRole } from '../../common/enums';
export declare class AuthService {
    private dbService;
    private jwtService;
    private readonly logger;
    private demoAccounts;
    private demoSessions;
    constructor(dbService: DatabaseService, jwtService: JwtService);
    login(loginDto: LoginDto, meta?: {
        ipAddress?: string;
        userAgent?: string;
    }): Promise<AuthResponseDto>;
    register(registerDto: RegisterDto, meta?: {
        ipAddress?: string;
        userAgent?: string;
    }): Promise<AuthResponseDto>;
    refreshToken(dto: RefreshTokenDto, meta?: {
        ipAddress?: string;
        userAgent?: string;
    }): Promise<AuthResponseDto>;
    logout(userId: string, refreshToken?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    logoutAll(userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getActiveSessions(userId: string): Promise<{
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
        role: UserRole;
        departmentId: string | null;
        teamId: null;
        jobTitle: string;
        isActive: boolean;
        createdAt: string;
    }>;
    private generateAuthResponse;
}
