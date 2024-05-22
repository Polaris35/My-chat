import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateMessageDto } from './dto';
import { AttachmentType, MessageType } from '@prisma/client';
import { SYSTEM_USER_ID } from 'src/constants';
import { MessageResponse } from './responses';
import { FileUrlUtils } from '@common/utils';
import { AttachmentsService } from '@attachments/attachments.service';
import { MESSAGING } from './constants';
import { EmmitEvent } from '@events/decorators';
import { EventManager } from '@events/event-manager';

@Injectable()
export class MessagesService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly attachmentService: AttachmentsService,
        // don't remove this dependency, it's used under the hood by event decorator
        private readonly eventManager: EventManager,
    ) {}
    @EmmitEvent(MESSAGING.NEW_MESSAGE)
    async create(
        senderId: number,
        dto: CreateMessageDto,
    ): Promise<MessageResponse> {
        const message = await this.prismaService.message.create({
            data: {
                sender: {
                    connect: {
                        id: senderId,
                    },
                },
                conversation: {
                    connect: {
                        id: dto.conversationId,
                    },
                },
                message: dto.message,
                attachmentList: dto.attachmentList ?? undefined,
            },
            select: {
                id: true,
                message: true,
                type: true,
                attachmentList: true,
                createdAt: true,
                referenceMessageId: true,
                conversationId: true,
                sender: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },

                _count: {
                    select: {
                        readHistory: {
                            where: {
                                participantId: senderId,
                            },
                        },
                    },
                },
            },
        });
        let attachmentsType: AttachmentType | null = null;

        if (message.attachmentList.length !== 0) {
            const attachment = await this.attachmentService.find(
                message.attachmentList[0],
            );
            attachmentsType = attachment.type;
        }

        return {
            id: message.id,
            message: message.message,
            type: message.type,
            referenceMessageId: message.referenceMessageId,
            attachmentList: message.attachmentList,
            isReaded: message._count.readHistory > 0,
            conversationId: message.conversationId,
            createdAt: message.createdAt,
            attachmentType: attachmentsType,

            senderId: message.sender.id,
            senderAvatarUrl: FileUrlUtils.getFileUrl(message.sender.image),
            senderName: message.sender.name,
        };
    }

    async findOne(id: number, userId: number) {
        const message = await this.prismaService.message.findUnique({
            where: { id },
            select: {
                id: true,
                message: true,
                type: true,
                attachmentList: true,
                createdAt: true,
                referenceMessageId: true,
                conversationId: true,
                sender: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },

                _count: {
                    select: {
                        readHistory: {
                            where: {
                                NOT: {
                                    participantId: userId,
                                },
                            },
                        },
                    },
                },
            },
        });

        let attachmentsType: AttachmentType | null = null;

        if (message.attachmentList.length !== 0) {
            const attachment = await this.attachmentService.find(
                message.attachmentList[0],
            );
            attachmentsType = attachment.type;
        }

        return {
            id: message.id,
            message: message.message,
            type: message.type,
            referenceMessageId: message.referenceMessageId,
            attachmentList: message.attachmentList,
            isReaded: message._count.readHistory > 0,
            conversationId: message.conversationId,
            createdAt: message.createdAt,
            attachmentType: attachmentsType,

            senderId: message.sender.id,
            senderAvatarUrl: FileUrlUtils.getFileUrl(message.sender.image),
            senderName: message.sender.name,
        };
    }

    async getRecentMessages(
        conversationId: number,
        skip: number,
        userId: number,
    ): Promise<MessageResponse[]> {
        const list = await this.prismaService.message.findMany({
            take: 15,
            skip: skip * 15,
            orderBy: {
                createdAt: 'desc',
            },
            where: {
                conversationId,
            },
            select: {
                id: true,
                message: true,
                type: true,
                attachmentList: true,
                createdAt: true,
                referenceMessageId: true,
                conversationId: true,
                sender: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },

                _count: {
                    select: {
                        readHistory: {
                            where: {
                                NOT: {
                                    participantId: userId,
                                },
                            },
                        },
                    },
                },
            },
        });

        return Promise.all(
            list.map(async (message) => {
                let attachmentsType: AttachmentType | null = null;

                if (message.attachmentList.length !== 0) {
                    const attachment = await this.attachmentService.find(
                        message.attachmentList[0],
                    );
                    attachmentsType = attachment.type;
                }
                return {
                    id: message.id,
                    message: message.message,
                    type: message.type,
                    referenceMessageId: message.referenceMessageId,
                    attachmentList: message.attachmentList,
                    isReaded: message._count.readHistory > 0,
                    conversationId: message.conversationId,
                    createdAt: message.createdAt,
                    attachmentType: attachmentsType,

                    senderId: message.sender.id,
                    senderAvatarUrl: FileUrlUtils.getFileUrl(
                        message.sender.image,
                    ),
                    senderName: message.sender.name,
                };
            }),
        );
    }

    async getFirstMessage(conversationId: number, userId: number) {
        const message = await this.prismaService.message.findFirst({
            where: {
                conversationId,
            },
            orderBy: {
                createdAt: 'desc',
            },
            select: {
                id: true,
                message: true,
                type: true,
                attachmentList: true,
                createdAt: true,
                referenceMessageId: true,
                conversationId: true,
                sender: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
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
        });

        let attachmentsType: AttachmentType | null = null;

        if (message.attachmentList.length !== 0) {
            const attachment = await this.attachmentService.find(
                message.attachmentList[0],
            );
            attachmentsType = attachment.type;
        }

        return {
            id: message.id,
            message: message.message,
            type: message.type,
            referenceMessageId: message.referenceMessageId,
            attachmentList: message.attachmentList,
            isReaded: message._count.readHistory > 0,
            conversationId: message.conversationId,
            createdAt: message.createdAt,
            attachmentType: attachmentsType,

            senderId: message.sender.id,
            senderAvatarUrl: message.sender.name,
            senderName: message.sender.name,
        };
    }

    @EmmitEvent(MESSAGING.NEW_MESSAGE)
    async createSystemMessage(
        conversationId: number,
        textMessage: string,
    ): Promise<MessageResponse> {
        const message = await this.prismaService.message.create({
            data: {
                senderId: SYSTEM_USER_ID,
                conversationId,
                message: textMessage,
                type: MessageType.SYSTEM_MESSAGE,
                attachmentList: undefined,
            },
            select: {
                id: true,
                message: true,
                type: true,
                attachmentList: true,
                createdAt: true,
                referenceMessageId: true,
                conversationId: true,
                sender: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },

                _count: {
                    select: {
                        readHistory: {
                            where: {
                                participantId: 1,
                            },
                        },
                    },
                },
            },
        });

        return {
            id: message.id,
            message: message.message,
            type: message.type,
            referenceMessageId: message.referenceMessageId,
            attachmentList: message.attachmentList,
            isReaded: false,
            conversationId: message.conversationId,
            createdAt: message.createdAt,
            attachmentType: null,

            senderId: 1,
            senderAvatarUrl: '',
            senderName: 'system',
        };
    }
    @EmmitEvent(MESSAGING.DELETE_MESSAGE)
    delete(id: number) {
        //TODO: не удалять системное сообщение
        return this.prismaService.message.update({
            where: { id },
            data: {
                isDeleted: true,
            },
        });
    }
}
