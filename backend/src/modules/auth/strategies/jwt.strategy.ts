import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../../../database/database.service';
import * as schema from '../../../database/schema';
import { eq } from 'drizzle-orm';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private dbService: DatabaseService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_SECRET') ||
        'q_clocker_super_secure_jwt_secret_key_2026_enterprise_secure',
    });
  }

  async validate(payload: JwtPayload) {
    if (!this.dbService.getConnectionStatus()) {
      // In offline/mock mode if db disconnected, validate based on payload
      return {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
      };
    }

    const [user] = await this.dbService.db
      .select({
        id: schema.users.id,
        email: schema.users.email,
        firstName: schema.users.firstName,
        lastName: schema.users.lastName,
        role: schema.users.roleCode,
        departmentId: schema.users.departmentId,
        teamId: schema.users.teamId,
        isActive: schema.users.isActive,
      })
      .from(schema.users)
      .where(eq(schema.users.id, payload.sub))
      .limit(1);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User account is deactivated or not found');
    }

    return user;
  }
}
