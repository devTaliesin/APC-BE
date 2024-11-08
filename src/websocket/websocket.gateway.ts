import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { PrismaService } from '../prisma/prisma.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(parseInt(process.env.RUN_PORT), {
  namespace: 'websocket',
  cors: {
    origin : '*'
  }
})

export class WebsocketGateway 
implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
  private readonly logger = new Logger(WebsocketGateway.name);
  @WebSocketServer() server: Server

  constructor(private readonly prismaService: PrismaService) {}

  @SubscribeMessage('clientOffer')
  async handleClientOffer(client: Socket, offer: any) {
    const onvif = client.handshake.query.onvif;
    const quality = client.handshake.query.quality;
    this.logger.log(`client-${onvif}-${quality} : ${JSON.stringify(offer)}`)
    this.server.to(`service-${onvif}-${quality}`).emit('offer', offer);
  }

  @SubscribeMessage('gstreamerAnswer')
  async handleAnswer(client: Socket, answer:any) {
    const onvif = client.handshake.query.onvif;
    const quality = client.handshake.query.quality;
    this.server.to(`client-${onvif}-${quality}`).emit('answer', answer);
  }
  
  async afterInit(server: Server) {
      this.logger.log('서버초기화 완료')
  }

  async handleConnection(client: Socket) {
    const clientType = client.handshake.query.type;
    const onvif = client.handshake.query.onvif;
    const quality = client.handshake.query.quality;
    if (clientType === "service_master") {
      const videoSources = await this.prismaService.videoSource.findMany();
      client.emit('videoSource', videoSources);
    } else {
      client.join(`${clientType}-${onvif}-${quality}`)
    }
    this.logger.log(`client connect ${clientType}-${onvif}-${quality}`)
  }

  async handleDisconnect(client: Socket) {
    const clientType = client.handshake.query.type;
    const onvif = client.handshake.query.onvif;
    const quality = client.handshake.query.quality;
    this.logger.log(`client disconnect ${clientType}-${onvif}-${quality}`)
  }
}
