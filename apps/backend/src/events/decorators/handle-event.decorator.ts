export function HandleEvent(event: string) {
    return function (target, propertyKey, descriptor) {
        Reflect.defineMetadata('HANDLE_EVENT', event, descriptor.value);
    };
}
