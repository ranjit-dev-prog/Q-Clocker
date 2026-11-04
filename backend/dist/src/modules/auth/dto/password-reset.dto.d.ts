export declare class ForgotPasswordDto {
    email: string;
}
export declare class VerifyChallengeDto {
    token: string;
    answer1?: string;
    answer2?: string;
    recoveryCode?: string;
    recoveryPassphrase?: string;
    answers?: Array<{
        questionId: string;
        answer: string;
    }>;
}
export declare class ResetPasswordDto {
    token: string;
    newPassword: string;
}
export declare class AdminResetPasswordDto {
    requirePasswordChange?: boolean;
}
