import {
  Get,
  Post,
  Headers,
  Body,
  Controller,
  UploadedFile,
  UseInterceptors,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { readdir, writeFile } from 'fs/promises';
import { config as configEnv } from 'dotenv';
import { MD5 } from 'crypto-js';

const { parsed } = configEnv({ path: '.env.local' });

@Controller()
export class AppController {
  @Get('prefix/:str')
  async getAssetsStartsWith(@Param('str') str: string) {
    return (await readdir('assets')).filter((file) => file.startsWith(str));
  }

  @Get('suffix/:str')
  async getAssetsEndsWith(@Param('str') str: string) {
    return (await readdir('assets')).filter((file) => file.endsWith(str));
  }

  @Post('')
  @UseInterceptors(FileInterceptor('asset'))
  async upload(
    @Headers('upload-assets-key') uploadAssetsKey: string,
    @Body() body: Record<string, string>,
    @UploadedFile() asset: Express.Multer.File,
  ) {
    if (!asset) {
      throw new HttpException('资源不能为空', HttpStatus.BAD_REQUEST);
    }
    if (
      uploadAssetsKey !==
      MD5(parsed.key + new Date().toLocaleDateString('zh-CN')).toString()
    ) {
      throw new HttpException('密钥错误', HttpStatus.FORBIDDEN);
    }

    const filename = body.name.split('.');
    if (!body.hold) filename.push(String(+new Date()), filename.pop());
    const finalName = `${body.shared ? 'shared-' : ''}${filename.join('.')}`;
    await writeFile(`assets/${finalName}`, asset.buffer);
    return finalName;
  }
}
