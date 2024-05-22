import { UiAvatar } from '@/shared/ui';
import clsx from 'clsx';
import { DateTime } from 'luxon';
import { MessageBubbleProps } from './message';
import { useCallback, useState } from 'react';
import ImageViewer from 'react-simple-image-viewer';
import { getAttachmentUrl, getFullUrl } from '@/shared/utils';

type ImageMessageBubbleProps = {
    imageIds: number[];
} & MessageBubbleProps;

export function ImageMessage({
    type,
    avatarUrl,
    autor,
    time,
    message,
    status,
    imageIds,
}: ImageMessageBubbleProps) {
    const [currentImage, setCurrentImage] = useState(0);
    const [isViewerOpen, setIsViewerOpen] = useState(false);

    const openImageViewer = useCallback((index: number) => {
        setCurrentImage(index);
        setIsViewerOpen(true);
    }, []);

    const closeImageViewer = () => {
        setCurrentImage(0);
        setIsViewerOpen(false);
    };

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

            <div className="chat-bubble pt-4">
                <div
                    onClick={() => openImageViewer(0)}
                    className="stack hover:cursor-pointer"
                >
                    {imageIds.map((id, index) => {
                        if (imageIds.length > 1) {
                            if (index === 0) {
                                return (
                                    <div className="relative" key={index}>
                                        <img
                                            className="object-fill w-28 h-28 md:w-40 rounded"
                                            src={getFullUrl(
                                                getAttachmentUrl(id),
                                            )}
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center h-full rounded bg-base-100 hover:bg-base-200 hover:bg-opacity-80 bg-opacity-80 text-2xl">
                                            {imageIds.length}
                                        </div>
                                    </div>
                                );
                            }
                        }

                        return (
                            <img
                                className="object-fill w-28 h-28 md:w-40 rounded"
                                width={390}
                                height={390}
                                key={index}
                                src={getFullUrl(getAttachmentUrl(id))}
                            />
                        );
                    })}
                </div>
                <div className="mt-0">{message}</div>
            </div>
            <div className="chat-footer opacity-50">{status}</div>
            {isViewerOpen && (
                <ImageViewer
                    src={imageIds.map((id) => getFullUrl(getAttachmentUrl(id)))}
                    currentIndex={currentImage}
                    disableScroll={false}
                    closeOnClickOutside={true}
                    onClose={closeImageViewer}
                    backgroundStyle={{ zIndex: 100 }}
                />
            )}
        </div>
    );
}
