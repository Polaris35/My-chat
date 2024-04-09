import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGroupConversationDto {
    @ApiProperty({
        description: 'Conversation title',
        example: 'group conversation title',
    })
    @IsString()
    @IsNotEmpty()
    title: string;
    @ApiProperty({
        description: 'avatar url',
        example: 'http://example.com/1',
    })
    @IsString()
    avatarUrl: string;
}
