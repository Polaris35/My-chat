import { isPublic } from '@common/decorators';
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { COOKIE } from 'src/constants';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private jwtService: JwtService,
    ) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
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
            const sessionInfo = this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET,
            });

            req['user'] = sessionInfo;
        } catch {
            throw new UnauthorizedException();
        }

        return true;
    }
}
