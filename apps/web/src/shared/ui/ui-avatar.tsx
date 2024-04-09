import React from 'react';

type UiAvatarSize = 'small' | 'medium' | 'large';
export interface UiAvatarProps {
    url: string;
    size: UiAvatarSize;
    alt?: string;
}

export function UiAvatar({ url, size, alt }: UiAvatarProps) {
    const pxSize = {
        small: 'w-10 h-10',
        medium: 'w-12 h-12',
        large: 'w-20 h-20',
    }[size];
    return (
        <div className="avatar">
            <div className={`${pxSize} rounded-full`}>
                <img src={url} width={256} height={256} alt={alt!} />
            </div>
        </div>
    );
}
