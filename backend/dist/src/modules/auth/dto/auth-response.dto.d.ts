export declare class AuthUserDto {
    id: string;
    referenceId?: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    departmentId?: string | null;
    teamId?: string | null;
    jobTitle?: string | null;
    avatarUrl?: string | null;
    permissions?: string[];
}
export declare class AuthResponseDto {
    accessToken: string;
    refreshToken?: string;
    expiresIn: number;
    user: AuthUserDto;
}
