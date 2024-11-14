import { Injectable, OnModuleInit } from '@nestjs/common';
import {types, createWorker} from 'mediasoup';
import { ConnectWebRtcTransportData, CreateConsumerData, CreateProducerData, GetConsumerData, ProducerId } from 'src/intserfaces/mediasoup.interface';

@Injectable()
export class MediasoupService implements OnModuleInit
{
  private worker: types.Worker;
  public router: types.Router;

  public transports: Map<string, {
    plainRtpTransport?: types.PlainTransport,
    webRtcTransport?: types.WebRtcTransport,
  }> = new Map();

  private producers: Map<string, types.Producer[]> = new Map()
  private consumers: Map<string, types.Consumer[]> = new Map()

  async onModuleInit() {
      this.worker = await createWorker({
        rtcMinPort: 40000,
        rtcMaxPort: 40100,
      });

      this.router = await this.worker.createRouter({
        mediaCodecs: [{
          kind: 'video',
          mimeType: 'video/VP8',
          clockRate: 90000,
          parameters: {},
        }, {
          kind:'video',
          mimeType: 'video/H264',
          clockRate:90000,
          parameters: {
            'packetization-mode': 1,
            'profile-level-id': '42e01f',
          },
          rtcpFeedback: [],
        }],
      });
  }

  // GStreamer에서 스트림을 받아오기 위한 mediasoup Setting
  async createPlainTransport(clientId: string): Promise<types.PlainTransport<types.AppData>> {
    const transport = await this.router.createPlainTransport({
      listenIp: { ip: '0.0.0.0', announcedIp: '119.198.112.80' }, // 실제 퍼블릭 IP로 변경
      rtcpMux: false,
      comedia: true,
    });

    // 클라이언트별로 Transport 저장
    this.transports.set(clientId, { plainRtpTransport: transport });

    return transport;
  }

  createRtpParameters(kind: types.MediaKind): types.RtpParameters {
    const ssrc = Math.floor(Math.random() * 0xffffffff);

    const rtpParameters: types.RtpParameters = {
      codecs: [
        {
          mimeType: kind === 'video' ? 'video/H264' : 'audio/opus',
          payloadType: kind === 'video' ? 102 : 111,
          clockRate: kind === 'video' ? 90000 : 48000,
          parameters: kind === 'video' ? {
            'packetization-mode': 1,
            'profile-level-id': '42e01f',
          } : {},
          rtcpFeedback: [],
        },
      ],
      encodings: [
        {
          ssrc: ssrc,
        },
      ],
    };

    return rtpParameters;
  }

  async createProducer(data : CreateProducerData): Promise<types.Producer<types.AppData>> {
    const transport = this.transports.get(data.clientId)?.plainRtpTransport;

    if (!transport) {
      throw new Error(`Transport를 찾을 수 없습니다: ${data.clientId}`);
    }

    const producer = await transport.produce({
      kind: data.kind,
      rtpParameters: data.rtpParameters,
    });

    // 클라이언트별 Producer 저장
    let clientProducers = this.producers.get(data.clientId) || [];
    clientProducers.push(producer);
    this.producers.set(data.clientId, clientProducers);

    return producer;
  }

  // React에 stream을 보내기 위한 mediasoup Setting
  async createWebRtcTransport(clientId: string) {
    const transport = await this.router.createWebRtcTransport({
      listenIps: [{ ip: '0.0.0.0', announcedIp: '119.198.112.80' }], // 실제 퍼블릭 IP로 변경
      enableUdp: true,
      enableTcp: true,
      preferUdp: true,
    });

    // 클라이언트별로 WebRTC Transport 저장
    const clientTransports = this.transports.get(clientId) || {};
    clientTransports.webRtcTransport = transport;
    this.transports.set(clientId, clientTransports);

    return transport;
  }

  async connectWebRtcTransport(data: ConnectWebRtcTransportData) {
    const transport = this.transports.get(data.clientId)?.webRtcTransport;

    if (!transport) {
      throw new Error(`WebRtcTransport를 찾을 수 없습니다: ${data.clientId}`);
    }

    await transport.connect({ dtlsParameters: data.dtlsParameters });
  }

  async createConsumer(data: CreateConsumerData): Promise<types.Consumer<types.AppData>> {
    const transport = this.transports.get(data.clientId)?.webRtcTransport;
    const producer = this.findProducerById(data.producerId);

    if (!transport || !producer) {
      throw new Error(`Transport 또는 Producer를 찾을 수 없습니다: ${data.clientId}`);
    }

    if (!this.router.canConsume({ producerId: producer.id, rtpCapabilities: data.rtpCapabilities })) {
      throw new Error('해당 Producer를 Consume할 수 없습니다.');
    }

    const consumer = await transport.consume({
      producerId: producer.id,
      rtpCapabilities: data.rtpCapabilities,
      paused: true,
    });

    // 클라이언트별 Consumer 저장
    let clientConsumers = this.consumers.get(data.clientId) || [];
    clientConsumers.push(consumer);
    this.consumers.set(data.clientId, clientConsumers);

    return consumer;
  }

  findProducerById(producerId: string): types.Producer {
    for (const producers of this.producers.values()) {
      const producer = producers.find(p => p.id === producerId);
      if (producer) {
        return producer;
      }
    }
    return null;
  }

  getAllProducerIds(): ProducerId[] {
    const producerIds: ProducerId[] = [];
    for (const producers of this.producers.values()) {
      for (const producer of producers) {
        producerIds.push({ producerId: producer.id, kind: producer.kind });
      }
    }
    return producerIds;
  }

  getConsumer(data: GetConsumerData): types.Consumer<types.AppData>{
    const clientConsumers = this.consumers.get(data.clientId);
    const consumer = clientConsumers.find(c => c.id === data.consumerId);

    if (!consumer) {
      console.error('Consumer not found:', data.consumerId);
      return;
    }
    return consumer
  }

  // 기본 Setting
  closeClientResources(clientId: string) {
    const clientProducers = this.producers.get(clientId);
    if (clientProducers) {
      clientProducers.forEach(producer => producer.close());
      this.producers.delete(clientId);
    }

    const clientConsumers = this.consumers.get(clientId);
    if (clientConsumers) {
      clientConsumers.forEach(consumer => consumer.close());
      this.consumers.delete(clientId);
    }

    const clientTransports = this.transports.get(clientId);
    if (clientTransports) {
      if (clientTransports.plainRtpTransport) {
        clientTransports.plainRtpTransport.close();
      }
      if (clientTransports.webRtcTransport) {
        clientTransports.webRtcTransport.close();
      }
      this.transports.delete(clientId);
    }
  }

}
