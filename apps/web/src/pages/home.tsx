import { CurrentConversationProvider } from '@/entities/current-conversation';
import { ConversationList } from '@/features/conversation-list';
import { WebSocketProvider } from '@/features/web-socket';
import { ConversationField } from '@/widgets/conversation-field';

export function HomePage() {
    return (
        <CurrentConversationProvider>
            <WebSocketProvider>
                <div className="min-h-screen h-full flex">
                    <div className="w-96">
                        <ConversationList />
                    </div>
                    <ConversationField />
                </div>
            </WebSocketProvider>
        </CurrentConversationProvider>
    );
}
