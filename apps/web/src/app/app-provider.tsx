import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { ReactNode, useState } from 'react';

export function AppProvider({
    session,
    children,
}: {
    session: Session;
    children?: ReactNode;
}) {
    const [queryClient] = useState(() => new QueryClient());
    return (
        <SessionProvider session={session}>
            <ThemeProvider>
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            </ThemeProvider>
        </SessionProvider>
    );
}
