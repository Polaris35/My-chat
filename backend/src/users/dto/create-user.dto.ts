import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'test@gmail.com',
  })
  email: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  image: string;
  @ApiProperty()
  password: string;
  provider: string;
}
