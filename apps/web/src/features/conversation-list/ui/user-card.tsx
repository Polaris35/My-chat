import { UiAvatar } from '@/shared/ui';

type UserCardProps = {
    nickname: string;
    email: string;
    avatarUrl: string;
};

export function UserCard({ nickname, email, avatarUrl }: UserCardProps) {
    return (
        <div className="flex items-center gap-4 p-2 border-y border-neutral border-collapse">
            <UiAvatar url={avatarUrl} size={'medium'} />
            <div className="flex flex-col gap-1 justify-around flex-1">
                <p className="text-base font-medium text-base-content flex-1 truncate max-w-[20ch]">
                    <span>{nickname}</span>
                </p>

                <div className="flex gap-1 flex-1 items-center">
                    <span className="text-sm truncate max-w-[32ch]">
                        {email}
                    </span>
                </div>
            </div>
        </div>
    );
}
