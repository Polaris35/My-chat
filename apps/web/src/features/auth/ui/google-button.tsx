import clsx from 'clsx';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import router from 'next/router';
import { FcGoogle } from 'react-icons/fc';

type GoogleButtonProps = {
    className?: string;
    text: string;
};

export function GoogleButton({ className, text }: GoogleButtonProps) {
    return (
        <button
            className={clsx(className, 'btn btn-outline btn-secondary')}
            // onClick={() => {
            //     mutation.mutate({});
            // }}
            onClick={() => signIn('google')}
        >
            <FcGoogle /> {text}
        </button>
    );
}
