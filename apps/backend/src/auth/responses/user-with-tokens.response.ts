import { Tokens } from '@auth/interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { UserResponse } from '@users/responses';

export class ResponseUserWithTokens extends UserResponse {
    @ApiProperty({})
    accessToken: string;
    @ApiProperty({})
    refreshToken: string;

    constructor(user: User, tokens: Tokens) {
        super(user);
        this.accessToken = tokens.accessToken;
        this.refreshToken = tokens.refreshToken.token;
    }
}
