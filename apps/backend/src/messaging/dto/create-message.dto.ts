import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
    @ApiProperty({
        name: 'sender id',
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    senderId: number;

    @ApiProperty({
        name: 'id of conversation',
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    conversationId: number;

    @IsString()
    @MaxLength(244)
    @IsNotEmpty()
    message: string;

    @ApiProperty({
        name: 'list of id attached files',
        example: [1, 58, 21, 4],
    })
    attachmentList: number[];
}
