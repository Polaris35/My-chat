import { Module } from '@nestjs/common';
import { AttachmentsService } from './attachments.service';
import { PrismaModule } from '@prisma/prisma.module';
import { AttachmentsController } from './attachments.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
    providers: [AttachmentsService],
    imports: [
        PrismaModule,
        MulterModule.register({
            dest: './uploads',
        }),
    ],
    exports: [AttachmentsService],
    controllers: [AttachmentsController],
})
export class AttachmentsModule {}
