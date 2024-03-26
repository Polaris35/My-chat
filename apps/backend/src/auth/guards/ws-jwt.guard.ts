import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { verify } from 'jsonwebtoken';

@Injectable()
export class WebsocketJwtGuard implements CanActivate {
    private static configService: ConfigService;
    constructor(configService: ConfigService) {
        WebsocketJwtGuard.configService = configService;
    }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        if (context.getType() !== 'ws') {
            return true;
        }
        const client: Socket = context.switchToWs().getClient();
        WebsocketJwtGuard.valiateToken(client);
        return true;
    }

    static valiateToken(client: Socket) {
        const { authorization } = client.handshake.headers;
        // Logger.log({ authorization });

        const token: string = authorization?.split(' ')[1];
        const payload = verify(
            token,
            WebsocketJwtGuard.configService.get('JWT_SECRET'),
        );
        return payload;
    }
}
