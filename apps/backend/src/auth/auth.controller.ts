import {
    BadRequestException,
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    HttpStatus,
    Post,
    Query,
    Req,
    Res,
    UnauthorizedException,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { Tokens } from './interfaces';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { Cookie, Public, UserAgent } from '@common/decorators';
import { GoogleGuard } from './guards/google.guard';
import { Provider } from '@prisma/client';
import { TokenService } from './token.service';
import { COOKIE } from 'src/constants';
import { ResponseUserWithTokens } from './responses';
import { ApiOkResponse } from '@nestjs/swagger';

@Public()
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
        private readonly tokenService: TokenService,
    ) {}

    @Post('credentials/register')
    async CredentialsRegister(@Body() dto: RegisterDto) {
        const user = await this.authService.register(dto);
        if (!user) {
            throw new BadRequestException(
                `Can't registrate user ${JSON.stringify(dto)}`,
            );
        }
    }

    @Post('credentials/login')
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiOkResponse({
        type: ResponseUserWithTokens,
    })
    async credentialsLogin(
        @Body() dto: LoginDto,
        @UserAgent() agent: string,
    ): Promise<ResponseUserWithTokens> {
        console.log(dto);
        const userWithTokens = await this.authService.autorize(
            dto,
            agent,
            Provider.CREDENTIALS,
        );
        if (!userWithTokens) {
            throw new BadRequestException(`Can't login user`);
        }

        return new ResponseUserWithTokens(
            userWithTokens.user,
            userWithTokens.tokens,
        );
    }

    @Get('logout')
    async logout(
        @Cookie(COOKIE.REFRESH_TOKEN) refreshTokens: string,
        @Res() res: Response,
    ) {
        if (!refreshTokens) {
            res.sendStatus(HttpStatus.OK);
            return;
        }
        await this.tokenService.deleteRefreshToken(refreshTokens);
        res.cookie(COOKIE.REFRESH_TOKEN, '', {
            httpOnly: true,
            expires: new Date(),
            secure: true,
        });
        res.sendStatus(HttpStatus.OK);
    }

    @Get('refresh-tokens')
    async refreshTokens(
        @Cookie(COOKIE.REFRESH_TOKEN) refreshTokens: string,
        @Res() res: Response,
        @UserAgent() agent: string,
    ) {
        if (!refreshTokens) {
            throw new UnauthorizedException();
        }
        const tokens = await this.tokenService.refreshToken(
            refreshTokens,
            agent,
        );
        if (!tokens) {
            throw new UnauthorizedException("Can't update refresh token");
        }
        this.setTokensToCookies(tokens, res);
    }

    private setTokensToCookies(tokens: Tokens, res: Response) {
        if (!tokens) {
            throw new UnauthorizedException();
        }
        res.cookie(COOKIE.REFRESH_TOKEN, tokens.refreshToken.token, {
            httpOnly: true,
            sameSite: 'lax',
            expires: new Date(tokens.refreshToken.exp),
            secure:
                this.configService.get('NODE_ENV', 'development') ===
                'production',
            path: '/',
        });

        const accessToken = this.tokenService.getDataFromAccessToken(
            tokens.accessToken,
        );

        res.cookie(COOKIE.ACCESS_TOKEN, tokens.accessToken, {
            httpOnly: true,
            sameSite: 'lax',
            expires: new Date(new Date().getTime() + accessToken.exp),
            secure:
                this.configService.get('NODE_ENV', 'development') ===
                'production',
            path: '/',
        });
        res.status(HttpStatus.CREATED).send();
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
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiOkResponse({
        type: ResponseUserWithTokens,
    })
    async successGoogleAuth(
        @Query('token') token: string,
        @UserAgent() agent: string,
    ): Promise<ResponseUserWithTokens> {
        const userWithTokens = await this.authService.autorize(
            token,
            agent,
            Provider.GOOGLE,
        );

        return new ResponseUserWithTokens(
            userWithTokens.user,
            userWithTokens.tokens,
        );
    }
}
