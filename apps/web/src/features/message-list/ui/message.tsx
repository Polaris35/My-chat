import { UiAvatar } from '@/shared/ui';
import clsx from 'clsx';
import { DateTime } from 'luxon';

export type MessageStatus = 'sended' | 'sending' | 'readed';
export type MessageType = 'recive' | 'send';
export type MessageBubbleProps = {
    avatarUrl: string;
    autor: string;
    time: string;
    message: string;
    status: MessageStatus;
    type: MessageType;
};
export function Message({
    type,
    avatarUrl,
    autor,
    time,
    message,
    status,
}: MessageBubbleProps) {
    const aligment: string = {
        recive: 'chat-start',
        send: 'chat-end',
    }[type];
    return (
        <div className={clsx('chat', aligment)}>
            <div className="chat-image avatar">
                <UiAvatar url={avatarUrl} size={'small'} />
            </div>
            <div className="chat-header">
                {aligment === 'chat-start' ? (
                    <>
                        {autor + ' '}
                        <div
                            className="tooltip"
                            data-tip={DateTime.fromISO(time).toFormat(
                                'dd LLL yyyy, hh:mm',
                            )}
                        >
                            <time className="text-xs opacity-50">
                                {DateTime.fromISO(time).toFormat('hh:mm')}
                            </time>
                        </div>
                    </>
                ) : (
                    <>
                        <div
                            className="tooltip"
                            data-tip={DateTime.fromISO(time).toFormat(
                                'dd LLL yyyy, hh:mm',
                            )}
                        >
                            <time className="text-xs opacity-50">
                                {DateTime.fromISO(time).toFormat('hh:mm')}
                            </time>
                        </div>
                        {' ' + autor}
                    </>
                )}
            </div>

            <div className="chat-bubble">{message}</div>
            <div className="chat-footer opacity-50">{status}</div>
        </div>
    );
}
