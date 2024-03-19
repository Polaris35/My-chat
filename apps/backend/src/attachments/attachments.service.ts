import { Injectable } from '@nestjs/common';
import { Attachment } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class AttachmentsService {
    constructor(private readonly prismaServise: PrismaService) {}
    // create(dto: Partial<Attachment>): Promise<number> {
    //     return this.prismaServise.attachment.create({
    //         data: dto,
    //         select: {
    //             id: true,
    //         },
    //     });
    // }
}
