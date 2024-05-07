import { useConversationListQuery } from '@/entities/conversation-list/queries';
import { UiSpinner } from '@/shared/ui';
import { Conversation } from './conversation';
import { Drawer } from '@/entities/menu-drawer';
import { CreateConversationButton } from './create-conversation-button';
import { SearchField } from './search-field';

export function ConversationList() {
    const { sessionStatus, data, isLoading } = useConversationListQuery();

    return (
        <div className="flex flex-col border-r border-neutral min-h-screen max-h-screen relative">
            <div className="flex p-4 gap-4 border-b border-neutral justify-between">
                <Drawer />
                <SearchField />
            </div>
            {isLoading || sessionStatus === 'loading' ? (
                <div className="flex-1 flex justify-center items-center">
                    <UiSpinner />
                </div>
            ) : (
                <ul className="flex flex-col overflow-y-auto no-scrollbar">
                    {data?.conversations.map((conversation) => {
                        return (
                            <Conversation
                                key={conversation.id}
                                title={conversation.title}
                                senderName={conversation.senderName}
                                avatarUrl={conversation.avatarUrl}
                                message={conversation.message}
                                time={conversation.time}
                                messageCount={conversation.messageCount}
                                messageType={conversation.messageType}
                            />
                        );
                    })}
                </ul>
            )}

            <CreateConversationButton className="absolute right-4 bottom-4" />
        </div>
    );
}
