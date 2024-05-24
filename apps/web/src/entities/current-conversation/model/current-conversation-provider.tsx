import { useSession } from 'next-auth/react';
import { ReactNode, useEffect, useReducer, useState } from 'react';
import { messagesReducer } from './messages-reducer';
import {
    messagesControllerConversationMessagesList,
    messagesControllerGetFirstMessage,
} from '@/shared/api';
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
    const [messagesPage, setMessagesPage] = useState(() => 0);
    const [firstMessage, setFirstMessage] = useState<MessageDisplay | null>(
        null,
    );
    const [hasMoreMessages, setHasMoreMessages] = useState(true);

    const loadMoreMessages = async () => {
        if (
            messages.messages.some(
                (message) => message.id === (firstMessage as MessageDisplay).id,
            ) ||
            messages.messages.length < 15
        ) {
            console.log('has no more messages in loadMoreMessages func');
            setHasMoreMessages(false);
            return;
        }

        console.log('page count is: ', messagesPage);
        const res = await messagesControllerConversationMessagesList(
            currentConversationId!,
            messagesPage,
            {
                headers: {
                    Authorization: `Bearer ${session?.data?.user.accessToken}`,
                },
            },
        );
        console.log(
            'current messages: ',
            messages.messages.map((message) => message.id),
        );
        console.log(
            'new messages: ',
            res.map((message) => message.id),
        );
        dispatchMessages({
            type: MessageActionKind.ADD,
            payload: res.map((message): MessageDisplay => {
                return { ...message, status: 'sended' };
            }),
        });

        if (
            res.some(
                (message) => message.id === (firstMessage as MessageDisplay).id,
            )
        ) {
            setHasMoreMessages(false);
            console.log('has no more messages in loadMoreMessages func');
        }
        setMessagesPage((prev) => {
            return prev + 1;
        });
    };

    const contextValue = {
        conversationId: currentConversationId!,
        setConversationId: setCurrentConversationId,
        messages,
        dispatchMessages,
        loadMoreMessages,
        hasMoreMessages,
    };

    useEffect(() => {
        if (!currentConversationId) {
            return;
        }
        setMessagesPage(0);
        setHasMoreMessages(true);

        const getFirstMessage = async (): Promise<void> => {
            const res = await messagesControllerGetFirstMessage(
                currentConversationId,
                {
                    headers: {
                        Authorization: `Bearer ${session?.data?.user.accessToken}`,
                    },
                },
            );
            setFirstMessage({ status: 'sended', ...res });
            console.log('set first message: ', res);
        };

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
        getFirstMessage();
        getMessages();
        setMessagesPage((prev) => {
            return prev + 1;
        });
    }, [currentConversationId]);
    return (
        <CurrentConversationContext.Provider value={contextValue}>
            {children}
        </CurrentConversationContext.Provider>
    );
}
