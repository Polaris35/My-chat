import NextAuth from 'next-auth/next';

declare module 'next-auth' {
    interface User {
        id: number;
        name: string;
        email: string;
        image: string;
        accessToken: string;
        refreshToken: string;
    }
    interface Session {
        user: {
            id: number;
            name: string;
            email: string;
            image: string;
            accessToken: string;
            refreshToken: string;
        };
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: number;
        name: string;
        email: string;
        image: string;
        accessToken: string;
        refreshToken: string;
    }
}
