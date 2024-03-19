import { Public } from '@common/decorators';
import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 } from 'uuid';

@Controller('attachments')
export class AttachmentsController {
    @Public()
    @Post('upload/image')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: 'uploads/images',
                filename: (req, file, cb) => {
                    cb(null, v4() + '-' + file.originalname);
                },
            }),
            //   fileFilter: imageFileFilter,
        }),
    )
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        console.log(file);
        return {
            statusCode: 200,
            data: file.path,
        };
    }
}
