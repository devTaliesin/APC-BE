import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { setupSwagger } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.RUN_PORT ?? 3000
  const corsOptions: CorsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
  }
  
  setupSwagger(app);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors(corsOptions)

  await app.listen(port);
  Logger.log(`Application running on port ${port}`)
}

bootstrap();
