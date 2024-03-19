import { Token } from '@prisma/client';

export class Tokens {
    accessToken: string;
    refreshToken: Token;
}

export interface JwtPayload {
    id: number;
    email: string;
}
