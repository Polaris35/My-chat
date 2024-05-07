import * as Dialog from '@radix-ui/react-dialog';
import { ReactNode, useEffect, useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { UiButton, UiTextField } from '@/shared/ui';
import { AvatarUploader } from '@/shared/ui/avatar-uploader';
import { UseGroupConversationForm } from '../../model/use-group-conversation-form';

type CreateGroupConversationDialogProps = {
    trigger: ReactNode;
};

export function CreateGroupConversationDialog({
    trigger,
}: CreateGroupConversationDialogProps) {
    const [open, setOpen] = useState(false);
    const { handleSubmit, setImage, title, setTitle } =
        UseGroupConversationForm();

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0" />
                <Dialog.Content
                    className="fixed top-2/4 left-2/4 bg-base-200 rounded-lg p-7 w-[90vw] max-w-[350px] max-h-[85vh]
                    -translate-y-1/2 -translate-x-1/2"
                >
                    <Dialog.Title className="text-lg font-bold">
                        New Group
                    </Dialog.Title>
                    <Dialog.Description className="text-sm mt-2">
                        Create your own group conversation here. Click create
                        when you're done.
                    </Dialog.Description>
                    <form
                        onSubmit={async (event) => {
                            await handleSubmit();
                            setOpen(false);
                            event.preventDefault();
                        }}
                    >
                        <div className="flex justify-center mt-2">
                            <AvatarUploader setImage={setImage} />
                        </div>
                        <UiTextField
                            className="mt-2"
                            label={'Conversation title'}
                            inputProps={{
                                maxLength: 32,
                                value: title!,
                                onChange: (event) =>
                                    setTitle(event.target.value),
                            }}
                        />
                        <div className="flex justify-end mt-6">
                            <UiButton
                                // disabled={isLoading}
                                type="submit"
                                variant={'primary'}
                            >
                                Create
                            </UiButton>
                        </div>
                    </form>
                    <Dialog.Close asChild>
                        <UiButton
                            className="absolute top-[10px] right-[10px] rounded-full"
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
