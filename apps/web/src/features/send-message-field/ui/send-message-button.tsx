import clsx from 'clsx';
import { ButtonHTMLAttributes } from 'react';
import { MdSend } from 'react-icons/md';

export type SendMessageButtonProps =
    {} & ButtonHTMLAttributes<HTMLButtonElement>;
export function SendMessageButton({
    className,
    ...props
}: SendMessageButtonProps) {
    return (
        <button {...props} className={clsx(className, 'btn btn-circle p-0')}>
            <MdSend size={25} />
        </button>
    );
}
