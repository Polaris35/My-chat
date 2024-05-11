import { UiAvatar } from '@/shared/ui';

type ConversationHeaderProps = {
    title: string;
    avatarUrl: string;
    participantsCount: number;
};
export function ConversationHeader({
    avatarUrl,
    title,
    participantsCount,
}: ConversationHeaderProps) {
    return (
        <div className="flex items-center gap-4 p-2 px-4 bg-base-300 h-[81px] border-b border-neutral border-collapse">
            <UiAvatar url={avatarUrl} size={'medium'} />
            <div className="flex flex-col gap-1 justify-center h-full">
                <p className="text-lg font-bold">{title}</p>
                <p className="text-gray-500">{participantsCount} members</p>
            </div>
        </div>
    );
}
