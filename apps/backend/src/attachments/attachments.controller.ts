import { createReadStream } from 'fs';
import { join } from 'path';
import {
    BadRequestException,
    Controller,
    Get,
    ParseArrayPipe,
    ParseIntPipe,
    Post,
    Query,
    Res,
    StreamableFile,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { AttachmentsService } from './attachments.service';
import { AttachmentType } from '@prisma/client';
import { Public } from '@common/decorators';
import type { Response } from 'express';
import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileLoader, ImageLoader } from '@common/utils';
import { AttachmentDataResponse } from './responses';

@ApiTags('Attachments')
@ApiBearerAuth()
@Controller('attachments')
export class AttachmentsController {
    constructor(private readonly attachmentsService: AttachmentsService) {}

    @Public()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @ApiResponse({
        type: Number,
    })
    @Post('upload/file')
    @UseInterceptors(FileInterceptor('file', FileLoader))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        console.log('file uploader: ', file.filename);
        const attachment = await this.attachmentsService.create(
            file.path,
            AttachmentType.FILE,
        );
        return attachment.id;
    }

    @Public()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                image: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @ApiResponse({
        type: Number,
    })
    @Post('upload/image')
    @UseInterceptors(FileInterceptor('image', ImageLoader))
    async uploadImage(@UploadedFile() file: Express.Multer.File) {
        const attachment = await this.attachmentsService.create(
            file.path,
            AttachmentType.IMAGE,
        );
        return attachment.id;
    }

    @Public()
    @Get()
    @ApiQuery({
        name: 'id',
        required: true,
        type: Number,
    })
    async getFileAttachment(
        @Query('id', ParseIntPipe) id: number,
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
                'Content-Type': 'application/octet-stream',
                'Content-Disposition': `attachment; filename=${this.attachmentsService
                    .getFileName(fileRecord.url)
                    .replace(/[\u0400-\u04FF]/g, '')}`,
            });
        }

        const file = createReadStream(join(process.cwd(), fileRecord.url));
        return new StreamableFile(file);
    }
    @Public()
    @Get('data')
    @ApiQuery({
        name: 'ids',
        isArray: true,
        required: true,
        type: Number,
    })
    @ApiResponse({
        isArray: true,
        type: AttachmentDataResponse,
        status: 200,
    })
    async getAttachmentsData(
        @Query('ids', new ParseArrayPipe({ items: Number, separator: ',' }))
        ids: number[],
    ): Promise<AttachmentDataResponse[]> {
        return this.attachmentsService.getAttachmentData(ids);
    }
}
