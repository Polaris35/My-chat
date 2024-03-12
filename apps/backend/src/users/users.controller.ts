import {
    Controller,
    Get,
    Param,
    Delete,
    ClassSerializerInterceptor,
    UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserResponse } from './responses/user.response';
import { CurrentUser } from '@common/decorators';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @UseInterceptors(ClassSerializerInterceptor)
    @Get('find/by-id/:id')
    async findById(@Param('id') id: number) {
        const user = await this.usersService.findById(id);
        return new UserResponse(user);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get('find/by-email/:email')
    async findByEmail(@Param('email') email: string) {
        const user = await this.usersService.findByEmail(email);
        return new UserResponse(user);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get('me')
    async me(@CurrentUser('id') id: number) {
        const user = await this.usersService.findById(id);
        return new UserResponse(user);
    }

    @Delete(':id')
    remove(@Param('id') id: number, @CurrentUser('id') userId: number) {
        return this.usersService.remove(id, userId);
    }
}
