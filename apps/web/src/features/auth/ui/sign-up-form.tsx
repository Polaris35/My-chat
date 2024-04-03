import { UiButton, UiSpinner, UiTextField } from '@/shared/ui';
import { UseSignUpForm } from '../model/use-sign-up-form';
import { ErrorMessage } from '@hookform/error-message';

export function SignUpForm() {
    const {
        register,
        handleSubmit,
        isLoading,
        errorMessage,
        watch,
        validationErrors,
    } = UseSignUpForm();
    const watchFields = watch(['password', 'passwordRepeat']);
    return (
        <form className="grid items-center gap-2" onSubmit={handleSubmit}>
            <UiTextField
                className=""
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
                label="Password"
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
                        validate(value: string) {
                            return value !== watchFields[1]
                                ? 'Password and repeat password should be the same'
                                : false;
                        },
                    }),
                }}
            />
            <UiTextField
                label="Confirm password"
                inputProps={{
                    type: 'password',
                    ...register('passwordRepeat', {
                        required: 'confirm password is required',
                    }),
                }}
            />

            <div className="text-error text-xs">
                {errorMessage && errorMessage}
                <ErrorMessage errors={validationErrors} name="email" />
                <ErrorMessage errors={validationErrors} name="password" />
                <ErrorMessage errors={validationErrors} name="passwordRepeat" />
            </div>

            <div className="flex justify-center min-h-4 h-full mt-4">
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
