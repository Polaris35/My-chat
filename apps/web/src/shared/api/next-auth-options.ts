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
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
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
                const res = await authControllerCredentialsLogin({
                    email: credentials?.email!,
                    password: credentials?.password!,
                }).catch((error) => {
                    console.log(
                        "can't authorize user with credentials, error: ",
                        error.message,
                    );
                });

                if (!res) {
                    return null;
                }

                return res;
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_SECRET!,
        }),
    ],
    events: {
        async signOut({ token }) {
            if (token) {
                await authControllerLogout({
                    refreshToken: token.refreshToken,
                });
            }
        },
    },
    callbacks: {
        async session({ session, token }) {
            session.user = token;
            return session;
        },

        async jwt({ token, user, account, trigger, session }) {
            // processing refresh tokens if access token expired
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
                    console.log('token: ', token);
                }
            }

            // update session data whe called session.update()
            if (trigger === 'update' && token && session) {
                return { ...token, ...session.user };
            }

            // credentials auth handle
            if (account?.provider === 'credentials') {
                return user;
            }
            // google auth handle
            if (account?.provider === 'google' && user) {
                const dbUser = await authControllerGoogleAuth({
                    token: account.access_token!,
                });
                if (dbUser) {
                    return dbUser;
                }
                throw new Error('Google auth failed, no db user provided');
            }

            return token;
        },
    },
    pages: {
        signIn: ROUTES.SINGIN,
    },
};
