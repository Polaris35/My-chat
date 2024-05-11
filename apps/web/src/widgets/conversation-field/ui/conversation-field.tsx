import { ConversationHeader } from '@/features/conversation-header/ui/conversation-header';
import { MessageList } from '@/features/message-list';
import { SendMessageField } from '@/features/send-message-field';

export function ConversationField() {
    return (
        <div className="flex flex-col flex-1">
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
