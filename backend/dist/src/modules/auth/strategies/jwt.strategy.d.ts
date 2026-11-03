import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../../../database/database.service';
export interface JwtPayload {
    sub: string;
    email: string;
    role: string;
    iat?: number;
    exp?: number;
}
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private dbService;
    constructor(configService: ConfigService, dbService: DatabaseService);
    validate(payload: JwtPayload): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
        departmentId: string | null;
        teamId: string | null;
        isActive: boolean;
    } | {
        id: string;
        email: string;
        role: string;
    }>;
}
export {};
