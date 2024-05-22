import { CurrentConversationProvider } from '@/entities/current-conversation';
import { ConversationList } from '@/features/conversation-list';
import { SocketInitializer } from '@/features/web-socket';
import { ConversationField } from '@/widgets/conversation-field';
import { useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export function HomePage() {
    const session = useSession();
    const queryClient = useQueryClient();
    useEffect(() => {
        if (session.status !== 'authenticated') {
            return;
        }
        const { socket } = SocketInitializer(
            session.data.user.accessToken,
            queryClient,
        );
        return () => {
            socket.disconnect();
        };
    }, [session.status]);

    return (
        <CurrentConversationProvider>
            <div className="min-h-screen h-full flex">
                <div className="w-96">
                    <ConversationList />
                </div>
                <ConversationField />
            </div>
        </CurrentConversationProvider>
    );
}
