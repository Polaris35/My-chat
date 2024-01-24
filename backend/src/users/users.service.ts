import { ForbiddenException, Injectable } from '@nestjs/common';
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

    findByEmail(email: string) {
        return this.prismaService.user.findFirst({ where: { email } });
    }

    async findById(id: number) {
        return this.prismaService.user.findFirst({ where: { id } });
    }

    async remove(id: number, userId: number) {
        if (id !== userId) {
            throw new ForbiddenException();
        }
        return await this.prismaService.user.delete({
            where: { id: id },
            select: { id: true },
        });
    }

    private hashPassword(password: string) {
        return hashSync(password, genSaltSync(10));
    }
}
