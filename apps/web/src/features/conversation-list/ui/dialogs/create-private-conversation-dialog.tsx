import { addPrivateConversationMutation } from '@/entities/conversation-list';
import { UiButton, UiSpinner } from '@/shared/ui';
import * as Dialog from '@radix-ui/react-dialog';
import { ReactNode, useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { SearchField } from '../search-field';
import { FindUserByPartialEmail } from '../../api/find-user-by-patrial-email';
import { Conversation } from '../conversation';
import { UserCard } from '../user-card';

type CreatePrivateConversationDialogProps = {
    trigger: ReactNode;
};
export function CreatePrivateConversationDialog({
    trigger,
}: CreatePrivateConversationDialogProps) {
    const [open, setOpen] = useState(false);
    const mutation = addPrivateConversationMutation();
    const { email, setEmail, isLoading, data } = FindUserByPartialEmail();

    if (mutation.isSuccess) {
        setOpen(false);
    }
    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0" />
                <Dialog.Content
                    className="fixed top-2/4 left-2/4 bg-base-200 rounded-lg p-7 w-[90vw] max-w-[350px] md:max-w-[450px] max-h-[85vh]
                    -translate-y-1/2 -translate-x-1/2 min-h-96 h-full xl:max-h-[680px] flex flex-col"
                >
                    <Dialog.Description className="text-sm">
                        <p className="block my-2 font-medium text-lg">
                            New Message
                        </p>
                        <SearchField
                            inputProps={{
                                value: email,
                                onChange: (e) => setEmail(e.target.value),
                            }}
                        />
                    </Dialog.Description>
                    <div className="flex-1 overflow-y-auto no-scrollbar mt-4">
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <UiSpinner />
                            </div>
                        ) : (
                            <div className="flex flex-col overflow-y-auto no-scroll">
                                {data?.map((user) => {
                                    return (
                                        <button
                                            onClick={() => {
                                                // TODO: добавить изменение выбраного диалога на созданый
                                                mutation.mutate({
                                                    userId: user.id,
                                                });
                                            }}
                                        >
                                            <UserCard
                                                nickname={user.name}
                                                email={user.email}
                                                avatarUrl={user.image}
                                            />
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
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
