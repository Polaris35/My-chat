import {
    attachmentsControllerUploadFile,
    attachmentsControllerUploadImage,
} from '@/shared/api';
import { UiButton, UiSpinner } from '@/shared/ui';
import * as Dialog from '@radix-ui/react-dialog';
import {
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useState,
} from 'react';
import { CiFileOn } from 'react-icons/ci';
import { RxCross2 } from 'react-icons/rx';
import { UseSendMessageMutation } from '../../model/use-send-message-mutation';
import { CurrentConversationContext } from '@/entities/current-conversation';

type UploadAttachmentsDialogProps = {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    files: File[];
    setFiles: Dispatch<SetStateAction<File[]>>;
};
export function SendAttachmentsDialog({
    open,
    setOpen,
    files,
    setFiles,
}: UploadAttachmentsDialogProps) {
    const [message, setMessage] = useState<string>('');
    const { conversationId } = useContext(CurrentConversationContext);
    const [isLoading, setIsLoading] = useState(false);
    const [loadAsImages, setLoadAsImages] = useState(false);
    const mutation = UseSendMessageMutation();
    const handleSubmit = async () => {
        setIsLoading(true);
        if (!loadAsImages) {
            const ids = await Promise.all(
                files.map((file) => {
                    return attachmentsControllerUploadFile({ file });
                }),
            );
            mutation.mutate({
                message: message,
                attachmentList: ids,
                conversationId,
            });
            setIsLoading(false);
            setOpen(false);
            return;
        }

        const imagesIds = await Promise.all(
            files
                .filter((file) => file.type.split('/')[0] === 'image')
                .map((image) => {
                    return attachmentsControllerUploadImage({ image });
                }),
        );
        const documentsIds = await Promise.all(
            files
                .filter((file) => file.type.split('/')[0] !== 'image')
                .map((file) => {
                    return attachmentsControllerUploadFile({ file });
                }),
        );

        if (documentsIds.length === 0) {
            mutation.mutate({
                message: message,
                attachmentList: imagesIds,
                conversationId,
            });
            setIsLoading(false);
            setOpen(false);
            return;
        }
        if (imagesIds.length !== 0) {
            mutation.mutate({
                message: '',
                attachmentList: imagesIds,
                conversationId,
            });
        }
        mutation.mutate({
            message: message,
            attachmentList: documentsIds,
            conversationId,
        });
        setIsLoading(false);
        setOpen(false);
    };
    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0" />
                <Dialog.Content
                    className="fixed top-2/4 left-2/4 bg-base-200 rounded-lg p-7 w-[90vw] max-w-[350px] max-h-[85vh]
                    -translate-y-1/2 -translate-x-1/2"
                >
                    <Dialog.Title className="text-lg font-bold">
                        Upload Attachments
                    </Dialog.Title>
                    <div className="mt-4 flex flex-col gap-2 overflow-hidden overflow-y-auto no-scrollbar max-h-96">
                        {files.map((file, index) => {
                            return (
                                <div
                                    key={index}
                                    className="rounded-md bg-base-300 p-4 flex gap-4 items-center"
                                >
                                    <div className="avatar w-11 h-11 rounded-full border border-base-content flex items-center justify-center">
                                        {file.type.split('/')[0] === 'image' ? (
                                            <img
                                                src={URL.createObjectURL(file)}
                                                className="w-11 h-11 rounded-full"
                                            />
                                        ) : (
                                            <CiFileOn size={34} />
                                        )}
                                    </div>
                                    <div className="flex flex-col justify-around max-w-[20ch]">
                                        <p className="text-md truncate">
                                            {file.name}
                                        </p>
                                        <p className="text-sm">
                                            Size:{' '}
                                            {(file.size / 1024).toFixed(2)}{' '}
                                            Kbytes
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                        {(isLoading || mutation.isPending) && (
                            <div className="flex justify-center my-2">
                                <UiSpinner />
                            </div>
                        )}
                    </div>
                    <div className="form-control mt-2">
                        <label className="cursor-pointer label">
                            <span className="label-text text-md font-medium">
                                Load attachment as images
                            </span>
                            <input
                                type="checkbox"
                                className="toggle toggle-primary"
                                checked={loadAsImages}
                                onChange={() =>
                                    setLoadAsImages((prev) => !prev)
                                }
                            />
                        </label>
                    </div>
                    <div className="flex gap-4 justify-end mt-4">
                        <input
                            placeholder="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="input input-bordered flex-1"
                        />
                        <UiButton onClick={handleSubmit} variant={'primary'}>
                            Send
                        </UiButton>
                    </div>
                    <Dialog.Close asChild>
                        <UiButton
                            disabled={mutation.isPending}
                            className="absolute top-[16px] right-[16px] rounded-full"
                            variant={'ghost'}
                        >
                            <RxCross2 size={14} />
                        </UiButton>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
