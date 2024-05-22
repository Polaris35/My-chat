import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
    @ApiProperty({
        description: 'id of conversation',
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    conversationId: number;

    @ApiProperty()
    @IsString()
    @MaxLength(244)
    message?: string;

    @ApiProperty({
        description: 'list of id attached files',
        example: [1, 2, 3],
        isArray: true,
        type: Number,
    })
    attachmentList?: number[];
}
