import {
    Controller,
    Get,
    Param,
    Delete,
    ClassSerializerInterceptor,
    UseInterceptors,
    Put,
    UploadedFile,
    BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserResponse } from './responses/user.response';
import { CurrentUser } from '@common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 } from 'uuid';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
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

    @Put('change-image')
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: 'uploads/images',
                filename: (req, file, cb) => {
                    cb(null, v4() + '-' + file.originalname);
                },
            }),
            //   fileFilter: imageFileFilter,
        }),
    )
    changeImage(
        @CurrentUser('id') userId: number,
        @UploadedFile('image') image: Express.Multer.File,
    ) {
        if (!userId || !image) {
            throw new BadRequestException();
        }
        return this.usersService.changeImage(userId, image.path);
    }
}
