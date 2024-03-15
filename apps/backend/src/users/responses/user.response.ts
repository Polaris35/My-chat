import { ApiProperty } from '@nestjs/swagger';
import { $Enums, User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserResponse implements User {
    @ApiProperty({})
    id: number;
    @ApiProperty({})
    createdAt: Date;
    @ApiProperty({})
    email: string;
    @ApiProperty({})
    image: string;
    @ApiProperty({})
    name: string;

    @Exclude()
    password: string | null;

    @Exclude()
    provider: $Enums.Provider;

    constructor(user: User) {
        Object.assign(this, user);
    }
}
