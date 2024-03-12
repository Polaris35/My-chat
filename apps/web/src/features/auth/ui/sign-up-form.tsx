import { UiButton, UiSpinner, UiTextField } from '@/shared/ui';
import { UseSignUpForm } from '../model/use-sign-up-form';

export function SignUpForm() {
    const { register, handleSubmit, isLoading, errorMessage } = UseSignUpForm();
    return (
        <form className="grid items-center gap-2" onSubmit={handleSubmit}>
            <UiTextField
                className=""
                label="Email"
                inputProps={{
                    type: 'email',
                    ...register('email', { required: true }),
                }}
            />
            <UiTextField
                label="Password"
                inputProps={{
                    type: 'password',
                    ...register('password', { required: true }),
                }}
            />
            <UiTextField
                label="Confirm password"
                inputProps={{
                    type: 'password',
                    ...register('passwordRepeat', { required: true }),
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
                className="mt-5"
                variant="primary"
                type="submit"
            >
                Sign up!
            </UiButton>
        </form>
    );
}
