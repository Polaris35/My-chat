import { Injectable } from '@nestjs/common';
import { AttachmentType } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class AttachmentsService {
    constructor(private readonly prismaServise: PrismaService) {}
    create(path: string, type: AttachmentType) {
        return this.prismaServise.attachment.create({
            data: {
                url: path,
                type,
            },
            select: {
                id: true,
            },
        });
    }
    async find(id: number) {
        return this.prismaServise.attachment.findUnique({
            where: { id },
        });
    }

    getFileName(url: string) {
        const fileNameWithUuid = url.split('/').reverse()[0];
        const fileName = fileNameWithUuid.split('-').reverse()[0];
        return fileName;
    }
}
