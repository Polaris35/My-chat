import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateGroupConversationDto {
    @ApiProperty({
        name: 'title',
        description: 'Conversation title',
    })
    @IsString()
    @IsNotEmpty()
    title: string;
    @ApiProperty({
        name: 'avatarId',
        description: 'id of avatar',
        example: 1,
    })
    @IsNumber()
    avatarId: number;

    @ApiProperty({
        name: 'type',
        description: 'type of conversation',
        example: 'private',
    })
    @IsNotEmpty()
    @IsString()
    type: 'private' | 'group';
}
