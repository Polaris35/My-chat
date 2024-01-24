import { $Enums, User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserResponse implements User {
    id: number;
    createdAt: Date;
    email: string;
    image: string;
    name: string;

    @Exclude()
    password: string | null;

    @Exclude()
    provider: $Enums.Provider;

    constructor(user: User) {
        Object.assign(this, user);
    }
}
