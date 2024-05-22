import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateMessageDto } from './dto';
import { AttachmentType, Message, MessageType } from '@prisma/client';
import { SYSTEM_USER_ID } from 'src/constants';
import { MessageResponse } from './responses';
import { FileUrlUtils } from '@common/utils';
import { AttachmentsService } from '@attachments/attachments.service';

@Injectable()
export class MessagesService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly attachmentService: AttachmentsService,
    ) {}
    create(senderId: number, dto: CreateMessageDto): Promise<Message> {
        const { conversationId, message, attachmentList } = dto;
        return this.prismaService.message.create({
            data: {
                sender: {
                    connect: {
                        id: senderId,
                    },
                },
                conversation: {
                    connect: {
                        id: conversationId,
                    },
                },
                message,
                attachmentList: attachmentList ?? undefined,
            },
        });
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
