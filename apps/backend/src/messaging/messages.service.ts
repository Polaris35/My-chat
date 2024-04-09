import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateMessageDto } from './dto';
import { Message, MessageType } from '@prisma/client';
import { SYSTEM_USER_ID } from 'src/constants';

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
                attachmentList: attachmentList ?? undefined,
            },
        });
    }

    findOne(id: number) {
        return this.prismaService.message.findUnique({
            where: { id },
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

    async createSystemMessage(
        conversationId: number,
        message: string,
    ): Promise<Message> {
        return this.prismaService.message.create({
            data: {
                senderId: SYSTEM_USER_ID,
                conversationId,
                message,
                type: MessageType.SYSTEM_MESSAGE,
                attachmentList: undefined,
            },
        });
    }
    delete(id: number) {
        //TODO: не удалять системное сообщение
        return this.prismaService.message.update({
            where: { id },
            data: {
                isDeleted: true,
            },
            select: { id: true },
        });
    }
}
