import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserResponse implements User {
  id: number;
  createdAt: Date;
  email: string;
  image: string;
  name: string;
  @Exclude()
  password: string;
  @Exclude()
  provider;
  constructor(user: User) {
    Object.assign(this, user);
  }
}
