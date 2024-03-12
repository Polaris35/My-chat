import clsx from 'clsx';
import { InputHTMLAttributes, PropsWithRef } from 'react';

export type UiTextFieldProps = {
    label: string;
    className?: string;
    inputProps?: PropsWithRef<InputHTMLAttributes<HTMLInputElement>>;
};

export function UiTextField({
    label,
    className,
    inputProps,
}: UiTextFieldProps) {
    return (
        <label className={clsx(className, 'form-control')}>
            <div className="label">
                <span className="label-text">{label}</span>
            </div>
            <input {...inputProps} className="input input-bordered" />
        </label>
    );
}
