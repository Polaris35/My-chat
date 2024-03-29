import { createReadStream } from 'fs';
import { join } from 'path';
import {
    BadRequestException,
    Controller,
    Get,
    Post,
    Query,
    Res,
    StreamableFile,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 } from 'uuid';
import { AttachmentsService } from './attachments.service';
import { AttachmentType } from '@prisma/client';
import { Public } from '@common/decorators';
import type { Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Attachments')
@ApiBearerAuth()
@Controller('attachments')
export class AttachmentsController {
    constructor(private readonly attachmentsService: AttachmentsService) {}

    @Public()
    @Post('upload/image')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: 'uploads/images',
                filename: (req, file, cb) => {
                    cb(
                        null,
                        v4() +
                            '-' +
                            file.originalname
                                .replace('-', '')
                                .replace(' ', '_'),
                    );
                },
            }),
            //   fileFilter: imageFileFilter,
        }),
    )
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        return this.attachmentsService.create(file.path, AttachmentType.IMAGE);
    }

    @Public()
    @Get()
    async getFileAttachment(
        @Query('id') id: number,
        @Res({ passthrough: true }) res: Response,
    ) {
        if (!id) {
            throw new BadRequestException('id is required');
        }
        const fileRecord = await this.attachmentsService.find(+id);

        res.set({
            'Content-Type': `${fileRecord.type.toString().toLocaleLowerCase()}`,
        });

        if (fileRecord.type === AttachmentType.FILE) {
            res.set({
                'Content-Type': 'application/json',
            });
        }

        const file = createReadStream(join(process.cwd(), fileRecord.url));
        return new StreamableFile(file);
    }
}
