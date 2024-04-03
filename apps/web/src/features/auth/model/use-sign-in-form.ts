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
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginDto>();

    const handleSignIn = async (variables: SignInVariables) => {
        const { provider, options, authorizationParams } = variables;
        console.log(variables);
        const response = await signIn(provider, options, authorizationParams);
        // if (!response || response.error) {
        //     console.log(response?.error);
        // }
    };

    const signInMutation = useMutation<void, Error, SignInVariables>({
        mutationFn: handleSignIn,
        onSuccess: () => {
            router.push(ROUTES.HOME);
        },
    });

    const errorMessage = signInMutation.isError
        ? signInMutation.error.message
        : null;

    return {
        register,
        errorMessage,
        validationErrors: errors,
        // handleSubmit: handleSubmit,
        handleSubmit: handleSubmit((data) => {
            signInMutation.mutate({
                provider: 'credentials',
                options: {
                    email: data.email,
                    password: data.password,
                    callbackUrl: ROUTES.HOME,
                    redirect: false,
                },
            });
        }),
        isLoading: signInMutation.isPending,
    };
}
