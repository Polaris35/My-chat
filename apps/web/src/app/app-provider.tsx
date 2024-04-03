import { queryClient } from '@/shared/api/query-client';
import { QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';

export function AppProvider({ children }: { children?: ReactNode }) {
    return (
        <SessionProvider>
            <ThemeProvider>
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            </ThemeProvider>
        </SessionProvider>
    );
}
