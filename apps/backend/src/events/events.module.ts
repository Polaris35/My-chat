import { Module } from '@nestjs/common';
import { EventHandlerDiscovery } from './event-handler.discovery';
import { DiscoveryModule } from '@golevelup/nestjs-discovery';
import { EventManager } from './event-manager';

@Module({
    imports: [DiscoveryModule],
    providers: [EventHandlerDiscovery, EventManager],
    exports: [EventManager],
})
export class EventsModule {}
