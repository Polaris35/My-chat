import { UiSpinner, UiTextField } from '@/shared/ui';
import { UseSignInForm } from '../model/use-sign-in-form';
import { UiButton } from '@/shared/ui/ui-button';

type SignInFormProps = {};

export function SignInForm({}: SignInFormProps) {
    const { register, handleSubmit, isLoading, errorMessage } = UseSignInForm();
    return (
        <form className="grid items-center gap-2 p-10" onSubmit={handleSubmit}>
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
