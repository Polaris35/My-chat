import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateConversationDto {
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
    @IsNumber()
    @IsNotEmpty()
    creatorId: number;

    @ApiProperty({
        name: 'avatar id',
        example: 1,
    })
    @IsNumber()
    avatarId: number;
}
