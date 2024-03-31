import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventHandlerDiscovery } from './event-handler.discovery';

@Injectable()
export class EventManager implements OnModuleInit {
    private eventsToHandlersMap;

    constructor(
        private readonly eventHandlerDiscovery: EventHandlerDiscovery,
    ) {}

    async onModuleInit() {
        this.eventsToHandlersMap =
            await this.eventHandlerDiscovery.getEventsToHandlersMap();
    }

    public fireEvent(event, data) {
        const handler = this.eventsToHandlersMap.get(event);

        if (handler) {
            // console.log(handler.name);
            handler(data);
        }
    }
}
