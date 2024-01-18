import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpStatus,
    Post,
    Res,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { Tokens } from './interfaces';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { Cookie, Public, UserAgent } from '@common/decorators';

const REFRESH_TOKEN = 'refreshtoken';

@Public()
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
    ) {}
    @Post('register')
    async register(@Body() dto: RegisterDto) {
        const user = await this.authService.register(dto);
        if (!user) {
            throw new BadRequestException(
                `Can't registrate user ${JSON.stringify(dto)}`,
            );
        }
    }

    @Post('login')
    async login(
        @Body() dto: LoginDto,
        @Res() res: Response,
        @UserAgent() agent: string,
    ) {
        const tokens = await this.authService.login(dto, agent);
        if (!tokens) {
            throw new BadRequestException(`Can't login user`);
        }

        this.SetRefreshTokenToCookies(tokens, res);
    }

    @Get('refresh-tokens')
    async refreshTokens(
        @Cookie(REFRESH_TOKEN) refreshTokens: string,
        @Res() res: Response,
        @UserAgent() agent: string,
    ) {
        if (!refreshTokens) {
            throw new UnauthorizedException();
        }
        const tokens = await this.authService.refreshToken(
            refreshTokens,
            agent,
        );
        if (!tokens) {
            throw new UnauthorizedException("Can't update refresh token");
        }
        this.SetRefreshTokenToCookies(tokens, res);
    }

    private SetRefreshTokenToCookies(tokens: Tokens, res: Response) {
        if (!tokens) {
            throw new UnauthorizedException();
        }
        res.cookie(REFRESH_TOKEN, tokens.refreshToken.token, {
            httpOnly: true,
            sameSite: 'lax',
            expires: new Date(tokens.refreshToken.exp),
            secure:
                this.configService.get('NODE_ENV', 'development') ===
                'production',
            path: '/',
        });
        res.status(HttpStatus.CREATED).json({
            accessToken: 'Bearer ' + tokens.accessToken,
        });
    }
}
