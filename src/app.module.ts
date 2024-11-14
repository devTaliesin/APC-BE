import { Module } from '@nestjs/common';
import { EventModule } from './modules/event.module';
import { VideoSourceModule } from './modules/video_source.module';
import { WebsocketMediasoupModule } from './modules/websocket_mediasoup.module';
import { PrismaModule } from './modules/prisma.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';


@Module({
  imports: [
    EventModule, 
    VideoSourceModule,
    WebsocketMediasoupModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [ AppService ]
})
export class AppModule {}
