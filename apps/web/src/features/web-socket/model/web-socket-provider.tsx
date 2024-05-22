import { PropsWithChildren } from 'react';
import { SocketInitializer } from '../api/socket-initializer';

export function WebSocketProvider({ children }: PropsWithChildren) {
    SocketInitializer();
    return <>{children}</>;
}
