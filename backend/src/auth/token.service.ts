import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { Tokens } from './interfaces';
import { UsersService } from '@users/users.service';
import { Token, User } from '@prisma/client';
import { v4 } from 'uuid';
import { add } from 'date-fns';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async refreshToken(refreshTokens: string, agent: string): Promise<Tokens> {
        const token = await this.prismaService.token.findUnique({
            where: {
                token: refreshTokens,
            },
        });

        if (!token || new Date(token.exp) < new Date()) {
            throw new UnauthorizedException();
        }

        await this.prismaService.token.delete({
            where: {
                token: refreshTokens,
            },
        });

        const user = await this.userService.findById(token.idUser);
        return this.generateTokens(user, agent);
    }

    async generateTokens(user: User, agent: string): Promise<Tokens> {
        const accessToken = this.jwtService.sign({
            id: user.id,
            email: user.email,
        });
        const refreshToken = await this.getRefreshToken(user.id, agent);

        return { accessToken, refreshToken };
    }

    async getRefreshToken(idUser: number, agent: string): Promise<Token> {
        const _token = await this.prismaService.token.findFirst({
            where: {
                idUser,
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
                idUser,
                userAgent: agent,
            },
        });
    }

    deleteRefreshToken(token: string) {
        return this.prismaService.token.delete({
            where: { token },
        });
    }
}
