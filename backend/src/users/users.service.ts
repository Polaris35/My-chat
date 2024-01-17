import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { genSaltSync, hashSync } from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private readonly prismaService: PrismaService) {}

    async save(dto: Partial<User>) {
        const userPassword = dto.password
            ? this.hashPassword(dto.password)
            : null;
        return await this.prismaService.user.create({
            data: {
                name: dto.email,
                email: dto.email,
                image: 'default',
                password: userPassword,
                provider: 'credentials',
            },
        });
    }

    async findOne(idOrEmail: number | string) {
        const whereCondition =
            typeof idOrEmail === 'number'
                ? { id: idOrEmail }
                : { email: idOrEmail };

        return await this.prismaService.user.findFirst({
            where: {
                OR: [whereCondition],
            },
        });
    }

    async remove(id: number) {
        return await this.prismaService.user.delete({
            where: { id: id },
        });
    }

    private hashPassword(password: string) {
        return hashSync(password, genSaltSync(10));
    }
}
