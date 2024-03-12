import { authControllerGoogleAuth } from '@/shared/api';
import { useMutation } from '@tanstack/react-query';
import clsx from 'clsx';
import { FcGoogle } from 'react-icons/fc';

type GoogleButtonProps = {
    className?: string;
    text: string;
};

export function GoogleButton({ className, text }: GoogleButtonProps) {
    // const mutation = useMutation({
    //     mutationFn: authControllerGoogleAuth,
    //     onSuccess(data, variables, context) {
    //         console.log(data, variables, context);
    //     },
    // });
    return (
        <a
            className={clsx(className, 'btn btn-outline btn-secondary')}
            // onClick={() => {
            //     mutation.mutate({});
            // }}
            href="/apis/auth/google"
        >
            <FcGoogle /> {text}
        </a>
    );
}
