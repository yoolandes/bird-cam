/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { LoggerService } from '@bird-cam/logger';
import { HttpService } from '@nestjs/axios';

export * from 'mysql';
export * from 'ansi-styles';

async function bootstrap() {
  const httpService = new HttpService();
  const app = await NestFactory.create(AppModule);

  httpService.axiosRef.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      Logger.error(error);
      throw error;
    }
  );

  app.useLogger(app.get(LoggerService));
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3333;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
