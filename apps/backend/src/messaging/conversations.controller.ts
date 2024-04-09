import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { CurrentUser } from '@common/decorators';
import { Conversation } from '@prisma/client';
import { CreateGroupConversationDto } from './dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { JwtPayload } from '@auth/interfaces';
import { ConversationListResponse } from './responses';

@ApiTags('Conversations')
@ApiBearerAuth()
@Controller('conversations')
export class ConversationsController {
    constructor(
        private readonly conversationsService: ConversationsService,
        private readonly messagesService: MessagesService,
    ) {}

    @Get('private')
    async createPrivateConversation(
        @CurrentUser() currentUser: JwtPayload,
        @Query('userId') userId: number,
    ): Promise<Conversation> {
        console.log(userId);
        const conversation =
            await this.conversationsService.createPrivateConversation(
                currentUser.id,
                +userId,
            );

        await this.messagesService.createSystemMessage(
            conversation.id,
            `${currentUser.email} started conversation`,
        );
        return conversation;
    }

    @Post('group')
    async createGroupConversation(
        @CurrentUser('id') currentUser: number,
        @Body() dto: CreateGroupConversationDto,
    ): Promise<Conversation> {
        const conversation = await this.conversationsService.createGroup(
            dto,
            currentUser,
        );
        await this.messagesService.createSystemMessage(
            conversation.id,
            'Conversation created',
        );
        return conversation;
    }

    @ApiOkResponse({
        type: ConversationListResponse,
    })
    @Get('list')
    async conversationList(@CurrentUser('id') userId: number) {
        const conversationsList =
            await this.conversationsService.getUserConversations(userId);

        return conversationsList;
    }
}
