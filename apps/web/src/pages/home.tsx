import { ConversationList } from '@/features/conversation-list';
import { UiButton } from '@/shared/ui';
import { signOut } from 'next-auth/react';

export function HomePage() {
    return (
        <div className="min-h-screen h-full flex">
            <div className="w-96">
                <ConversationList />
            </div>
            <div>
                {/* messaggess fileds */}
                <UiButton onClick={() => signOut()} variant={'primary'}>
                    Sign out
                </UiButton>
            </div>
        </div>
    );
}
