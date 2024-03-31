import { WebsocketJwtGuard } from '@auth/guards/ws-jwt.guard';
import { SocketAuthMiddleware } from '@auth/ws.middleware';
import { UseGuards } from '@nestjs/common';
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    WebSocketGateway,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: 'events' })
@UseGuards(WebsocketJwtGuard)
export class EventsGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    private connections = new Map<number, Socket[]>();

    afterInit(server: Server) {
        server.use(SocketAuthMiddleware());
    }
    handleConnection(client: Socket) {
        const token = WebsocketJwtGuard.valiateToken(client);
        const existingConnections = this.connections.get(token.id);
        if (existingConnections) {
            this.connections.set(token.id, [...existingConnections, client]);
        }
        this.connections.set(token.id, [client]);
        console.log(this.connections);
    }

    handleDisconnect(client: Socket) {
        const token = WebsocketJwtGuard.valiateToken(client);
        const existingConnections = this.connections.get(token.id);
        if (existingConnections.length === 1) {
            this.connections.delete(token.id);
            return;
        }
        existingConnections.splice(existingConnections.indexOf(client), 1);
        this.connections.set(token.id, existingConnections);
    }

    getConnections() {
        return this.connections;
    }
}
