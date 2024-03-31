import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { EventHandlerDiscovery } from './event-handler.discovery';
import { DiscoveryModule } from '@golevelup/nestjs-discovery';
import { EventManager } from './event-manager';

@Module({
    imports: [DiscoveryModule],
    providers: [EventsGateway, EventHandlerDiscovery, EventManager],
    exports: [EventManager, EventsGateway],
})
export class EventsModule {}
