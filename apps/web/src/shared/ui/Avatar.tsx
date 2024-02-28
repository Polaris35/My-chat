import React from 'react';
import Image from 'next/image';

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
                {/* TODO: сделать лоад с бекенда по айдишнику атачмента */}
                <Image src={url} width={256} height={256} alt={alt!} />
            </div>
        </div>
    );
}
