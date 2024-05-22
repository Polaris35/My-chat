import { CurrentConversationContext } from '@/entities/current-conversation';
import {
    ConversationPreviewListResponse,
    ConversationPreviewResponse,
    MessageResponse,
} from '@/shared/api';
import { CONVERSATION } from '@/shared/constants';
import { useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useContext, useEffect } from 'react';
import { io } from 'socket.io-client';

export function SocketInitializer() {
    const session = useSession();
    const queryClient = useQueryClient();
    const { conversationId, dispatchMessages } = useContext(
        CurrentConversationContext,
    );
    useEffect(() => {
        if (session.status !== 'authenticated') {
            return;
        }
        const socket = io('localhost:3000/events', {
            extraHeaders: {
                Authorization: 'Bearer ' + session.data.user.accessToken,
            },
        });

        socket?.on('new-conversation', (data: ConversationPreviewResponse) => {
            console.log('new-conversation', JSON.stringify(data));
            // queryClient.invalidateQueries({ queryKey: [CONVERSATION.LIST] });
            const list =
                queryClient.getQueryData<ConversationPreviewListResponse>([
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
            // queryClient.invalidateQueries({ queryKey: [CONVERSATION.LIST] });

            // queryClient.setQueriesData<ConversationPreviewListResponse>(
            //     { queryKey: [CONVERSATION.LIST] },
            //     (oldList) => {
            //         return {
            //             conversations: oldList
            //                 ? oldList?.conversations.filter(
            //                       (conversation) =>
            //                           conversation.id === conversationId,
            //                   )
            //                 : [],
            //         };
            //     },
            // );
        });
        socket.on('new-message', (data: any) => {
            console.log('new-message', data);
            if (data.conversationId === conversationId) {
                console.log('new-message', data);
            }
        });
        socket.on('delete-message', (data: any) => {
            console.log('delete-message', data);
        });
        return () => {
            socket.disconnect();
        };
    }, [session.status]);
}

function hasObjectWithFieldValue(arr: any[], field: string, value: any) {
    return arr.some((obj) => obj[field] === value);
}
