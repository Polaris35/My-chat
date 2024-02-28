import clsx from 'clsx';
import Image from 'next/image';
import { MdSend } from 'react-icons/md';

interface SendMessageButtonProps {
    className?: string;
    onClick: (event: React.MouseEvent<HTMLElement>) => void;
}

export function SendMessageButton({
    onClick,
    className,
}: SendMessageButtonProps) {
    return (
        <button
            onClick={onClick}
            className={clsx(className, 'btn btn-circle p-0')}
        >
            <MdSend size={25} />
        </button>
    );
}
