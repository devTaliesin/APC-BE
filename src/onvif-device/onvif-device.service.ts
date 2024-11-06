import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OnvifDevice } from 'node-onvif-ts';

@Injectable()
export class OnvifDeviceService {
  private connectedDevices: any[] = [];

  constructor(private prisma: PrismaService) {}

  // 특정 IP의 ONVIF 장치에 연결하는 메서드
  async connectToDevice(ip: string, name:string, port: number = 80, user: string = 'admin', pass: string = 'password'): Promise<any> {
    return new Promise((resolve, reject) => {
      const device = new OnvifDevice({
        xaddr: `http://${ip}:${port}/onvif/device_service`,  // ONVIF 장치의 서비스 주소
        user,
        pass
      });

      device.init()
        .then(async() => {
          console.log(`Connected to ONVIF device at ${ip}`);
          const rtspUrl = await this.getRtspUrl(device);

          const deviceInfo = {
            onvif: `${ip}:${port}`,
            name: name || 'Unknown Model', // 이름을 컨트롤러에서 받아옴
            rtsp: rtspUrl,
          };

          const updatedDevice = await this.prisma.videoSource.upsert({
            where: { onvif: ip },
            update: deviceInfo,
            create: deviceInfo,
          });

          this.connectedDevices.push(updatedDevice);
          resolve(updatedDevice);
        })
        .catch((err) => {
          console.error(`Failed to connect to ONVIF device at ${ip}:`, err);
          reject(err);
        });
    });
  }

  private async getRtspUrl(device: OnvifDevice): Promise<string> {
    try {
      const url = device.getUdpStreamUrl();
      return url
    } catch (error) {
      console.error('Failed to retrieve RTSP URL:', error);
      throw new Error('Unable to get RTSP stream URL');
    }
  }

  // 연결된 장치 목록 반환
  getConnectedDevices(): any[] {
    return this.connectedDevices;
  }
}
