import type { AppProps } from 'next/app';
import { AppProvider } from './app-provider';
export function App({
    Component,
    pageProps: { session, ...pageProps },
}: AppProps) {
    return (
        <AppProvider session={session}>
            <Component {...pageProps} />
        </AppProvider>
    );
}
