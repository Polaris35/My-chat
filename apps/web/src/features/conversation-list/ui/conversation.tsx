import { ConversationPreviewResponseMessageType } from '@/shared/api';
import { UiAvatar } from '@/shared/ui';
import { DateTime } from 'luxon';

type ConversationProps = {
    title: string;
    senderName: string;
    avatarUrl: string;
    message: string;
    messageType: ConversationPreviewResponseMessageType;
    time: string;
    messageCount: number;
};
export function Conversation({
    avatarUrl,
    senderName,
    title,
    message,
    time,
    messageCount,
    messageType,
}: ConversationProps) {
    if (avatarUrl === 'default') {
        avatarUrl = './default_avatar.jpg';
    }
    const isUnreaded = messageCount > 0 ? 'block' : 'hidden';
    const messageDate = DateTime.fromISO(time);
    const dateFormat =
        DateTime.now().diff(messageDate, 'days').days >= 1
            ? 'D, hh:mm'
            : 'hh:mm';
    return (
        <div className="flex items-center gap-4 p-2 border-y border-neutral border-collapse">
            <UiAvatar url={avatarUrl} size={'medium'} />
            <div className="flex flex-col gap-1 justify-around flex-1">
                <div className="flex justify-between">
                    <p className="text-base font-medium text-base-content flex-1 truncate max-w-[20ch]">
                        <span>{title}</span>
                    </p>
                    <span className="text-gray-500 text-sm">
                        {messageDate.toFormat(dateFormat)}
                    </span>
                </div>
                <div className="text-sm flex">
                    {messageType ===
                    ConversationPreviewResponseMessageType.SYSTEM_MESSAGE ? (
                        <div className="flex-1">
                            <div className="badge badge-neutral truncate max-w-[32ch]">
                                {message}
                            </div>
                        </div>
                    ) : (
                        <div className="flex gap-1 flex-1 items-center">
                            <span className="text-sm truncate max-w-[16ch]">
                                {senderName}
                            </span>
                            <span className="text-gray-500 truncate max-w-[20ch]">
                                {': '}
                                {message}
                            </span>
                        </div>
                    )}

                    <div
                        className={`bg-neutral p-1 rounded-full min-h-6 px-2 ${isUnreaded}`}
                    >
                        <span className="text-neutral-content text-sm">
                            {messageCount}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
