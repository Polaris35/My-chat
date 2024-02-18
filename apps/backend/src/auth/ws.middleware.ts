import { Socket } from 'socket.io';
import { WebsocketJwtGuard } from './guards/ws-jwt.guard';

type SocketIOMiddleware = {
    (client: Socket, next: (err?: Error) => void);
};

export const SocketAuthMiddleware = (): SocketIOMiddleware => {
    return (client, next) => {
        try {
            WebsocketJwtGuard.valiateToken(client);
            next();
        } catch (error) {
            next(error);
        }
    };
};
