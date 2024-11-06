import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { WebsocketModule } from './websocket/websocket.module';
import { WebsocketGateway } from './websocket/websocket.gateway';
import { OnvifDeviceService } from './onvif-device/onvif-device.service';
import { OnvifDeviceController } from './onvif-device/onvif-device.controller';
import { PrismaService } from './prisma/prisma.service';
// import { PrismaModule } from './prisma/prisma.module';

@Module({
  // imports: [WebsocketModule, PrismaModule],
  controllers: [AppController, OnvifDeviceController],
  providers: [AppService, WebsocketGateway, OnvifDeviceService, PrismaService],
})
export class AppModule {}
