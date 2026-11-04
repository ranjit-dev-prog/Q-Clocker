import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
  Query,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import {
  ForgotPasswordDto,
  VerifyChallengeDto,
  ResetPasswordDto,
  AdminResetPasswordDto,
} from './dto/password-reset.dto';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserRole } from '../../common/enums';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate user with corporate credentials' })
  @ApiResponse({
    status: 200,
    description: 'Successfully authenticated, returns JWT token and user profile',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials or inactive account' })
  async login(@Body() loginDto: LoginDto, @Req() req: Request): Promise<AuthResponseDto> {
    const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket?.remoteAddress;
    const userAgent = req.headers['user-agent'];
    return this.authService.login(loginDto, { ipAddress, userAgent });
  }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new employee account' })
  @ApiResponse({
    status: 201,
    description: 'Account registered successfully',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async register(@Body() registerDto: RegisterDto, @Req() req: Request): Promise<AuthResponseDto> {
    const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket?.remoteAddress;
    const userAgent = req.headers['user-agent'];
    return this.authService.register(registerDto, { ipAddress, userAgent });
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rotate refresh token and issue new token pair' })
  @ApiResponse({
    status: 200,
    description: 'New access token and rotated refresh token',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid or revoked refresh token' })
  async refresh(@Body() dto: RefreshTokenDto, @Req() req: Request): Promise<AuthResponseDto> {
    const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket?.remoteAddress;
    const userAgent = req.headers['user-agent'];
    return this.authService.refreshToken(dto, { ipAddress, userAgent });
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log out user and revoke current session' })
  @ApiResponse({ status: 200, description: 'Session successfully revoked' })
  async logout(
    @CurrentUser('id') userId: string,
    @Body() body: { refreshToken?: string },
  ) {
    return this.authService.logout(userId, body?.refreshToken);
  }

  @Post('logout-all')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Revoke all active sessions for current user' })
  @ApiResponse({ status: 200, description: 'All user sessions revoked' })
  async logoutAll(@CurrentUser('id') userId: string) {
    return this.authService.logoutAll(userId);
  }

  @Get('sessions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all active sessions for current user' })
  @ApiResponse({ status: 200, description: 'List of active sessions' })
  async getSessions(@CurrentUser('id') userId: string) {
    return this.authService.getActiveSessions(userId);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user profile' })
  @ApiResponse({ status: 200, description: 'Returns active user profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@CurrentUser('id') userId: string) {
    return this.authService.getProfile(userId);
  }
}
