import {
    BadRequestException,
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    Post,
    Query,
    UnauthorizedException,
    UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { Public, UserAgent } from '@common/decorators';
import { Provider } from '@prisma/client';
import { TokenService } from './token.service';
import { ResponseUserWithTokens } from './responses';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Tokens } from './interfaces';

@ApiTags('Auth')
@Public()
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
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
        // console.log(dto);
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
    async logout(@Query('refreshToken') refreshToken: string) {
        if (!refreshToken) {
            throw new BadRequestException('refreshToken is required');
        }
        await this.tokenService.deleteRefreshToken(refreshToken);
    }

    @Get('refresh-tokens')
    @ApiOkResponse({
        type: Tokens,
    })
    async refreshTokens(
        @Query('refreshToken') refreshToken: string,
        @UserAgent() agent: string,
    ) {
        console.log(refreshToken);
        if (!refreshToken) {
            throw new UnauthorizedException();
        }
        const tokens = await this.tokenService.refreshToken(
            refreshToken,
            agent,
        );
        if (!tokens) {
            throw new UnauthorizedException("Can't update refresh token");
        }
        return tokens;
    }

    @Get('google')
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiOkResponse({
        type: ResponseUserWithTokens,
    })
    async GoogleAuth(
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
