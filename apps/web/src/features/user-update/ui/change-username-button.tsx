import { UiButton } from '@/shared/ui';
import { ReactNode, useState } from 'react';
import { ChangeUsernameDialog } from './dialog/change-username-dialog';

type ChangeUsernameButtonProps = {
    children: ReactNode;
    onSuccessfullyChange: () => void;
};

export function ChangeUsernameButton({
    children,
    onSuccessfullyChange,
}: ChangeUsernameButtonProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    return (
        <>
            <UiButton onClick={() => setIsDialogOpen(true)} variant={'primary'}>
                {children}
            </UiButton>
            <ChangeUsernameDialog
                open={isDialogOpen}
                setOpen={setIsDialogOpen}
                onSuccessfullyChange={onSuccessfullyChange}
            />
        </>
    );
}
