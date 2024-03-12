import { isPublic } from '@common/decorators';
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { COOKIE } from 'src/constants';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly jwtService: JwtService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const _isPublic = isPublic(context, this.reflector);
        if (_isPublic) {
            return true;
        }

        const req = context.switchToHttp().getRequest() as Request;
        const token = req.cookies[COOKIE.ACCESS_TOKEN];

        if (!token) {
            throw new UnauthorizedException();
        }

        try {
            const sessionInfo = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET,
            });

            req['user'] = sessionInfo;
        } catch (error: any) {
            throw new UnauthorizedException(error.message);
        }

        return true;
    }
}
