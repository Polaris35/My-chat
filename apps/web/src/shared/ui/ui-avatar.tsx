import React from 'react';
import Image from 'next/image';

type UiAvatarSize = 'small' | 'medium' | 'large';
export interface UiAvatarProps {
    url: string;
    size: UiAvatarSize;
    alt?: string;
}

export function UiAvatar({ url, size, alt }: UiAvatarProps) {
    const pxSize = {
        small: 'w-10',
        medium: 'w-16',
        large: 'w-24',
    }[size];
    return (
        <div className="avatar">
            <div className={`${pxSize} rounded-full`}>
                {/* TODO: сделать лоад с бекенда по айдишнику атачмента */}
                <Image src={url} width={256} height={256} alt={alt!} />
            </div>
        </div>
    );
}
