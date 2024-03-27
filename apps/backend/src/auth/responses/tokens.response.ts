import { ApiProperty } from '@nestjs/swagger';
import { Tokens as TokensInterface } from '../interfaces';

export class Tokens {
    @ApiProperty()
    accessToken: string;
    @ApiProperty()
    refreshToken: string;
    constructor(tokens: TokensInterface) {
        this.accessToken = tokens.accessToken;
        this.refreshToken = tokens.refreshToken.token;
    }
}
