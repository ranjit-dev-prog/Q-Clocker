export declare class AuthUserDto {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    departmentId?: string | null;
    jobTitle?: string | null;
    avatarUrl?: string | null;
}
export declare class AuthResponseDto {
    accessToken: string;
    expiresIn: number;
    user: AuthUserDto;
}
