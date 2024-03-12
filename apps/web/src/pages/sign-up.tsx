import { DiscordButton, SignUpForm, GoogleButton } from '@/features/auth';
import { ROUTES } from '@/shared/constants';
import { UiLink } from '@/shared/ui';
import Image from 'next/image';

export function SignUpPage() {
    return (
        <div className="min-h-screen flex items-center justify-center gap-10">
            <div className="hidden flex-col w-[400px] items-center lg:flex">
                <Image
                    src="./app-logo.svg"
                    width={180}
                    height={180}
                    alt="app-logo"
                />

                <div className="text-center flex flex-col gap-5">
                    <h2 className="text-3xl font-bold">Wellcome to My-Chat</h2>
                    <span>
                        Lorem ipsum dolor, sit amet consectetur adipisicing
                        elit. Libero, iusto est, nobis consequuntur, fugiat
                        ratione asperiores culpa deleniti ullam animi totam
                        excepturi rem deserunt officiis in? Culpa sed nihil est.
                    </span>
                    <span>
                        Lorem ipsum dolor, sit amet consectetur adipisicing
                        elit. Libero, iusto est, nobis consequuntur, fugiat
                        ratione asperiores culpa deleniti ullam animi totam
                        excepturi rem deserunt officiis in? Culpa sed nihil est.
                    </span>
                </div>
            </div>
            <main className="flex flex-col gap-4 items-center">
                <div className="card min-w-[450px] p-10 bg-base-200 shadow-xl self-center">
                    <h1 className="text-2xl font-bold">Create your account</h1>
                    <SignUpForm />

                    <div className="divider">OR</div>

                    <div className="flex flex-col gap-2">
                        <GoogleButton text="Sign in with google" />
                        <DiscordButton text="Sign in with discord" />
                    </div>
                </div>
                <span>
                    {'Already have an account?'}{' '}
                    <UiLink href={ROUTES.SINGIN}>sign in!</UiLink>{' '}
                </span>
            </main>
        </div>
    );
}
