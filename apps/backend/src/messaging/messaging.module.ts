import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { ConversationsService } from './conversations.service';
import { PrismaModule } from '@prisma/prisma.module';
import { MessagesController } from './messages.controller';
import { ConversationsController } from './conversations.controller';
import { EventsModule } from '@events/events.module';
import { MessagingGateway } from './messaging.gateway';

@Module({
    imports: [PrismaModule, EventsModule],
    providers: [MessagesService, ConversationsService, MessagingGateway],
    exports: [MessagesService, ConversationsService],
    controllers: [MessagesController, ConversationsController],
})
export class MessagingModule {}
