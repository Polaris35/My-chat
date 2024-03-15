import { ROUTES } from '@/shared/constants';
import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { LoginDto } from '@/shared/api';
import { SignInOptions, signIn } from 'next-auth/react';

interface SignInVariables {
    provider?: string;
    options?: SignInOptions;
    authorizationParams?: any;
}

export function UseSignInForm() {
    const router = useRouter();

    const { register, handleSubmit } = useForm<LoginDto>();

    const signInMutation = useMutation<void, Error, SignInVariables>({
        mutationFn: async (variables) => {
            // const { provider, options, authorizationParams } = variables;
            // console.log(variables);
            // const response = await signIn(
            //     provider,
            //     options,
            //     authorizationParams,
            // );
            // if (!response || response.error) {
            //     throw new Error(response?.error!);
            // }
            // router.push('/');
        },
    });

    const handleSignIn = async (variables: SignInVariables) => {
        const { provider, options, authorizationParams } = variables;
        console.log(variables);
        const response = await signIn(provider, options, authorizationParams);
        if (!response || response.error) {
            console.log(response?.error);
        }
        router.push('/');
    };

    const errorMessage = signInMutation.isError
        ? signInMutation.error.message
        : undefined;

    return {
        register,
        errorMessage,
        handleSubmit: handleSubmit,
        isLoading: signInMutation.isPending,
    };
}
