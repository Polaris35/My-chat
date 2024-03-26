import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { genSaltSync, hashSync } from 'bcrypt';
import { AttachmentType, type User } from '@prisma/client';
import { AttachmentsService } from '@attachments/attachments.service';

@Injectable()
export class UsersService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly attachmentService: AttachmentsService,
    ) {}

    async save(dto: Partial<User>) {
        const hashedPassword = dto.password
            ? this.hashPassword(dto.password)
            : null;

        const savedUser = await this.prismaService.user.upsert({
            where: {
                email: dto.email,
            },
            update: {
                password: hashedPassword ?? undefined,
                provider: dto?.provider ?? undefined,
            },
            create: {
                email: dto.email,
                name: dto.name ?? dto.email,
                password: hashedPassword,
                image: dto.image ?? 'default',
                provider: dto.provider,
            },
        });
        return savedUser;
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

    async changeImage(id: number, path: string) {
        const imageId = this.attachmentService.create(
            path,
            AttachmentType.IMAGE,
        );
        return this.prismaService.user.update({
            where: {
                id,
            },
            data: {
                //TODO: поменять что бы не было этой захардкоженой ссылки
                image: `http://localhost:3000/api/attachmets?id=${imageId}`,
            },
            select: { image: true },
        });
    }

    private hashPassword(password: string) {
        return hashSync(password, genSaltSync(10));
    }
}
