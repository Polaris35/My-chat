import { ROUTES } from '@/shared/constants';
import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { RegisterDto, authControllerCredentialsRegister } from '@/shared/api';

export function UseSignUpForm() {
    const router = useRouter();

    const { register, handleSubmit } = useForm<RegisterDto>();

    const signUpMutation = useMutation({
        mutationFn: authControllerCredentialsRegister,
        onSuccess() {
            router.push(ROUTES.SINGIN);
        },
    });

    const errorMessage = signUpMutation.isError
        ? signUpMutation.error.message
        : undefined;

    return {
        register,
        errorMessage,
        handleSubmit: handleSubmit((data) => signUpMutation.mutate(data)),
        isLoading: signUpMutation.isPending,
    };
}
