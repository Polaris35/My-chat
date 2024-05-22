import { useSession } from 'next-auth/react';
import { ReactNode, useEffect, useReducer, useState } from 'react';
import { messagesReducer } from './messages-reducer';
import { messagesControllerConversationMessagesList } from '@/shared/api';
import { MessageActionKind, MessageDisplay } from '../interfaces/interfaces';
import { CurrentConversationContext } from './current-conversation-context';

export function CurrentConversationProvider({
    children,
}: {
    children: ReactNode;
}) {
    const session = useSession();
    const [currentConversationId, setCurrentConversationId] = useState<
        number | null
    >(null);
    const [messages, dispatchMessages] = useReducer(messagesReducer, {
        messages: [],
    });

    const contextValue = {
        conversationId: currentConversationId!,
        setConversationId: setCurrentConversationId,
        messages,
        dispatchMessages,
    };

    useEffect(() => {
        if (!currentConversationId) {
            return;
        }

        const getMessages = async () => {
            const res = await messagesControllerConversationMessagesList(
                currentConversationId,
                0,
                {
                    headers: {
                        Authorization: `Bearer ${session?.data?.user.accessToken}`,
                    },
                },
            );
            dispatchMessages({
                type: MessageActionKind.SET,
                payload: res.map((message): MessageDisplay => {
                    return { ...message, status: 'sended' };
                }),
            });
        };

        getMessages();
    }, [currentConversationId]);
    return (
        <CurrentConversationContext.Provider value={contextValue}>
            {children}
        </CurrentConversationContext.Provider>
    );
}
