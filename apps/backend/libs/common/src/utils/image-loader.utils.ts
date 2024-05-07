import { diskStorage } from 'multer';
import { v4 } from 'uuid';

export const ImageLoader = {
    storage: diskStorage({
        destination: 'uploads/images',
        filename: (req, file, cb) => {
            cb(
                null,
                v4() +
                    '-' +
                    file.originalname.replace('-', '_').replace(' ', '_'),
            );
        },
    }),
};
