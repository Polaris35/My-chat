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
        name: 'user id',
        example: 1,
    })
    @ApiProperty({
        name: 'avatar id',
        example: 1,
    })
    @IsNumber()
    avatarId: number;

    @IsNotEmpty()
    @IsString()
    type: 'private' | 'group';
}
