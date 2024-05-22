import clsx from 'clsx';
import { Message } from './message';
import { useContext } from 'react';
import { CurrentConversationContext } from '@/entities/current-conversation';
import {
    MessageResponseAttachmentType,
    MessageResponseType,
} from '@/shared/api';
import { useSession } from 'next-auth/react';
import { ImageMessage } from './image-message';
import { FileMessage } from './file-message';

type MessageListProps = {
    className: string;
};
export function MessageList({ className }: MessageListProps) {
    const session = useSession();

    const { messages } = useContext(CurrentConversationContext);
    console.log('MessageList, messages: ', messages);
    return (
        <div
            className={clsx(
                className,
                'flex flex-col-reverse gap-3 overflow-y-auto no-scrollbar',
            )}
        >
            {messages.messages.length > 0 ? (
                messages.messages.map((message) => {
                    console.log('attachments type: ', message.attachmentType);
                    if (message.type === MessageResponseType.SYSTEM_MESSAGE) {
                        return (
                            <div
                                key={message.id}
                                className="flex justify-center"
                            >
                                <div className="badge badge-neutral">
                                    {message.message}
                                </div>
                            </div>
                        );
                    }
                    switch (message.attachmentType) {
                        case MessageResponseAttachmentType.IMAGE: {
                            return (
                                <ImageMessage
                                    key={message.id}
                                    avatarUrl={message.senderAvatarUrl}
                                    autor={message.senderName}
                                    time={message.createdAt}
                                    message={message.message}
                                    status={
                                        message.isReaded ? 'readed' : 'sended'
                                    }
                                    type={
                                        message.senderId ===
                                        session.data?.user.id
                                            ? 'send'
                                            : 'recive'
                                    }
                                    imageIds={message.attachmentList}
                                />
                            );
                        }
                        case MessageResponseAttachmentType.FILE: {
                            return (
                                <FileMessage
                                    key={message.id}
                                    avatarUrl={message.senderAvatarUrl}
                                    autor={message.senderName}
                                    time={message.createdAt}
                                    message={message.message}
                                    status={
                                        message.isReaded ? 'readed' : 'sended'
                                    }
                                    type={
                                        message.senderId ===
                                        session.data?.user.id
                                            ? 'send'
                                            : 'recive'
                                    }
                                    fileIds={message.attachmentList}
                                />
                            );
                        }
                        default: {
                            return (
                                <Message
                                    key={message.id}
                                    avatarUrl={message.senderAvatarUrl}
                                    autor={message.senderName}
                                    time={message.createdAt}
                                    message={message.message}
                                    status={
                                        message.isReaded ? 'readed' : 'sended'
                                    }
                                    type={
                                        message.senderId ===
                                        session.data?.user.id
                                            ? 'send'
                                            : 'recive'
                                    }
                                />
                            );
                        }
                    }
                })
            ) : (
                <div className="flex items-center justify-center">
                    <p className="text-xl text-gray-500">There is no message</p>
                </div>
            )}
        </div>
    );
}
