import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateGroupConversationDto } from './dto';
import { PrismaService } from '@prisma/prisma.service';
import {
    Conversation,
    ConversationType,
    Participant,
    ParticipantRole,
} from '@prisma/client';
import { DEFAULT_AVATAR_ID } from 'src/constants';
import { EmmitEvent } from '@events/decorators';
import { MESSAGING } from '@events/constants';
import { EventManager } from '@events/event-manager';

@Injectable()
export class ConversationsService {
    constructor(
        private readonly prismaService: PrismaService,
        // don't remove this dependency, it's used under the hood by event decorator
        private readonly eventManager: EventManager,
    ) {}
    @EmmitEvent(MESSAGING.NEW_CONVERSATION)
    async createGroup(
        dto: CreateGroupConversationDto,
        creatorId: number,
    ): Promise<Conversation> {
        const { title, avatarId } = dto;
        const avatarUrl = [avatarId ?? DEFAULT_AVATAR_ID];
        const conversation = await this.prismaService.conversation.create({
            data: {
                title,
                creatorId,
                avatarUrl,
                type: ConversationType.GROUP,
                participants: {
                    create: [
                        {
                            userId: creatorId,
                            role: ParticipantRole.ADMIN,
                        },
                    ],
                },
            },
        });

        return conversation;
    }

    @EmmitEvent(MESSAGING.NEW_CONVERSATION)
    async createPrivateConversation(
        idCreator: number,
        idUser: number,
    ): Promise<Conversation> {
        const conversation = await this.prismaService.conversation.create({
            data: {
                title: 'Private conversation',
                creatorId: idCreator,
                type: ConversationType.PRIVATE,

                participants: {
                    create: [
                        {
                            userId: idUser,
                            role: ParticipantRole.ADMIN,
                        },
                        {
                            userId: idCreator,
                            role: ParticipantRole.ADMIN,
                        },
                    ],
                },
            },
        });

        return conversation;
    }

    findParticipant(
        userId: number,
        conversationId: number,
    ): Promise<Participant> {
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
    ): Promise<Participant> {
        return this.prismaService.participant.create({
            data: {
                userId,
                conversationId,
                role,
                // dialog: {
                //     connect: { id: [userId, conversationId] },
                // },
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

    @EmmitEvent(MESSAGING.DELETE_CONVERSATION)
    async deleteConversation(idConversation: number, idUser: number) {
        const conversation = await this.prismaService.conversation.findFirst({
            where: {
                AND: [{ id: idConversation }, { creatorId: idUser }],
            },
        });
        if (!conversation) {
            throw new ForbiddenException(
                "You don't have permision to delete this conversation",
            );
        }

        return this.prismaService.conversation.delete({
            where: { id: idConversation },
        });
    }

    getUserConversations(userId: number) {
        return this.prismaService.participant.findMany({
            where: {
                userId,
            },
            select: {
                conversationId: true,
            },
        });
    }

    getConversation(conversationId: number): Promise<Conversation> {
        return this.prismaService.conversation.findFirst({
            where: { id: conversationId },
        });
    }
}
