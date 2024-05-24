import { Dispatch, createContext, SetStateAction } from 'react';
import { MessageAction, MessageState } from '../interfaces/interfaces';

export type CurrentConversationContextProps = {
    conversationId: number;
    setConversationId: Dispatch<SetStateAction<number | null>>;
    messages: MessageState;
    dispatchMessages: Dispatch<MessageAction>;
    loadMoreMessages: () => void;
    hasMoreMessages: boolean;
};

export const CurrentConversationContext =
    createContext<CurrentConversationContextProps>({
        conversationId: 0,
        setConversationId: () => {},
        messages: {
            messages: [],
        },
        dispatchMessages: () => {},
        loadMoreMessages: () => {},
        hasMoreMessages: false,
    });
