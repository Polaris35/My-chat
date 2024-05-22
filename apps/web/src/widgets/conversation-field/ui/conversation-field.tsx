import { CurrentConversationContext } from '@/entities/current-conversation';
import { ConversationHeader } from '@/features/conversation-header/ui/conversation-header';
import { MessageList } from '@/features/message-list';
import { SendMessageField } from '@/features/send-message-field';
import { useContext } from 'react';

export function ConversationField() {
    const { conversationId } = useContext(CurrentConversationContext);

    if (!conversationId) {
        return (
            <div className="flex flex-1 justify-center items-center">
                <p className="text-xl font-bold text-gray-500">
                    Select conversation
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col flex-1 max-h-dvh">
            <ConversationHeader
                title={'title'}
                avatarUrl={'/api/attachments/?id=1'}
                participantsCount={2}
            />
            <MessageList className={'flex-1 p-2'} />
            <SendMessageField />
        </div>
    );
}
