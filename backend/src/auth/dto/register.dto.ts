import { IsPasswordsMatchingConstraint } from '@common/decorators';
import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MinLength,
    Validate,
} from 'class-validator';

export class RegisterDto {
    @IsEmail()
    @ApiProperty({ example: 'ikozluk160@gmail.com' })
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(4)
    @ApiProperty({ example: '12345' })
    @IsNotEmpty()
    password: string;

    @IsString()
    @MinLength(4)
    @ApiProperty({ example: '12345' })
    @Validate(IsPasswordsMatchingConstraint)
    @IsNotEmpty()
    passwordRepeat: string;
}
