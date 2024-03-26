import { WebsocketJwtGuard } from '@auth/guards/ws-jwt.guard';
import { SocketAuthMiddleware } from '@auth/ws.middleware';
import { UseGuards } from '@nestjs/common';
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    WebSocketGateway,
    WsException,
} from '@nestjs/websockets';
import { Conversation, ParticipantRole, Message } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { ConversationsService } from '@messaging/conversations.service';
import { CreateGroupConversationDto } from '@messaging/dto';
import { MessagesService } from '@messaging/messages.service';
import { JwtPayload } from '@auth/interfaces';

@WebSocketGateway({ namespace: 'events' })
@UseGuards(WebsocketJwtGuard)
export class EventsGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    constructor(
        private readonly conversationService: ConversationsService,
        private readonly messageService: MessagesService,
    ) {}

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

    // @SubscribeMessage('new-message')
    // async newMessage(@MessageBody() dto: CreateMessageDto): Promise<void> {
    //     const isAMember = await this.conversationService.isAMember(
    //         dto.senderId,
    //         dto.conversationId,
    //     );
    //     if (!isAMember) {
    //         throw new WsException('You are not a member of this conversation');
    //     }

    //     const message = await this.messageService.create(dto);
    //     await this.sendMessegeToConversation(dto.conversationId, message);
    // }
    async newMessage(conversationId: number, message: Message) {
        const memebersIds =
            await this.conversationService.getMembersIds(conversationId);

        memebersIds.map((id: number) => {
            this.connections.get(id).map((socket: Socket) => {
                socket.emit('new-message', message);
            });
        });
    }
    // @SubscribeMessage('new-group-conversation')
    async newGroupConversation(
        userId: number,
        dto: CreateGroupConversationDto,
    ): Promise<Conversation> {
        const conversation = await this.conversationService.createGroup(
            dto,
            userId,
        );
        await this.messageService.createSystemMessage(
            conversation.id,
            'Conversation created',
        );
        return conversation;
    }

    // @SubscribeMessage('new-private-conversation')
    async newPrivateConversation(
        currentUser: JwtPayload,
        userId: number,
    ): Promise<Conversation> {
        const conversation =
            await this.conversationService.createPrivateConversation(
                currentUser.id,
                userId,
            );

        await this.messageService.createSystemMessage(
            conversation.id,
            `${currentUser.email} started conversation`,
        );
        return conversation;
    }

    // @SubscribeMessage('delete-conversation')
    deleteConversation(idConversation: number, idUser: number) {
        return this.conversationService.deleteConversation(
            idConversation,
            idUser,
        );
    }

    // @SubscribeMessage('delete-message')
    async deleteMessage(messageId: number, userId: number) {
        const message = await this.messageService.findOne(messageId);
        if (message.senderId === userId) {
            return this.messageService.delete(messageId);
        }
        const participant = await this.conversationService.findParticipant(
            userId,
            message.conversationId,
        );
        if (
            participant.role === ParticipantRole.MODERATOR ||
            participant.role == ParticipantRole.ADMIN
        ) {
            return this.messageService.delete(messageId);
        }
        throw new WsException('You are not the owner of this message');
    }
}
