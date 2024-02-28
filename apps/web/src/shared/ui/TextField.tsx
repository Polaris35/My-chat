import clsx from 'clsx';

export interface TextFieldProps {
    label: string;
    onChange: (value: string) => void;
    value: string;
    className: string;
    placeholder: string;
}

export function TextField({
    label,
    onChange,
    value,
    className,
    placeholder,
}: TextFieldProps) {
    return (
        <label className={clsx(className, 'form-control')}>
            <div className="label">
                <span className="label-text">{label}</span>
            </div>
            <input
                type="text"
                placeholder={placeholder}
                className="input input-bordered"
                onChange={(e) => onChange(e.target.value)}
                value={value}
            />
        </label>
    );
}
