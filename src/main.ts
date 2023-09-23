import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';
import { access, mkdir } from 'fs/promises';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  try {
    await access('assets');
  } catch (error) {
    await mkdir('assets');
  }

  app.useStaticAssets('assets', { prefix: '' });

  app.enableCors({
    origin: ['http://assets-fe.araden.top'],
  });

  await app.listen(3000);
}
bootstrap();
