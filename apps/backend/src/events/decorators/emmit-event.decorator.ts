export function EmmitEvent(eventName: string) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor,
    ) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            const result = await originalMethod.apply(this, args);

            this.eventManager.fireEvent(eventName, result);

            return result;
        };

        return descriptor;
    };
}
