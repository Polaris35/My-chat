import { LoginDto } from '@auth/dto';
import type { User } from '@prisma/client';

export interface Provider {
    autorize(dtoOrAccessToken: LoginDto | string): Promise<User>;
}
