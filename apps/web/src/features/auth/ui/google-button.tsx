import clsx from 'clsx';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { FcGoogle } from 'react-icons/fc';

type GoogleButtonProps = {
    className?: string;
    text: string;
};

export function GoogleButton({ className, text }: GoogleButtonProps) {
    const router = useRouter();
    return (
        <button
            className={clsx(className, 'btn btn-outline btn-secondary')}
            onClick={async () => {
                const login = await signIn('google', {
                    callbackUrl: '/',
                    redirect: false,
                });
                router.push(login?.url!);
            }}
        >
            <FcGoogle /> {text}
        </button>
    );
}
