import { ApiProperty } from '@nestjs/swagger';
import { AttachmentType, MessageType } from '@prisma/client';

export class MessageResponse {
    @ApiProperty()
    id: number;
    @ApiProperty()
    message: string;
    @ApiProperty({
        enum: MessageType,
        example: Object.keys(MessageType),
    })
    type: MessageType;
    @ApiProperty()
    referenceMessageId: number;
    @ApiProperty()
    isReaded: boolean;
    @ApiProperty()
    conversationId: number;
    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    senderId: number;
    @ApiProperty()
    senderAvatarUrl: string;
    @ApiProperty()
    senderName: string;

    @ApiProperty({
        type: Number,
        isArray: true,
    })
    attachmentList: number[];
    @ApiProperty({
        enum: AttachmentType,
        example: Object.keys(AttachmentType),
    })
    attachmentType: AttachmentType | null;

    constructor(message: Partial<MessageResponse>) {
        Object.assign(this, message);
    }
}
