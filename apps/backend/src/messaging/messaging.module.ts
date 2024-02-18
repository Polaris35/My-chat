import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { ConversationsService } from './conversations.service';
import { PrismaModule } from '@prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [MessagesService, ConversationsService],
    exports: [MessagesService, ConversationsService],
})
export class MessagingModule {}
