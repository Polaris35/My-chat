import { ROUTES } from '@/shared/constants';
import { ThemeButton, UiAvatar, UiButton } from '@/shared/ui';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { MdSettings } from 'react-icons/md';
import { RxHamburgerMenu } from 'react-icons/rx';
import { Clipboard } from '@/shared/ui';

export function Drawer() {
    const session = useSession();
    const router = useRouter();
    return (
        <div className="drawer w-[48px]">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                <label htmlFor="my-drawer" className="btn btn-circle btn-ghost">
                    <RxHamburgerMenu size={20} />
                </label>
            </div>
            <div className="drawer-side z-50">
                <label
                    htmlFor="my-drawer"
                    aria-label="close sidebar"
                    className="drawer-overlay"
                ></label>
                {/* TODO: для мобилок сдлеать ширину чуть меньше ширины экрана  */}
                <div className="w-96 bg-base-200 min-h-screen flex flex-col">
                    <div className="flex flex-col gap-2 bg-base-300 p-4">
                        <div className="flex justify-between">
                            <UiAvatar
                                url={session.data?.user.image!}
                                size={'large'}
                                alt="user avatar"
                            />
                            {/* <label
                            htmlFor="my-drawer"
                            className="btn btn-circle btn-ghost"
                        >
                            <RxCross2 size={20} />
                        </label> */}
                            <ThemeButton />
                        </div>
                        <div className="flex justify-between p-2 items-center">
                            <div className="flex flex-col g-2">
                                <p className="text-md">
                                    {session.data?.user.name}
                                </p>
                                <Clipboard text={session.data?.user.email!} />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col p-2">
                        <UiButton
                            className="flex justify-start gap-2 text-lg"
                            variant={'ghost'}
                            onClick={() => router.push(ROUTES.PROFILE)}
                        >
                            <MdSettings size={32} /> Setting
                        </UiButton>
                    </div>
                </div>
            </div>
        </div>
    );
}
