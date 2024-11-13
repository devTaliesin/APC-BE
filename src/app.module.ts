import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebsocketGateway } from './websocket/websocket.gateway';
import { VideoSourceCreateService } from './video_source/video_source-create/video_source-create.service';
import { VideoSourceController } from './video_source/video_source.controller';
import { PrismaService } from './prisma/prisma.service';
import { EventController } from './event/event.controller';
import { EventUpdateService } from './event/event-update/event-update.service';
import { EventReadService } from './event/event-read/event-read.service';
import { EventCreateService } from './event/event-create/event-create.service';
// import { WebsocketModule } from './websocket/websocket.module';
// import { PrismaModule } from './prisma/prisma.module';
import { VideoSourceReadService } from './video_source/video_source-read/video_source-read.service';
import { MediasoupService } from './mediasoup/mediasoup.service';
import { VideoSourceSseService } from './video_source/video_source-sse/video_source-sse.service';
import { TestController } from './test/test.controller';
import { VideoSourceService } from './video_source/video_source.service';

@Module({
  // imports: [WebsocketModule, PrismaModule],
  controllers: [AppController, VideoSourceController, EventController, TestController],
  providers: [AppService, WebsocketGateway, VideoSourceCreateService, PrismaService, EventUpdateService, EventReadService, EventCreateService, VideoSourceReadService, MediasoupService, VideoSourceSseService, VideoSourceService],
})
export class AppModule {}
