import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import {
    AttachmentType,
    Conversation,
    ConversationType,
    Participant,
    ParticipantRole,
} from '@prisma/client';
import { EmmitEvent } from '@events/decorators';
import { MESSAGING } from '@messaging/constants';
import { EventManager } from '@events/event-manager';
import {
    ConversationPreviewListResponse,
    ConversationPreviewResponse,
    ConversationResponse,
    MessageResponse,
} from './responses';
import { AttachmentsService } from '@attachments/attachments.service';
import { ATTACHMENT } from 'src/constants/attachment';
import { ParticipantResponse } from './responses/conversation.response';
import { FileUrlUtils } from '@common/utils';
import { UsersService } from '@users/users.service';

@Injectable()
export class ConversationsService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly attachmentsService: AttachmentsService,
        private readonly usersService: UsersService,
        // don't remove this dependency, it's used under the hood by event decorator
        private readonly eventManager: EventManager,
    ) {}
    @EmmitEvent(MESSAGING.NEW_CONVERSATION)
    async createGroup(
        title: string,
        file: Express.Multer.File,
        creatorId: number,
    ): Promise<Conversation> {
        let avatarIdList = [ATTACHMENT.DEFAULT_CONVERSATION_AVATAR];
        if (file) {
            const avatarId = await this.attachmentsService.create(
                file.path,
                AttachmentType.IMAGE,
            );
            avatarIdList = [avatarId.id];
        }
        const conversation = await this.prismaService.conversation.create({
            data: {
                title,
                creatorId,
                avatarIds: avatarIdList,
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

    async getGroupConversationPreview(
        conversationId: number,
        userId: number,
    ): Promise<ConversationPreviewResponse> {
        const conversation = await this.prismaService.conversation.findFirst({
            where: {
                id: conversationId,
            },
            select: {
                id: true,
                title: true,
                avatarIds: true,
                type: true,
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

        return {
            id: conversation.id,
            title: conversation.title,
            avatarUrl: FileUrlUtils.getFileUrl(conversation.avatarIds[0]),
            type: conversation.type,
            senderName: conversation.messages[0].sender.name,
            message: conversation.messages[0].message,
            time: conversation.messages[0].createdAt,
            messageCount:
                conversation._count.messages -
                conversation.messages[0]._count.readHistory,
            messageType: conversation.messages[0].type,
        };
    }

    async getPrivateConversationPreview(
        idConversation: number,
        idUser: number,
    ) {
        const conversation = await this.prismaService.conversation.findFirst({
            where: {
                id: idConversation,
                participants: {
                    some: {
                        userId: idUser,
                    },
                },
            },
            select: {
                id: true,
                title: true,
                avatarIds: true,
                type: true,
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
                        id: true,
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
                                        participantId: idUser,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        const companion = await this.usersService.findById(idUser);

        return {
            id: conversation.id,
            title: companion.name,
            avatarUrl: FileUrlUtils.getFileUrl(companion.image),
            type: conversation.type,
            senderName: conversation.messages[0].sender.name,
            message: conversation.messages[0].message,
            time: conversation.messages[0].createdAt,
            messageCount:
                conversation._count.messages -
                conversation.messages[0]._count.readHistory,
            messageType: conversation.messages[0].type,
        };
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
                AND: {
                    id: idConversation,
                    OR: [
                        {
                            type: ConversationType.GROUP,
                            creatorId: idUser,
                        },
                        {
                            AND: {
                                type: ConversationType.PRIVATE,
                                participants: {
                                    some: {
                                        userId: idUser,
                                    },
                                },
                            },
                        },
                    ],
                },
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
    ): Promise<ConversationPreviewListResponse> {
        const privateConversationsList =
            await this.getPrivateConversations(userId);

        const groupConversationsList = await this.getGroupConversations(userId);

        return new ConversationPreviewListResponse([
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
                avatarIds: true,
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
        return rawData.map((item): ConversationPreviewResponse => {
            return {
                id: item.id,
                title: item.title,
                avatarUrl: FileUrlUtils.getFileUrl(item.avatarIds[0]),
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
        return rawData.map((item): ConversationPreviewResponse => {
            return {
                id: item.dialog.id,
                title: item.dialog.participants[0].member.name,
                avatarUrl: FileUrlUtils.getFileUrl(
                    item.dialog.participants[0].member.image,
                ),
                type: ConversationType.PRIVATE.toString(),

                senderName: item.dialog.messages[0].sender.name,
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

    async getConversation(
        conversationId: number,
    ): Promise<ConversationResponse> {
        const rawData = await this.prismaService.conversation.findFirst({
            where: {
                id: conversationId,
                messages: {
                    some: {
                        isDeleted: false,
                    },
                },
            },
            select: {
                id: true,
                createdAt: true,
                title: true,
                creatorId: true,
                avatarIds: true,
                type: true,
                participants: {
                    take: 15,
                    select: {
                        member: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                            },
                        },
                        role: true,
                    },
                },
                messages: {
                    // distinct: ['conversationId'], // Ensures only unique conversations are returned
                    orderBy: { createdAt: 'desc' },
                    take: 15,
                    select: {
                        id: true,
                        message: true,
                        type: true,
                        attachmentList: true,
                        createdAt: true,
                        referenceMessageId: true,
                        sender: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                            },
                        },
                        _count: {
                            select: {
                                readHistory: true,
                            },
                        },
                    },
                },
            },
        });
        return {
            id: rawData.id,
            createdAt: rawData.createdAt,
            title: rawData.title,
            creatorId: rawData.creatorId,
            avatarIds: rawData.avatarIds,
            type: rawData.type,
            participants: rawData.participants.map(
                (participant): ParticipantResponse => {
                    return {
                        id: participant.member.id,
                        name: participant.member.name,
                        image: FileUrlUtils.getFileUrl(
                            participant.member.image,
                        ),
                        role: participant.role,
                    };
                },
            ),
            messages: rawData.messages.map((message): MessageResponse => {
                return new MessageResponse({
                    id: message.id,
                    message: message.message,
                    type: message.type,
                    referenceMessageId: message.referenceMessageId,
                    attachmentList: message.attachmentList,
                    senderId: message.sender.id,
                    readCount: message._count.readHistory,
                    createdAt: message.createdAt,
                });
            }),
        };
    }
}
