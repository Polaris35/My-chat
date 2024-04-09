import { ApiProperty } from '@nestjs/swagger';
import { MessageType } from '@prisma/client';

export class ConversationResponse {
    @ApiProperty()
    id: number;
    @ApiProperty()
    title: string;
    @ApiProperty()
    avatarUrl: string;
    @ApiProperty()
    type: string;

    @ApiProperty()
    senderName: string;
    @ApiProperty()
    message?: string;
    @ApiProperty()
    time: Date;
    @ApiProperty()
    messageCount: number;
    @ApiProperty({
        enum: MessageType,
        example: Object.keys(MessageType),
    })
    messageType: MessageType;
}

export class ConversationListResponse {
    @ApiProperty({
        type: ConversationResponse,
        isArray: true,
    })
    conversations: ConversationResponse[];
    constructor(conversations: ConversationResponse[]) {
        this.conversations = conversations;
    }
}
