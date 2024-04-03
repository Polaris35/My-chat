import { UiSpinner, UiTextField } from '@/shared/ui';
import { UseSignInForm } from '../model/use-sign-in-form';
import { UiButton } from '@/shared/ui/ui-button';
import { ErrorMessage } from '@hookform/error-message';
export function SignInForm() {
    const {
        register,
        handleSubmit,
        isLoading,
        errorMessage,
        validationErrors,
    } = UseSignInForm();
    console.log(validationErrors);
    return (
        <form className="grid items-center gap-2 p-10" onSubmit={handleSubmit}>
            <UiTextField
                label="Email"
                inputProps={{
                    type: 'email',
                    ...register('email', {
                        required: 'Email Address is required',
                        pattern: {
                            value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                            message: 'Invalid email address',
                        },
                    }),
                }}
            />

            <UiTextField
                label="password"
                inputProps={{
                    type: 'password',
                    ...register('password', {
                        required: 'password is required',
                        minLength: {
                            value: 4,
                            message:
                                'password must be greater than or equal to 4 characters',
                        },
                        maxLength: {
                            value: 18,
                            message: 'Password must be less than 19 characters',
                        },
                    }),
                }}
            />

            <div className="text-error min-h-4 h-full text-xs">
                {errorMessage && errorMessage}
                <ErrorMessage errors={validationErrors} name="email" />
                <ErrorMessage errors={validationErrors} name="password" />
            </div>

            <div className="flex justify-center min-h-[24px] h-full mt-4">
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
