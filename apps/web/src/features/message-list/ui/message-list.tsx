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
import InfiniteScroll from 'react-infinite-scroll-component';
import { UiSpinner } from '@/shared/ui';

type MessageListProps = {
    className: string;
};
export function MessageList({ className }: MessageListProps) {
    const session = useSession();

    const { messages, loadMoreMessages, hasMoreMessages } = useContext(
        CurrentConversationContext,
    );
    return (
        <div
            id="scrollableDiv"
            className={clsx(
                className,
                'flex flex-col-reverse gap-3 overflow-y-auto no-scrollbar',
            )}
        >
            {messages.messages.length > 0 ? (
                <InfiniteScroll
                    dataLength={messages.messages.length}
                    next={loadMoreMessages}
                    className="no-scrollbar"
                    style={{ display: 'flex', flexDirection: 'column-reverse' }}
                    inverse={true}
                    hasMore={hasMoreMessages}
                    scrollThreshold={1.2}
                    loader={
                        <div className="flex justify-center py-4">
                            <UiSpinner />
                        </div>
                    }
                    scrollableTarget="scrollableDiv"
                >
                    {messages.messages.map((message) => {
                        if (
                            message.type === MessageResponseType.SYSTEM_MESSAGE
                        ) {
                            return (
                                <div
                                    key={message.id}
                                    className="flex justify-center pb-2"
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
                                            message.isReaded
                                                ? 'readed'
                                                : 'sended'
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
                                            message.isReaded
                                                ? 'readed'
                                                : 'sended'
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
                                            message.isReaded
                                                ? 'readed'
                                                : 'sended'
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
                    })}
                </InfiniteScroll>
            ) : (
                <div className="flex items-center justify-center">
                    <p className="text-xl text-gray-500">There is no message</p>
                </div>
            )}
        </div>
    );
}
