import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma/prisma.service';
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
    private prisma;
    constructor(configService: ConfigService, prisma: PrismaService);
    validate(payload: JwtPayload): Promise<{
        id: string;
        email: string;
        role: string;
        firstName?: undefined;
        lastName?: undefined;
        departmentId?: undefined;
        teamId?: undefined;
        isActive?: undefined;
    } | {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
        departmentId: string | null;
        teamId: string | null;
        isActive: true;
    }>;
}
export {};
