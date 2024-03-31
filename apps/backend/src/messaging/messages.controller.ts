import { CurrentUser } from '@common/decorators';
import { Controller, Delete, ForbiddenException, Param } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { ConversationsService } from './conversations.service';
import { ParticipantRole } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Messages')
@ApiBearerAuth()
@Controller('messages')
export class MessagesController {
    constructor(
        private readonly messagesService: MessagesService,
        private readonly conversationsService: ConversationsService,
    ) {}
    @Delete()
    async deleteMessage(
        @Param('id') messageId: number,
        @CurrentUser('id') userId: number,
    ) {
        const message = await this.messagesService.findOne(messageId);
        if (message.senderId === userId) {
            return this.messagesService.delete(messageId);
        }
        const participant = await this.conversationsService.findParticipant(
            userId,
            message.conversationId,
        );
        if (
            participant.role === ParticipantRole.MODERATOR ||
            participant.role == ParticipantRole.ADMIN
        ) {
            return this.messagesService.delete(messageId);
        }
        throw new ForbiddenException('You are not the owner of this message');
    }
}
