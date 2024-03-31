import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ConversationsService } from './conversations.service';
import { EventsGateway } from '@events/events.gateway';
import { HandleEvent } from '@events/decorators/handle-event.decorator';
import { MESSAGING } from '@events/constants';
import type { Conversation, Message } from '@prisma/client';

@Injectable()
export class MessagingEventsHandler {
    private readonly connections: Map<number, Socket[]>;

    constructor(
        private readonly conversationsService: ConversationsService,
        private readonly eventGateway: EventsGateway,
    ) {
        this.connections = eventGateway.getConnections();
    }

    @HandleEvent(MESSAGING.NEW_MESSAGE)
    newMessage(message: Message) {
        this.sendEvent(message.conversationId, MESSAGING.NEW_MESSAGE, message);
    }

    @HandleEvent(MESSAGING.NEW_CONVERSATION)
    newConversation(conversation: Conversation) {
        console.log('new-conversation' + conversation);
        this.sendEvent(
            conversation.id,
            MESSAGING.NEW_CONVERSATION,
            conversation,
        );
    }

    @HandleEvent(MESSAGING.DELETE_MESSAGE)
    deleteMessage(message: Message) {
        this.sendEvent(
            message.conversationId,
            MESSAGING.DELETE_CONVERSATION,
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

        console.log('membersIds: ' + membersIds);
        console.log('conversationId: ' + conversationId);

        membersIds.map((id: number) => {
            if (this.connections.has(id)) {
                this.connections.get(id).map((socket: Socket) => {
                    socket.emit(event, data);
                });
            }
        });
    }
}
