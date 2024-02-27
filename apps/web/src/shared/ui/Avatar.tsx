import React from 'react';

type AvatarSize = 'small' | 'medium' | 'large';
export interface AvatarProps {
    url: string;
    size: AvatarSize;
    alt?: string;
}

export function Avatar({ url, size, alt }: AvatarProps) {
    const pxSize = {
        small: 'w-10',
        medium: 'w-16',
        large: 'w-24',
    }[size];
    return (
        <div className="avatar">
            <div className={`${pxSize} rounded-full`}>
                {/* TODO: заменить на next/image */}
                <img src={url} alt={alt} />
            </div>
        </div>
    );
}
