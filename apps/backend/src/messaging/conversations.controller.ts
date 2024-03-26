import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { CurrentUser } from '@common/decorators';
import { Conversation } from '@prisma/client';
import { CreateGroupConversationDto } from './dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Conversations')
@ApiBearerAuth()
@Controller('conversations')
export class ConversationsController {
    constructor(private readonly conversationsService: ConversationsService) {}

    @Post('private-conversation')
    async createPrivateConversation(
        @CurrentUser('id') currentUser: number,
        @Param('userId') userId: number,
    ): Promise<Conversation> {
        return this.conversationsService.createPrivateConversation(
            currentUser,
            userId,
        );
    }

    @Post('group-conversation')
    async createGroupConversation(
        @CurrentUser('id') currentUser: number,
        @Body() dto: CreateGroupConversationDto,
    ): Promise<Conversation> {
        return this.conversationsService.createGroup(dto, currentUser);
    }
    @Get('list')
    async conversationList(@CurrentUser('id') userId: number) {
        const conversationsList =
            await this.conversationsService.getUserConversations(userId);

        return conversationsList.map((idObject) =>
            this.conversationsService.getConversation(idObject.conversationId),
        );
    }
}
