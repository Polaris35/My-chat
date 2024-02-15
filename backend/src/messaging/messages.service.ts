import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateMessageDto } from './dto';
import { Message } from '@prisma/client';

@Injectable()
export class MessagesService {
    constructor(private readonly prismaService: PrismaService) {}
    create(dto: CreateMessageDto): Promise<Message> {
        const { senderId, conversationId, message, attachmentList } = dto;
        return this.prismaService.message.create({
            data: {
                senderId,
                conversationId,
                message,
                attachmentList,
            },
        });
    }

    async getRecentMessages(
        conversationId: number,
        skip: number,
    ): Promise<Message[]> {
        return this.prismaService.message.findMany({
            take: 12,
            skip,
            orderBy: {
                createdAt: 'desc',
            },
            where: {
                conversationId,
            },
        });
    }
    delete(id: number) {
        return this.prismaService.message.update({
            where: { id },
            data: {
                isDeleted: true,
            },
            select: { id: true },
        });
    }
}
