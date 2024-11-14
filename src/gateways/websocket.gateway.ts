import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MediasoupService } from 'src/services/mediasoup.service';
import { ConnectWebRtcTransportDto, ConsumeDto, GetRtpParametersDto, ResumeDto, StartProduceDto } from 'src/dto/websocket.dto';
import { ApiOperation } from '@nestjs/swagger';

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
    client: Socket,
    data: GetRtpParametersDto,
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
    data: StartProduceDto
  ) {
    const clientId = this.clientIds.get(client.id);
    const producer = await this.mediasoupService.createProducer({clientId, kind: data.kind, rtpParameters: data.rtpParameters})
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
    data: ConnectWebRtcTransportDto,
  ) {
    try{
      const clientId = this.clientIds.get(client.id);
      await this.mediasoupService.connectWebRtcTransport({clientId, dtlsParameters: data.dtlsParameters});
      client.emit('webRtcTransportConnected')
    } catch (error){
      this.logger.error(`WebRtc Transport Connect Fail: ${error}`)
    }
  }

  @SubscribeMessage('consume')
  async consume(
    client: Socket,
    data: ConsumeDto,
  ) {
    const clientId = this.clientIds.get(client.id);
    try {
      const consumer = await this.mediasoupService.createConsumer({clientId, producerId: data.producerId, rtpCapabilities: data.rtpCapabilities})
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
    client: Socket,
    data: ResumeDto,
  ) {
    const consumer = this.mediasoupService.getConsumer({clientId: client.id, consumerId: data.consumerId})
    await consumer.resume();
    client.emit('consumerResumed', { consumerId: consumer.id });
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
