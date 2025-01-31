import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FILES, FILE_SIZE } from '../common/utils/constant';
import { UPLOAD_PATH } from '../common/utils/path';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination(req, file, callback) {
          callback(null, UPLOAD_PATH);
        },
        filename(req, file, callback) {
          const uniqueSuffix = `${Date.now()}`;
          const extension = file.originalname.split('.').pop();
          callback(null, `${uniqueSuffix}.${extension}`);
        },
      }),
      fileFilter(req, file, callback) {
        const allowedTypes = [
          'image/jpeg',
          'image/png',
          'image/bmp',
          'image/gif',
          'image/jpg',
          'image/svg+xml',
          'application/octet-stream',
        ];
        console.log(file);
        if (!allowedTypes.includes(file.mimetype)) {
          throw new Error('Invalid file type');
        }
        callback(null, true);
      },
      // limits: { fileSize: FILE_SIZE, files: FILES },
    }),
  ],
  exports: [MulterModule],
})
export class DiskStorageModule {}
