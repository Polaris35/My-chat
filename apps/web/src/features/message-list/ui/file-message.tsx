import { UiAvatar } from '@/shared/ui';
import clsx from 'clsx';
import { DateTime } from 'luxon';
import { MessageBubbleProps } from './message';
import { CiFileOn } from 'react-icons/ci';
import { UseAttachmentDataMutation } from '../model/use-attachments-data';
import { attachmentsControllerGetFileAttachment } from '@/shared/api';
import { getAttachmentUrl, getFullUrl } from '@/shared/utils';

type FileMessageBubbleProps = {
    fileIds: number[];
} & MessageBubbleProps;

export function FileMessage({
    type,
    avatarUrl,
    autor,
    time,
    message,
    status,
    fileIds,
}: FileMessageBubbleProps) {
    const query = UseAttachmentDataMutation(fileIds);
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

            <div className="chat-bubble">
                <ul className="flex flex-col gap-1">
                    {query.isLoading ? (
                        fileIds.map((id, index) => {
                            return (
                                <li
                                    key={fileIds[index]}
                                    className="flex gap-2 bg-base-200 rounded-md p-2 hover:cursor-pointer hover:bg-base-300 items-center"
                                >
                                    <div className="skeleton w-11 h-11 rounded-full shrink-0"></div>
                                    <div className="flex flex-col justify-between">
                                        <div className="skeleton h-2 w-20"></div>
                                        <div className="skeleton h-2 w-20"></div>
                                    </div>
                                </li>
                            );
                        })
                    ) : (
                        <>
                            {query.data?.map((item) => {
                                return (
                                    <a
                                        href={getFullUrl(
                                            getAttachmentUrl(item.id),
                                        )}
                                        download={true}
                                        key={item.id}
                                        className="flex gap-2 bg-base-200 rounded-md p-2 hover:cursor-pointer hover:bg-base-300 items-center"
                                    >
                                        <div className="avatar w-11 h-11 rounded-full border border-base-content flex items-center justify-center">
                                            <CiFileOn size={34} />
                                        </div>
                                        <div className="flex flex-col justify-between">
                                            <p className="text-md min-w-[30ch] max-w-[30ch] truncate">
                                                {item.fileName}
                                            </p>
                                            <p>
                                                Format:{' '}
                                                <span className="text-sm">
                                                    {item.format}
                                                </span>
                                            </p>
                                        </div>
                                        <div>
                                            Size:{' '}
                                            {(item.size / 1024).toFixed(2)}{' '}
                                            Kbytes
                                        </div>
                                    </a>
                                );
                            })}
                        </>
                    )}
                </ul>
                <div className="mt-0">{message}</div>
            </div>
            <div className="chat-footer opacity-50">{status}</div>
        </div>
    );
}
