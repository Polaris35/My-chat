import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpStatus,
    Post,
    Query,
    Req,
    Res,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { Tokens } from './interfaces';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { Cookie, Public, UserAgent } from '@common/decorators';
import { GoogleGuard } from './guards/google.guard';
import { Provider } from '@prisma/client';

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
        const tokens = await this.authService.autorizeWithCredentials(
            dto,
            agent,
        );
        if (!tokens) {
            throw new BadRequestException(`Can't login user`);
        }

        this.setRefreshTokenToCookies(tokens, res);
    }

    @Get('logout')
    async logout(
        @Cookie(REFRESH_TOKEN) refreshTokens: string,
        @Res() res: Response,
    ) {
        if (!refreshTokens) {
            res.sendStatus(HttpStatus.OK);
            return;
        }
        await this.authService.deleteRefreshToken(refreshTokens);
        res.cookie(REFRESH_TOKEN, '', {
            httpOnly: true,
            expires: new Date(),
            secure: true,
        });
        res.sendStatus(HttpStatus.OK);
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
        this.setRefreshTokenToCookies(tokens, res);
    }

    private setRefreshTokenToCookies(tokens: Tokens, res: Response) {
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

    @UseGuards(GoogleGuard)
    @Get('google')
    googleAuth() {}

    @UseGuards(GoogleGuard)
    @Get('google/callback')
    googleAuthCallback(@Req() req: Request) {
        const token = req.user['accessToken'];
        return token;
    }

    @Get('google/success')
    async successGoogleAuth(
        @Query('token') token: string,
        @UserAgent() agent: string,
        @Res() res: Response,
    ) {
        const tokens = await this.authService.autorizeWithProvider(
            token,
            agent,
            Provider.google,
        );
        this.setRefreshTokenToCookies(tokens, res);
    }
}
