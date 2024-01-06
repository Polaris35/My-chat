import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'bcrypt';
import { Provider, User } from '@prisma/client';
import { UserResponse } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponse> {
    let user: UserResponse = await this.prismaService.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        image: createUserDto.image,
        password: await hash(createUserDto.password, 10),
        provider: createUserDto.provider as Provider,
      },
    });

    return user;
  }

  async findOne(id: number): Promise<UserResponse> {
    let user = await this.prismaService.user.findUnique({ where: { id: id } });
    if (!user) throw new NotFoundException('user not found');

    return user;
  }

  async update(
    id: number,
    updateUserDto: Partial<User>,
  ): Promise<UserResponse> {
    let user = await this.prismaService.user.update({
      where: { id: id },
      data: updateUserDto,
    });
    if (!user) throw new BadRequestException("can't update user");
    return user;
  }

  async remove(id: number): Promise<UserResponse> {
    let user = await this.prismaService.user.delete({ where: { id: id } });
    if (!user) throw new NotFoundException('user not found');

    return user;
  }
}
