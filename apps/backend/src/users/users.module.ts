import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '@prisma/prisma.module';
import { AttachmentsModule } from 'src/attachments/attachments.module';

@Module({
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
    imports: [PrismaModule, AttachmentsModule],
})
export class UsersModule {}
