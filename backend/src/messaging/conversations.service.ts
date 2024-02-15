import { Injectable } from '@nestjs/common';
import { CreateConversationDto } from './dto';
import { PrismaService } from '@prisma/prisma.service';
import { Conversation } from '@prisma/client';

const DEFAULT_AVATAR_ID = 1;

@Injectable()
export class ConversationsService {
    constructor(private readonly prismaService: PrismaService) {}
    create(dto: CreateConversationDto): Promise<Conversation> {
        const { title, creatorId, avatarId } = dto;
        const avatarUrl = [avatarId ?? DEFAULT_AVATAR_ID];
        return this.prismaService.conversation.create({
            data: {
                title,
                creatorId,
                avatarUrl,
            },
        });
    }

    addUserToConversation(userId: number, conversationId: number) {
        return this.prismaService.participant.create({
            data: {
                userId,
                conversationId,
            },
        });
    }

    deleteUserFromComversation(userId: number, conversationId: number) {
        return this.prismaService.participant.delete({
            where: {
                userId_conversationId: { userId, conversationId },
            },
        });
    }

    async isAMember(userId: number, conversationId: number): Promise<boolean> {
        const participant = await this.prismaService.participant.findFirst({
            where: {
                AND: [{ userId }, { conversationId }],
            },
        });
        return participant !== null;
    }

    delete(id: number) {
        return this.prismaService.conversation.delete({
            where: { id },
            select: { id: true },
        });
    }
}
