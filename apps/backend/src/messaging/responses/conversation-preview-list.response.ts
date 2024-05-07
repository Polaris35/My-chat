import { ApiProperty } from '@nestjs/swagger';
import { MessageType } from '@prisma/client';

export class ConversationPreviewResponse {
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

export class ConversationPreviewListResponse {
    @ApiProperty({
        type: ConversationPreviewResponse,
        isArray: true,
    })
    conversations: ConversationPreviewResponse[];
    constructor(conversations: ConversationPreviewResponse[]) {
        this.conversations = conversations;
    }
}
