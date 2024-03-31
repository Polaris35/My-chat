import { DiscoveryService } from '@golevelup/nestjs-discovery';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EventHandlerDiscovery {
    // Inject discovery service from @golevelup
    constructor(private readonly discoveryService: DiscoveryService) {}

    public async getEventsToHandlersMap() {
        // This returns all the methods decorated with our decorator
        const scanResult =
            await this.discoveryService.providerMethodsWithMetaAtKey(
                'HANDLE_EVENT',
            );

        const eventsToHandlersMap = new Map<string, any>();

        scanResult.map((result) => {
            const event = result.meta as string;
            const handler = result.discoveredMethod.handler;
            const that = result.discoveredMethod.parentClass.instance;
            const boundHandler = handler.bind(that);

            eventsToHandlersMap.set(event, boundHandler);
        });

        return eventsToHandlersMap;
    }
}
