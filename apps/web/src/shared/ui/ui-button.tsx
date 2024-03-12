import clsx from 'clsx';
import { ButtonHTMLAttributes } from 'react';

type UiButtonVariant = 'primary' | 'accent';
export type UiButtonProps = {
    variant: UiButtonVariant;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function UiButton({ className, variant, ...props }: UiButtonProps) {
    return (
        <button
            {...props}
            className={clsx(className, 'btn btn-outline', `btn-${variant}`)}
        />
    );
}
