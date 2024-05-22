import { Injectable } from '@nestjs/common';
import { AttachmentType } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';
import * as fs from 'fs';
import { AttachmentDataResponse } from './responses';

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
        const fileNameWithUuid = url
            .replaceAll('\\', '/')
            .split('/')
            .reverse()[0];
        const fileName = fileNameWithUuid.split('-').reverse()[0];
        return fileName;
    }

    async getAttachmentData(ids: number[]): Promise<AttachmentDataResponse[]> {
        return Promise.all(
            ids.map(async (id) => {
                const attachment = await this.find(id);
                const stats = fs.statSync(attachment.url);

                const fileName = this.getFileName(attachment.url);
                const format = fileName.split('.').reverse()[0].toUpperCase();

                return {
                    id,
                    fileName,
                    format,
                    size: stats.size,
                };
            }),
        );
    }
}
