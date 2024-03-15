import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import {
    authControllerCredentialsLogin,
    authControllerSuccessGoogleAuth,
} from '@/shared/api';
import type { AuthOptions } from 'next-auth';

export const authOptions: AuthOptions = {
    // Configure one or more authentication providers
    providers: [
        CredentialsProvider({
            credentials: {
                email: { label: 'email', type: 'email', required: true },
                password: {
                    label: 'password',
                    type: 'password',
                    required: true,
                },
            },
            async authorize(credentials) {
                console.log(credentials);
                const res = await authControllerCredentialsLogin({
                    email: credentials?.email!,
                    password: credentials?.password!,
                }).catch((error) => console.log(error));
                if (res) {
                    // Any object returned will be saved in `user` property of the JWT
                    return res;
                } else {
                    // If you return null then an error will be displayed advising the user to check their details.
                    return null;
                    // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
                }
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_SECRET!,
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === 'google') {
                // console.log('google accessToken: ' + account?.access_token);
                const dbUser = await authControllerSuccessGoogleAuth({
                    token: account?.access_token!,
                });
                if (!user) return false;
                user = dbUser;
            }
            return true;
        },
        async session({ session, user, token }: any) {
            session.user = token;
            return session;
        },
        async jwt({ token, user, account }: any) {
            return { ...user, ...token };
        },
    },
    pages: {
        signIn: '/sign-in',
    },
};

// export function auth(
//     ...args:
//         | [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']]
//         | [NextApiRequest, NextApiResponse]
//         | []
// ) {
//     return getServerSession(...args, authOptions);
// }
