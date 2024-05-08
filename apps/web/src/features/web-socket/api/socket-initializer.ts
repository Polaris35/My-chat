import {
    ConversationPreviewListResponse,
    ConversationPreviewResponse,
} from '@/shared/api';
import { CONVERSATION } from '@/shared/constants';
import { QueryClient } from '@tanstack/react-query';
import { Socket, io } from 'socket.io-client';

let socket: Socket;

export function SocketInitializer(token: string, queryClient: QueryClient) {
    socket = io('localhost:3000/events', {
        extraHeaders: {
            Authorization: 'Bearer ' + token,
        },
    });

    socket?.on('new-conversation', (data: ConversationPreviewResponse) => {
        const list = queryClient.getQueryData<ConversationPreviewListResponse>([
            CONVERSATION.LIST,
        ]);

        if (hasObjectWithFieldValue(list?.conversations!, 'id', data.id)) {
            return;
        }
        queryClient.setQueriesData<ConversationPreviewListResponse>(
            { queryKey: [CONVERSATION.LIST] },
            (oldList) => {
                return {
                    conversations: oldList
                        ? [...oldList.conversations, data]
                        : [data],
                };
            },
        );
    });
    socket.on('delete-conversation', (conversationId: number) => {
        console.log('delete-conversation', conversationId);

        queryClient.setQueriesData<ConversationPreviewListResponse>(
            { queryKey: [CONVERSATION.LIST] },
            (oldList) => {
                return {
                    conversations: oldList
                        ? oldList?.conversations.filter(
                              (conversation) =>
                                  conversation.id === conversationId,
                          )
                        : [],
                };
            },
        );
    });
    socket.on('new-message', (data: any) => {
        console.log('new-message', data);
    });
    socket.on('delete-message', (data: any) => {
        console.log('delete-message', data);
    });

    return { socket };
}

function hasObjectWithFieldValue(arr: any[], field: string, value: any) {
    return arr.some((obj) => obj[field] === value);
}
