import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import {
    authControllerCredentialsLogin,
    authControllerGoogleAuth,
    authControllerLogout,
    authControllerRefreshTokens,
} from '@/shared/api';
import type { AuthOptions } from 'next-auth';
import { ROUTES } from '../constants';
import { DateTime } from 'luxon';

export const authOptions: AuthOptions = {
    session: {
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
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
    events: {
        async signOut({ token }: any) {
            await authControllerLogout({ refreshToken: token.refreshToken });
        },
    },
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === 'google') {
                const dbUser = await authControllerGoogleAuth({
                    token: account?.access_token!,
                });
                if (!user) return false;
                Object.assign(user, dbUser);
            }
            return true;
        },
        async session({ session, user, token }: any) {
            session.user = token;

            return session;
        },
        async jwt({ token, user, account }: any) {
            console.log(token.refreshToken);

            //processing refresh tokens if access token expired
            if (token.accessToken) {
                const payload = JSON.parse(
                    Buffer.from(
                        token?.accessToken.split('.')[1],
                        'base64',
                    ).toString(),
                );

                if (DateTime.now() > DateTime.fromSeconds(payload.exp)) {
                    const tokens = await authControllerRefreshTokens({
                        refreshToken: token.refreshToken,
                    });
                    console.log(tokens);
                    if (!tokens) {
                        return { error: "can't refresh tokens" };
                    }
                    token.accessToken = tokens.accessToken;
                    token.refreshToken = tokens.refreshToken;
                }
            }
            return { ...user, ...token };
        },
    },
    pages: {
        signIn: ROUTES.SINGIN,
    },
};
