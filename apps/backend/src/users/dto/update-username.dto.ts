import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUsernameDto {
    @IsString()
    @ApiProperty({ example: 'john Doe' })
    @IsNotEmpty()
    newUsername: string;
}
