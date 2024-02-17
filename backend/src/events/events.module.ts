import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { MessagingModule } from '@messaging/messaging.module';

@Module({
    imports: [MessagingModule],
    providers: [EventsGateway],
})
export class EventsModule {}
