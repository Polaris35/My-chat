import clsx from 'clsx';
import { useState } from 'react';

type ClipboardProps = {
    className?: string;
    text: string;
};
export function Clipboard({ className, text }: ClipboardProps) {
    const [isEmailCopied, setIsEmailCopied] = useState(false);
    return (
        <div
            className={clsx('tooltip tooltip-bottom', className)}
            data-tip={isEmailCopied ? 'Copied!' : 'Copy to clipboard'}
        >
            <button
                className="label-text"
                onClick={() => {
                    navigator.clipboard.writeText(text);
                    setIsEmailCopied(true);

                    setTimeout(() => {
                        setIsEmailCopied(false);
                    }, 3000);
                }}
            >
                {text}
            </button>
        </div>
    );
}
