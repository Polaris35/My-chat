import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { ConversationsService } from './conversations.service';
import { PrismaService } from '@prisma/prisma.service';

@Module({
    imports: [PrismaService],
    providers: [MessagesService, ConversationsService],
})
export class MessagingModule {}
