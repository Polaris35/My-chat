import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { ConversationsService } from './conversations.service';
import { PrismaModule } from '@prisma/prisma.module';
import { MessagesController } from './messages.controller';
import { ConversationsController } from './conversations.controller';
import { EventsModule } from '@events/events.module';
import { MessagingEventsHandler } from './messaging-events.handler';

@Module({
    imports: [PrismaModule, EventsModule],
    providers: [MessagesService, ConversationsService, MessagingEventsHandler],
    exports: [MessagesService, ConversationsService],
    controllers: [MessagesController, ConversationsController],
})
export class MessagingModule {}
