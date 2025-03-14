import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import * as redisIoAdapter from 'socket.io-redis';
import { createClient } from 'redis';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  // const redisClient = createClient({ host: configService.get('REDIS_HOST'), port: +configService.get('REDIS_PORT') });

  app.useWebSocketAdapter(new IoAdapter(app));
  // app.useWebSocketAdapter(redisIoAdapter({ pubClient: redisClient, subClient: redisClient.duplicate() }));

  await app.listen(configService.get('PORT') || 3000);
}
bootstrap();
