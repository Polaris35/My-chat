import {
    BadRequestException,
    ConflictException,
    Injectable,
    Logger,
    UnauthorizedException,
} from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto';
import { UsersService } from '@users/users.service';
import { Tokens } from './interfaces';
import { compareSync } from 'bcrypt';
import { Provider, Token, User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@prisma/prisma.service';
import { add } from 'date-fns';
import { v4 } from 'uuid';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { GoogleRensponse } from './responses';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    constructor(
        private readonly userService: UsersService,
        private readonly jwtSevice: JwtService,
        private readonly prismaService: PrismaService,
        private readonly httpService: HttpService,
    ) {}

    async register(dto: RegisterDto) {
        const user: User = await this.userService
            .findByEmail(dto.email)
            .catch((err) => {
                this.logger.error(err);
                return null;
            });
        if (user) {
            throw new ConflictException('user with this email exist');
        }
        const dtoWithProvider = { ...dto, provider: Provider.credentials };
        return this.userService.save(dtoWithProvider).catch((err) => {
            this.logger.error(err);
            return null;
        });
    }
    async autorizeWithCredentials(
        dto: LoginDto,
        agent: string,
    ): Promise<Tokens> {
        const user: User = await this.userService
            .findByEmail(dto.email)
            .catch((err) => {
                this.logger.error(err);
                return null;
            });
        if (!user || compareSync(user.password, dto.password)) {
            throw new UnauthorizedException('Incorrect login or password');
        }

        return this.generateTokens(user, agent);
    }

    async refreshToken(refreshTokens: string, agent: string): Promise<Tokens> {
        const token = await this.prismaService.token.findUnique({
            where: {
                token: refreshTokens,
            },
        });

        if (!token) {
            throw new UnauthorizedException();
        }

        await this.prismaService.token.delete({
            where: {
                token: refreshTokens,
            },
        });
        if (new Date(token.exp) < new Date()) {
            throw new UnauthorizedException();
        }

        const user = await this.userService.findById(token.userId);
        return this.generateTokens(user, agent);
    }

    private async generateTokens(user: User, agent: string): Promise<Tokens> {
        const accessToken = this.jwtSevice.sign({
            id: user.id,
            email: user.email,
        });
        const refreshToken = await this.getRefreshToken(user.id, agent);

        return { accessToken, refreshToken };
    }

    private async getRefreshToken(
        userId: number,
        agent: string,
    ): Promise<Token> {
        const _token = await this.prismaService.token.findFirst({
            where: {
                userId,
                userAgent: agent,
            },
        });

        const token = _token?.token ?? '';
        return this.prismaService.token.upsert({
            where: { token },
            update: {
                token: v4(),
                exp: add(new Date(), { months: 1 }),
            },
            create: {
                token: v4(),
                exp: add(new Date(), { months: 1 }),
                userId,
                userAgent: agent,
            },
        });
    }
    deleteRefreshToken(token: string) {
        return this.prismaService.token.delete({
            where: { token },
        });
    }

    async autorizeWithProvider(
        token: string,
        agent: string,
        provider: Provider,
    ) {
        if (await !this.checkTokenValidity(token)) {
            throw new UnauthorizedException('invalid token');
        }

        const googleData = await this.getUserData(token);

        const existUser = await this.userService.findByEmail(googleData.email);
        if (existUser) {
            if (existUser.provider === provider) {
                return this.generateTokens(existUser, agent);
            }
            // переписать описание ошибки
            throw new UnauthorizedException('user with this email exist');
        }

        const newUser = await this.userService.save({
            name: googleData.name,
            email: googleData.email,
            image: googleData.picture,
            provider,
        });

        return this.generateTokens(newUser, agent);
    }

    async checkTokenValidity(accessToken: string): Promise<boolean> {
        try {
            const response = await firstValueFrom(
                this.httpService.get(
                    `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`,
                ),
            );
            return response.status === 200;
        } catch (error) {
            console.error('Error checking token validity: ', error);
            return false;
        }
    }

    async getUserData(accessToken: string): Promise<GoogleRensponse> {
        try {
            const response = await firstValueFrom(
                this.httpService.get(
                    `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`,
                ),
            );
            return new GoogleRensponse(response.data);
        } catch (error) {
            console.error('Error checking token validity: ', error);
            throw new BadRequestException(
                `can't fetch data by token ${accessToken}`,
            );
        }
    }
}
