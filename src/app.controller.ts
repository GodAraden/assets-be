import {
  Post,
  Headers,
  Controller,
  UploadedFile,
  UseInterceptors,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { writeFile } from 'fs/promises';
import { config as configEnv } from 'dotenv';
import { MD5 } from 'crypto-js';

const { parsed } = configEnv({ path: '.env.local' });

@Controller()
export class AppController {
  @Post('')
  @UseInterceptors(FileInterceptor('asset'))
  async getHello(
    @Headers('upload-assets-key') uploadAssetsKey: string,
    @UploadedFile() asset: Express.Multer.File,
  ) {
    const key = MD5(parsed.key + new Date().toLocaleDateString()).toString();

    if (uploadAssetsKey === key) {
      const filename = asset.originalname.split('.');
      filename.push(String(+new Date()), filename.pop());
      await writeFile(`assets/${filename.join('.')}`, asset.buffer);
      return filename.join('.');
    } else {
      throw new HttpException(
        'Need Correct Upload Asset Key',
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
