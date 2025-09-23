import { ChangeUsernameButton } from '@/features/user-update';
import { ROUTES } from '@/shared/constants';
import { UiButton, UiAvatar } from '@/shared/ui';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { RxCrossCircled } from 'react-icons/rx';

export function ProfilePage() {
    const session = useSession();

    return (
        <main className="form-control items-center justify-center min-h-screen">
            <div className="relative card bg-base-200 min-w-96 py-10 px-5">
                <div className="flex items-center gap-5">
                    <UiAvatar
                        url={session.data?.user?.image as string}
                        size={'medium'}
                    />
                    <h3>{session.data?.user?.name}</h3>
                </div>
                <div className="form-control gap-3 mt-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="label p-0">
                                <span className="label-text text-primary">
                                    username
                                </span>
                            </label>
                            <span className="label-text">
                                {session.data?.user?.name}
                            </span>
                        </div>
                        <ChangeUsernameButton
                            onSuccessfullyChange={() => {
                                console.log('successfully change username');
                                session.update();
                            }}
                        >
                            Edit
                        </ChangeUsernameButton>
                    </div>
                </div>
                <div className="divider"></div>
                <div>
                    <label className="label p-0">
                        <span className="label-text text-primary">Avatar</span>
                    </label>
                    <div className="flex items-center gap-5 mt-3">
                        <UiButton variant={'primary'}>Change avatar</UiButton>
                        <button className="btn-link">Reset avatar</button>
                    </div>
                </div>
                <Link
                    href={ROUTES.HOME}
                    className="absolute right-[-15px] top-[-15px] flex flex-col justify-center items-center text-sm"
                >
                    <RxCrossCircled size={30} />
                    <span className="uppercase">esc</span>
                </Link>
            </div>
        </main>
    );
}
