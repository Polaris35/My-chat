import clsx from 'clsx';
import { ButtonHTMLAttributes } from 'react';

type UiButtonVariant = 'primary' | 'accent' | 'ghost';
export type UiButtonProps = {
    variant: UiButtonVariant;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function UiButton({ className, variant, ...props }: UiButtonProps) {
    return (
        <button
            {...props}
            className={clsx(
                className,
                'btn',
                `btn-${variant}`,
                variant !== 'ghost' ? 'btn-outline' : '',
            )}
        />
    );
}
