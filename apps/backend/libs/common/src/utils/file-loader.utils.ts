import { diskStorage } from 'multer';
import { v4 } from 'uuid';

export const FileLoader = {
    storage: diskStorage({
        destination: 'uploads/files',
        filename: (req, file, cb) => {
            file.originalname = Buffer.from(
                file.originalname,
                'latin1',
            ).toString('utf8');
            cb(null, file.originalname);
            cb(
                null,
                v4() +
                    '-' +
                    file.originalname.replace('-', '_').replace(' ', '_'),
            );
        },
    }),
};
