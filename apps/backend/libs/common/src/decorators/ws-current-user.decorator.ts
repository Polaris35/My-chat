import { JwtPayload } from '@auth/interfaces';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { verify } from 'jsonwebtoken';

export const WsCurrentUser = createParamDecorator(
    (
        key: keyof JwtPayload,
        ctx: ExecutionContext,
    ): JwtPayload | Partial<JwtPayload> => {
        const { authorization } = ctx.switchToWs().getClient()
            .handshake.headers;
        const secretKey = process.env.JWT_SECRET;
        if (!secretKey) {
            throw new Error(
                'JWT_SECRET is not defined in environment variables',
            );
        }
        const token: string = authorization?.split(' ')[1];
        const decodedToken = verify(token, secretKey);

        return key ? decodedToken[key] : decodedToken;
    },
);
