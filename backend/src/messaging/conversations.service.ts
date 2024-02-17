import { Injectable } from '@nestjs/common';
import { CreateGroupConversationDto } from './dto';
import { PrismaService } from '@prisma/prisma.service';
import {
    Conversation,
    ConversationType,
    ParticipantRole,
} from '@prisma/client';
import { DEFAULT_AVATAR_ID } from 'src/constants';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class ConversationsService {
    constructor(private readonly prismaService: PrismaService) {}
    async createGroup(dto: CreateGroupConversationDto): Promise<Conversation> {
        const { title, creatorId, avatarId } = dto;
        const avatarUrl = [avatarId ?? DEFAULT_AVATAR_ID];
        const conversation = await this.prismaService.conversation.create({
            data: {
                title,
                creatorId,
                avatarUrl,
                type: ConversationType.GROUP,
            },
        });
        await this.addUserToConversation(
            creatorId,
            conversation.id,
            ParticipantRole.ADMIN,
        );
        return conversation;
    }

    async createPrivateConversation(idCreator: number, idUser: number) {
        const conversation = await this.prismaService.conversation.create({
            data: {
                title: 'Private conversation',
                creatorId: idCreator,
                type: ConversationType.PRIVATE,
            },
        });
        [idCreator, idUser].map((id) => {
            this.addUserToConversation(
                id,
                conversation.id,
                ParticipantRole.ADMIN,
            );
        });
        return conversation;
    }

    findParticipant(userId: number, conversationId: number) {
        return this.prismaService.participant.findFirst({
            where: { AND: [{ userId }, { conversationId }] },
        });
    }

    updateUserRole(
        userId: number,
        conversationId: number,
        role: ParticipantRole,
    ) {
        return this.prismaService.participant.update({
            where: { userId_conversationId: { userId, conversationId } },
            data: { role },
        });
    }
    addUserToConversation(
        userId: number,
        conversationId: number,
        role: ParticipantRole = ParticipantRole.USER,
    ) {
        return this.prismaService.participant.create({
            data: {
                userId,
                conversationId,
                role,
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

    async getMembersIds(conversationId: number): Promise<number[]> {
        const members = await this.prismaService.participant.findMany({
            where: {
                conversationId,
            },
            select: {
                userId: true,
            },
        });
        return members.map((member) => member.userId);
    }

    async deleteConversation(idConversation: number, idUser: number) {
        const conversation = await this.prismaService.conversation.findFirst({
            where: {
                AND: [{ id: idConversation }, { creatorId: idUser }],
            },
        });
        if (!conversation) {
            throw new WsException("You don't have permision to do that");
        }

        return this.prismaService.conversation.delete({
            where: { id: idConversation },
            select: { id: true },
        });
    }
}
