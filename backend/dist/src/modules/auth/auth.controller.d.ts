import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
        role: import("../../common/enums").UserRole;
        departmentId: string | null;
        teamId: null;
        jobTitle: string;
        isActive: boolean;
        createdAt: string;
    }>;
}
