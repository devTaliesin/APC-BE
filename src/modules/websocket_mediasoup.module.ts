import { Module } from '@nestjs/common';
import { WebsocketGateway } from 'src/gateways/websocket.gateway';
import { MediasoupService } from 'src/services/mediasoup.service';

@Module({
  providers: [WebsocketGateway, MediasoupService]
})
export class WebsocketMediasoupModule {}