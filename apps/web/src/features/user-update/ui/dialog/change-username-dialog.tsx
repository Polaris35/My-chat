import { UiButton, UiSpinner, UiTextField } from '@/shared/ui';
import * as Dialog from '@radix-ui/react-dialog';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { UseChangeUsername } from '../../model/use-change-username-mutation';
import { useSession } from 'next-auth/react';

type ChangeUsernameDialogProps = {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    onSuccessfullyChange: () => void;
};

export function ChangeUsernameDialog({
    open,
    setOpen,
    onSuccessfullyChange,
}: ChangeUsernameDialogProps) {
    const mutation = UseChangeUsername();
    const [newUsername, setNewUsername] = useState('');
    const session = useSession();

    useEffect(() => {
        if (mutation.isSuccess) {
            console.log(mutation.data);
            session.update({ user: { name: mutation.data } });
            setNewUsername('');
            setOpen(false);
        }
    }, [mutation.isSuccess]);
    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0" />
                <Dialog.Content
                    className="fixed top-2/4 left-2/4 bg-base-200 rounded-xl p-10 w-[90vw] h-[400px] max-w-[650px] max-h-[85vh]
                        -translate-y-1/2 -translate-x-1/2"
                >
                    <Dialog.Title className="text-lg font-bold">
                        Change username
                    </Dialog.Title>
                    <div className="mt-4 flex flex-col items-center justify-between gap-4 overflow-hidden overflow-y-auto no-scrollbar h-full pb-6 max-h-96">
                        {mutation.isPending && (
                            <div className="flex justify-center my-2">
                                <UiSpinner />
                            </div>
                        )}

                        <UiTextField
                            inputProps={{
                                value: newUsername,
                                onChange: (e) => {
                                    setNewUsername(e.target.value);
                                },
                                placeholder: 'type new username here',
                            }}
                            label={'New username'}
                        />
                        {mutation.isError && (
                            <p className="text-error">
                                {mutation.error.message}
                            </p>
                        )}
                        <UiButton
                            onClick={() => {
                                mutation.mutate(newUsername);
                            }}
                            className="max-w-[320px]"
                            variant={'primary'}
                        >
                            Change
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
