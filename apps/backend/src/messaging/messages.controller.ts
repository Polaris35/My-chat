import { CurrentUser } from '@common/decorators';
import {
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    Param,
    ParseIntPipe,
    Post,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { ConversationsService } from './conversations.service';
import { ParticipantRole } from '@prisma/client';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateMessageDto } from './dto';
import { MessageResponse } from './responses';

@ApiTags('Messages')
@ApiBearerAuth()
@Controller('messages')
export class MessagesController {
    constructor(
        private readonly messagesService: MessagesService,
        private readonly conversationsService: ConversationsService,
    ) {}

    @Post()
    @ApiResponse({
        type: MessageResponse,
    })
    async createMessage(
        @CurrentUser('id') id: number,
        @Body() dto: CreateMessageDto,
    ) {
        const participant = await this.conversationsService.findParticipant(
            id,
            dto.conversationId,
        );
        if (!participant) {
            throw new ForbiddenException(
                'You are not a member of this conversation',
            );
        }

        const message = await this.messagesService.create(id, dto);
        return this.messagesService.findOne(message.id, id);
    }

    @Get('list/:conversationId&:skip')
    @ApiResponse({
        type: MessageResponse,
        isArray: true,
    })
    async conversationMessagesList(
        @CurrentUser('id') userId: number,
        @Param('conversationId', ParseIntPipe) conversationId: number,
        @Param('skip', ParseIntPipe) skip: number,
    ) {
        const participant = await this.conversationsService.findParticipant(
            userId,
            conversationId,
        );
        if (!participant) {
            throw new ForbiddenException(
                'You are not a member of this conversation',
            );
        }
        const messagesList = await this.messagesService.getRecentMessages(
            conversationId,
            skip,
            userId,
        );
        return messagesList;
    }
    @Get('first/:conversationId')
    @ApiResponse({
        type: MessageResponse,
    })
    async getFirstMessage(
        @CurrentUser('id') userId: number,
        @Param('conversationId', ParseIntPipe) id: number,
    ) {
        const participant = await this.conversationsService.findParticipant(
            userId,
            id,
        );
        if (!participant) {
            throw new ForbiddenException(
                'You are not a member of this conversation',
            );
        }

        return this.messagesService.getFirstMessage(id, userId);
    }

    @Delete()
    async deleteMessage(
        @Param('id') messageId: number,
        @CurrentUser('id') userId: number,
    ) {
        const message = await this.messagesService.findOne(messageId, userId);
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
