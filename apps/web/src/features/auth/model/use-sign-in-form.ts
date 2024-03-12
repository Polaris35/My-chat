import { ROUTES } from '@/shared/constants';
import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { authControllerCredentialsLogin } from '@/shared/api';

export function UseSignInForm() {
    const router = useRouter();

    const { register, handleSubmit } = useForm<{
        email: string;
        password: string;
    }>();

    const signInMutation = useMutation({
        mutationFn: authControllerCredentialsLogin,
        onSuccess() {
            router.push(ROUTES.HOME);
        },
    });

    const errorMessage = signInMutation.isError ? 'Sign in faled' : undefined;

    return {
        register,
        errorMessage,
        handleSubmit: handleSubmit((data) => signInMutation.mutate(data)),
        isLoading: signInMutation.isPending,
    };
}
