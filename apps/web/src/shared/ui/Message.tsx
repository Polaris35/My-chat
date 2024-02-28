import clsx from 'clsx';
import { Avatar } from './Avatar';

type MessageStatus = 'sended' | 'sending' | 'readed';
type MessageType = 'recive' | 'send';
type MessageBubbleProps = {
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
                <Avatar url={avatarUrl} size={'small'} />
            </div>
            <div className="chat-header">
                {autor + ' '}
                <time className="text-xs opacity-50">{time}</time>
            </div>
            <div className="chat-bubble">{message}</div>
            <div className="chat-footer opacity-50">{status}</div>
        </div>
    );
}
