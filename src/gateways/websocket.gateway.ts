import { Logger } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { PrismaService } from '../prisma/prisma.service';
import { Server, Socket } from 'socket.io';
import { MediasoupService } from 'src/mediasoup/mediasoup.service';
import {types} from 'mediasoup';
import { DtlsParameters } from 'mediasoup/node/lib/fbs/web-rtc-transport';
@WebSocketGateway(parseInt(process.env.RUN_PORT), {
  namespace: 'websocket',
  cors: {
    origin : '*'
  }
})

export class WebsocketGateway 
implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
  private readonly logger = new Logger(WebsocketGateway.name);
  private clientIds: Map<string, string> = new Map()

  @WebSocketServer() server: Server

  constructor(
    private readonly prismaService: PrismaService,
    private mediasoupService: MediasoupService
  ) {}

  // GStreamer에서 스트림을 받아오기 위한 signaling
  @SubscribeMessage('createPlainTransport')
  async createPlainTransport(client: Socket) {
    const clientId = this.clientIds.get(client.id);
    const transport = await this.mediasoupService.createPlainTransport(clientId)

    client.emit('plainTransportCreated',{
      ip: transport.tuple.localIp,
      port: transport.tuple.localPort,
      rtcpPort: transport.rtcpTuple.localPort || undefined 
    })
  }

  @SubscribeMessage('getRtpParameters')
  async getRtpParameters(
    @MessageBody() data: { kind: types.MediaKind },
    @ConnectedSocket() client: Socket,
  ) {
    const rtpParameters = this.mediasoupService.createRtpParameters(data.kind);
    client.emit('plainTransportCreated', {
      kind: data.kind,
      rtpParameters
    })
  }

  @SubscribeMessage('startProduce')
  async startProduce(
    client: Socket,
    data: {kind: types.MediaKind, rtpParameters: types.RtpParameters}
  ) {
    const clientId = this.clientIds.get(client.id);
    const producer = await this.mediasoupService.createProducer(clientId, data.kind, data.rtpParameters)
    client.emit('producerCreated', {id: producer.id, kind: data.kind})
  }

  // React에 stream을 보내기 위한 signaling
  @SubscribeMessage('getRouterRtpCapabilities')
  async getRouterRtpCapabilities(client: Socket) {
    client.emit('routerRtpCapabilities', this.mediasoupService.router.rtpCapabilities)
  }
  
  @SubscribeMessage('getProducers')
  async getProducers(client: Socket) {
    const producersList = this.mediasoupService.getAllProducerIds();
    client.emit('producersList', producersList)
  }

  @SubscribeMessage('createWebRtcTransport')
  async createWebRtcTransport(client: Socket) {
    const clientId = this.clientIds.get(client.id);
    const transport = await this.mediasoupService.createWebRtcTransport(clientId);

    client.emit('webRtcTransportCreated',{
      id: transport.id,
      iceParameters: transport.iceParameters,
      iceCandidates: transport.iceCandidates,
      dtlsParameters: transport.dtlsParameters,
    })
  }

  @SubscribeMessage('connectWebRtcTransport')
  async connectWebRtcTransport(
    client: Socket,
    data: {dtlsParameters: types.DtlsParameters},
  ) {
    try{
      const clientId = this.clientIds.get(client.id);
      await this.mediasoupService.connectWebRtcTransport(clientId, data.dtlsParameters);
      client.emit('webRtcTransportConnected')
    } catch (error){
      this.logger.error(`WebRtc Transport Connect Fail: ${error}`)
    }
  }

  @SubscribeMessage('consume')
  async consume(
    client: Socket,
    data: { producerId: string; rtpCapabilities: types.RtpCapabilities },
  ) {
    const clientId = this.clientIds.get(client.id);
    try {
      const consumer = await this.mediasoupService.createConsumer(clientId, data.producerId, data.rtpCapabilities)
      client.emit('consumed', {
        producerid: data.producerId,
        id: consumer.id,
        kind: consumer.kind,
        rtpPaarameters: consumer.rtpParameters,
        type: consumer.type,
        producerPause: consumer.producerPaused,
      })
    } catch (error){
      this.logger.error(`Create Consume Fail: ${error}`)
    }
  }

  @SubscribeMessage('resume')
  async resume(
    @MessageBody() data: { producerId: string; rtpCapabilities: types.RtpCapabilities },
    @ConnectedSocket() client: Socket,
  ) {
    client.emit('consumerResumed')
  }

  //기본 event
  async afterInit(server: Server) {
      this.logger.log('서버초기화 완료')
  }

  async handleConnection(client: Socket) {
    
  }

  async handleDisconnect(client: Socket) {

  }
}
