import { WebsocketJwtGuard } from '@auth/guards/ws-jwt.guard';
import { SocketAuthMiddleware } from '@auth/ws.middleware';
import { HandleEvent } from '@events/decorators/handle-event.decorator';
import { UseGuards } from '@nestjs/common';
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    WebSocketGateway,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MESSAGING } from './constants';
import { Conversation, ConversationType, Message } from '@prisma/client';
import { ConversationsService } from './conversations.service';
import { MessageResponse } from './responses';

@WebSocketGateway({
    namespace: 'events',
    cors: {
        origin: ['http://localhost:3001'],
        credentials: true,
    },
    transports: ['websocket', 'polling'],
})
@UseGuards(WebsocketJwtGuard)
export class MessagingGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    private connections = new Map<number, Socket[]>();
    constructor(private readonly conversationsService: ConversationsService) {}

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

    @HandleEvent(MESSAGING.NEW_MESSAGE)
    newMessage(message: MessageResponse) {
        this.sendEvent(message.conversationId, MESSAGING.NEW_MESSAGE, message);
    }

    @HandleEvent(MESSAGING.NEW_CONVERSATION)
    async newConversation(conversation: Conversation) {
        const membersIds = await this.conversationsService.getMembersIds(
            conversation.id,
        );
        console.log('sending messages to: ', membersIds);

        membersIds.map(async (id: number) => {
            if (!this.connections.has(id)) {
                return;
            }
            const preiewResponse =
                conversation.type === ConversationType.GROUP
                    ? await this.conversationsService.getGroupConversationPreview(
                          conversation.id,
                          id,
                      )
                    : await this.conversationsService.getPrivateConversationPreview(
                          conversation.id,
                          id,
                      );

            this.connections.get(id).map((socket: Socket) => {
                console.log('sending message to: ', id);
                socket.emit(MESSAGING.NEW_CONVERSATION, preiewResponse);
            });
        });
    }

    @HandleEvent(MESSAGING.DELETE_MESSAGE)
    deleteMessage(message: Message) {
        this.sendEvent(
            message.conversationId,
            MESSAGING.DELETE_MESSAGE,
            message.id,
        );
    }
    @HandleEvent(MESSAGING.DELETE_CONVERSATION)
    deleteConversation(conversation: Conversation) {
        this.sendEvent(
            conversation.id,
            MESSAGING.DELETE_CONVERSATION,
            conversation.id,
        );
    }

    // addUserToConversation(participant: Participant) {
    //     this.sendEvent(
    //         participant.conversationId,
    //         'add-to-conversation',
    //         participant.userId,
    //     );
    // }

    // removeUserFromConversation(participant: Participant) {
    //     this.sendEvent(
    //         participant.conversationId,
    //         'remove-from-conversation',
    //         participant.userId,
    //     );
    // }

    private async sendEvent(conversationId: number, event: string, data: any) {
        const membersIds =
            await this.conversationsService.getMembersIds(conversationId);
        console.log('sending messages to: ', membersIds);

        membersIds.map((id: number) => {
            if (this.connections.has(id)) {
                this.connections.get(id).map((socket: Socket) => {
                    console.log('sending message to: ', id);
                    socket.emit(event, data);
                });
            }
        });
    }
}
