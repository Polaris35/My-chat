// import { socket } from '@/shared/api';
// import { useEffect, useState } from 'react';

// export function UseSocket() {
//     const [isConnected, setIsConnected] = useState(false);
//     const [transport, setTransport] = useState('N/A');

//     // useEffect(() => {
//     //     if (socket.connected) {
//     //         onConnect();
//     //     }

//     //     function onConnect() {
//     //         setIsConnected(true);
//     //         setTransport(socket.io.engine.transport.name);

//     //         socket.io.engine.on('upgrade', (transport) => {
//     //             setTransport(transport.name);
//     //         });
//     //     }

//     //     function onDisconnect() {
//     //         setIsConnected(false);
//     //         setTransport('N/A');
//     //     }

//     //     socket.on('connect', onConnect);
//     //     socket.on('disconnect', onDisconnect);

//     //     console.log('isConnected: ', isConnected);
//     //     console.log('transport: ', transport);

//     //     return () => {
//     //         socket.off('connect', onConnect);
//     //         socket.off('disconnect', onDisconnect);
//     //     };
//     // }, []);
// }
