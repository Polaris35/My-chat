import { DiscordButton, SignInForm, GoogleButton } from '@/features/auth';
import { ROUTES } from '@/shared/constants';
import { UiLink } from '@/shared/ui';
import Image from 'next/image';

export function SignInPage() {
    return (
        <main className="min-h-screen form-control items-center justify-center">
            <div className="w-96 grid justify-center items-center gap-4">
                <div className="flex items-center justify-center">
                    <Image
                        src="./app-logo.svg"
                        width={120}
                        height={120}
                        alt="app-logo"
                    />
                </div>

                <div className="form-control gap-2">
                    <GoogleButton text="Sign in with google" />
                    <DiscordButton text="Sign in with discord" />
                </div>

                <div className="card bg-base-200 shadow-xl self-center">
                    <SignInForm />
                </div>

                <span className="text-center">
                    {"Don't have an account?"}{' '}
                    <UiLink href={ROUTES.SIGNUP}>sign up!</UiLink>{' '}
                </span>
            </div>
        </main>
    );
}
