import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../../database/database.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { UserRole } from '../../common/enums';
export declare class AuthService {
    private dbService;
    private jwtService;
    private readonly logger;
    private demoAccounts;
    constructor(dbService: DatabaseService, jwtService: JwtService);
    login(loginDto: LoginDto): Promise<AuthResponseDto>;
    register(registerDto: RegisterDto): Promise<AuthResponseDto>;
    getProfile(userId: string): Promise<{
        id: string;
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
