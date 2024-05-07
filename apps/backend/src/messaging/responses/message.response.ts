import { ApiProperty } from '@nestjs/swagger';
import { Message, MessageType } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class MessageResponse implements Message {
    @ApiProperty()
    id: number;
    @ApiProperty()
    message: string;
    @ApiProperty()
    type: MessageType;
    @ApiProperty()
    referenceMessageId: number;
    @ApiProperty()
    attachmentList: number[];
    @ApiProperty()
    senderId: number;
    @ApiProperty()
    readCount: number;

    @Exclude()
    createdAt: Date;
    @Exclude()
    isDeleted: boolean;
    @Exclude()
    conversationId: number;
    constructor(message: Partial<MessageResponse>) {
        Object.assign(this, message);
    }
}
