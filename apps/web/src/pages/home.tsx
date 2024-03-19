import { ROUTES } from '@/shared/constants';
import { UiButton, UiLink } from '@/shared/ui';
import { signIn, signOut, useSession } from 'next-auth/react';

export function HomePage() {
    const session = useSession();
    console.log(session);
    return (
        <main
            className={'flex min-h-screen flex-col items-center justify-center'}
        >
            <div className="flex">
                {session.data?.user ? (
                    <UiButton
                        onClick={() => {
                            signOut();
                        }}
                        variant="primary"
                    >
                        Sign out{' '}
                    </UiButton>
                ) : (
                    <UiButton
                        onClick={() => {
                            signIn();
                        }}
                        variant="primary"
                    >
                        Sign in
                    </UiButton>
                )}
            </div>
            <UiLink href={ROUTES.PROFILE}>Profile</UiLink>
        </main>
    );
}
