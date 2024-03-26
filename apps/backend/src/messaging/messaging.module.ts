import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { ConversationsService } from './conversations.service';
import { PrismaModule } from '@prisma/prisma.module';
import { MessagesController } from './messages.controller';
import { ConversationsController } from './conversations.controller';

@Module({
    imports: [PrismaModule],
    providers: [MessagesService, ConversationsService],
    exports: [MessagesService, ConversationsService],
    controllers: [MessagesController, ConversationsController],
})
export class MessagingModule {}
