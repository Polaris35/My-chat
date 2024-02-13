import { WebsocketJwtGuard } from '@auth/guards/ws-jwt.guard';
import { SocketAuthMiddleware } from '@auth/ws.middleware';
import { UseGuards } from '@nestjs/common';
import {
    OnGatewayConnection,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: 'events' })
@UseGuards(WebsocketJwtGuard)
export class EventsGateway implements OnGatewayInit, OnGatewayConnection {
    handleConnection(client: any, ...args: any[]) {
        // throw new Error('Method not implemented.');
    }
    afterInit(server: Server) {
        server.use(SocketAuthMiddleware());
    }

    @SubscribeMessage('message')
    handleMessage(client: any, payload: any): string {
        return 'Hello world!';
    }
}
