import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VideoSourceController } from './controllers/video_source.controller';
import { EventController } from './controllers/event.controller';
import { WebsocketGateway } from './gateways/websocket.gateway';
import { VideoSourceService } from './services/video_source.service';
import { PrismaService } from './services/prisma.service';
import { EventService } from './services/event.service';
import { MediasoupService } from './services/mediasoup.service';


@Module({
  // imports: [WebsocketModule, PrismaModule],
  controllers: [AppController, VideoSourceController, EventController],
  providers: [AppService, WebsocketGateway, VideoSourceService, PrismaService, EventService, MediasoupService],
})
export class AppModule {}
