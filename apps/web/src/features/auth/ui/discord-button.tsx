import clsx from 'clsx';
import { FaDiscord } from 'react-icons/fa6';

type DiscordButtonProps = {
    className?: string;
    text: string;
};
export function DiscordButton({ className, text }: DiscordButtonProps) {
    return (
        <button
            className={clsx(className, 'btn btn-outline btn-secondary')}
            onClick={() => {}}
        >
            <FaDiscord />
            {text}
        </button>
    );
}
