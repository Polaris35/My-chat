import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateGroupConversationDto } from './dto';
import { PrismaService } from '@prisma/prisma.service';
import {
    Conversation,
    ConversationType,
    Participant,
    ParticipantRole,
} from '@prisma/client';
import { EmmitEvent } from '@events/decorators';
import { MESSAGING } from '@messaging/constants';
import { EventManager } from '@events/event-manager';
import { CONVERSATION_AVATAR_URL } from 'src/constants/conversation';
import { ConversationListResponse, ConversationResponse } from './responses';

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
        const { title, avatarUrl } = dto;
        const avatarUrlList = [avatarUrl ?? CONVERSATION_AVATAR_URL];
        const conversation = await this.prismaService.conversation.create({
            data: {
                title,
                creatorId,
                avatarUrl: avatarUrlList,
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
    ) {
        return this.prismaService.conversation.update({
            where: {
                id: conversationId,
            },
            data: {
                participants: {
                    create: [
                        {
                            userId: userId,
                            role: role,
                        },
                    ],
                },
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

    async getUserConversations(
        userId: number,
    ): Promise<ConversationListResponse> {
        const privateConversationsList =
            await this.getPrivateConversations(userId);

        const groupConversationsList = await this.getGroupConversations(userId);

        return new ConversationListResponse([
            ...privateConversationsList,
            ...groupConversationsList,
        ]);
    }

    private async getGroupConversations(userId: number) {
        const rawData = await this.prismaService.conversation.findMany({
            where: {
                type: ConversationType.GROUP,
                participants: {
                    some: {
                        userId: userId,
                    },
                },
            },
            select: {
                id: true,
                title: true,
                avatarUrl: true,
                _count: {
                    select: {
                        messages: true,
                    },
                },
                messages: {
                    // distinct: ['conversationId'], // Ensures only unique conversations are returned
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                    select: {
                        message: true,
                        type: true,
                        attachmentList: true,
                        createdAt: true,
                        isDeleted: true,
                        sender: {
                            select: {
                                name: true,
                            },
                        },
                        _count: {
                            select: {
                                readHistory: {
                                    where: {
                                        participantId: userId,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        return rawData.map((item): ConversationResponse => {
            return {
                id: item.id,
                title: item.title,
                avatarUrl: item.avatarUrl[0],
                type: ConversationType.GROUP,

                senderName: item.messages[0].sender.name,
                message: item.messages[0].message,
                messageType: item.messages[0].type,
                time: item.messages[0].createdAt,
                //calculate unreaded messages by userId
                messageCount:
                    item._count.messages - item.messages[0]._count.readHistory,
            };
        });
    }
    private async getPrivateConversations(userId: number) {
        const rawData = await this.prismaService.participant.findMany({
            where: {
                userId,
                dialog: {
                    type: ConversationType.PRIVATE,
                    participants: { some: { userId: { not: userId } } },
                },
            },
            select: {
                userId: false,
                conversationId: false,
                dialog: {
                    select: {
                        id: true,
                        type: true,
                        _count: {
                            select: {
                                messages: true,
                            },
                        },
                        participants: {
                            select: {
                                member: {
                                    select: {
                                        name: true,
                                        image: true,
                                    },
                                },
                            },
                        },
                        messages: {
                            // distinct: ['conversationId'], // Ensures only unique conversations are returned
                            orderBy: { createdAt: 'desc' },
                            take: 1,
                            select: {
                                message: true,
                                type: true,
                                attachmentList: true,
                                createdAt: true,
                                isDeleted: true,
                                sender: {
                                    select: {
                                        name: true,
                                    },
                                },
                                _count: {
                                    select: {
                                        readHistory: {
                                            where: {
                                                participantId: {
                                                    not: userId,
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        return rawData.map((item): ConversationResponse => {
            return {
                id: item.dialog.id,
                title: item.dialog.participants[0].member.name,
                avatarUrl: item.dialog.participants[0].member.image,
                type: ConversationType.PRIVATE.toString(),

                senderName: item.dialog.participants[0].member.name,
                message: item.dialog.messages[0].message,
                messageType: item.dialog.messages[0].type,
                time: item.dialog.messages[0].createdAt,
                //calculate unreaded messages by userId
                messageCount:
                    item.dialog._count.messages -
                    item.dialog.messages[0]._count.readHistory,
            };
        });
    }

    getConversation(conversationId: number): Promise<Conversation> {
        return this.prismaService.conversation.findFirst({
            where: { id: conversationId },
        });
    }
}
