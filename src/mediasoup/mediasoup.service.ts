import { Injectable, OnModuleInit } from '@nestjs/common';
import * as mediasoup from 'mediasoup';

@Injectable()
export class MediasoupService implements OnModuleInit
{
  private worker: mediasoup.types.Worker;
  private router: mediasoup.types.Router;

  async onModuleInit() {
      this.worker = await mediasoup.createWorker();
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
          parameters: {},
        }],
      });
  }

  async createWebRtcTransport() {
    const transport = await this.router.createWebRtcTransport({
      listenIps: [{ ip: '0.0.0.0', announcedIp: '119.198.112.80'},], // 외부 아이피
      enableUdp: true,
      enableTcp: true,
    });
    return {
      id: transport.id,
      iceParameters: transport.iceParameters,
      iceCandidates: transport.iceCandidates,
      dtlsParameters: transport.dtlsParameters
    }
  }

  async createPlainTransport() {
    const transport = await this.router.createPlainTransport({
      listenIp: { ip: '0.0.0.0', announcedIp: '119.198.112.80'}, // 외부 아이피
      rtcpMux: false,
      comedia: true,
    })
    return transport;
  }
}
