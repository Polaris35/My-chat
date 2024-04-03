import { UiSpinner, UiTextField } from '@/shared/ui';
import { UseSignInForm } from '../model/use-sign-in-form';
import { UiButton } from '@/shared/ui/ui-button';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

type SignInFormProps = {};

export function SignInForm({}: SignInFormProps) {
    const router = useRouter();
    const { register, handleSubmit, isLoading, errorMessage } = UseSignInForm();
    return (
        <form
            className="grid items-center gap-2 p-10"
            onSubmit={handleSubmit(async (data) => {
                const login = await signIn('credentials', {
                    email: data.email,
                    password: data.password,
                    callbackUrl: '/',
                    redirect: false,
                });
                console.log('login: ', login);
                router.push(login?.url!);
            })}
        >
            <UiTextField
                label="Email"
                inputProps={{
                    type: 'email',
                    ...register('email', { required: true }),
                }}
            />
            <UiTextField
                label="password"
                inputProps={{
                    type: 'password',
                    ...register('password', { required: true }),
                }}
            />
            {errorMessage && (
                <div className="text-error text-xs">{errorMessage}</div>
            )}
            <div className="flex justify-center mt-4">
                {isLoading && <UiSpinner />}
            </div>
            <UiButton
                disabled={isLoading}
                className="mt-4"
                variant="primary"
                type="submit"
            >
                Log in
            </UiButton>
        </form>
    );
}
