import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OnvifDevice } from 'node-onvif-ts';
import { CreateVideoSourceDto } from '../dto/create-video-source.dto'
import { OnvifConnectionError, OnvifAuthenticationError, DatabaseError } from '../video_source.errors';
import { VideoSourceSseService } from '../video_source-sse/video_source-sse.service';

@Injectable()
export class VideoSourceCreateService {
  
  constructor(
    private prisma: PrismaService,
    private readonly videoSourceSseService: VideoSourceSseService
  ) {}
  
  private readonly logger = new Logger(VideoSourceCreateService.name);

  async createVideoSource(createVideoSourceDto: CreateVideoSourceDto): Promise<any> {
    return new Promise( async (resolve, reject) => {
      this.logger.log(createVideoSourceDto)
      const device = new OnvifDevice({
        xaddr: `http://${createVideoSourceDto.ip}:${createVideoSourceDto.port}/onvif/device_service`,  // ONVIF 장치의 서비스 주소
        user : createVideoSourceDto.user,
        pass : createVideoSourceDto.pass
      });

      try {
        await device.init()
        try {
          const rtspUrl = device.getUdpStreamUrl();
          this.logger.log(device.getInformation())
          const deviceInfo = {
            onvif: `${createVideoSourceDto.ip}:${createVideoSourceDto.port}`,
            name: createVideoSourceDto.name || 'Unknown Model',
            rtsp: rtspUrl.replace('rtsp://', `rtsp://${createVideoSourceDto.user}:${createVideoSourceDto.pass}@`),
          };
          this.logger.log(deviceInfo)
          try {
            const allDevice = await this.prisma.$transaction([
              this.prisma.videoSource.
              upsert({
                where: { onvif: deviceInfo.onvif },
                update: deviceInfo,
                create: deviceInfo,
              }),
              this.prisma.videoSource.findMany()
            ])
            this.videoSourceSseService.emitEvent(allDevice);
            resolve(allDevice);
          } catch (err) {
            this.logger.error(err)
            return reject(new DatabaseError(err));
          }
        } catch (err) {
          this.logger.error(err)
          return reject(new OnvifAuthenticationError(err));
        }
      } catch (err) {
        this.logger.error(err)
        return reject(new OnvifConnectionError(err));
      }
    });
  }

  // private async getRtspUrl(device: OnvifDevice): Promise<string> {
  //   try {
  //     const url = device.getUdpStreamUrl();
  //     return url
  //   } catch (error) {
  //     console.error('Failed to retrieve RTSP URL:', error);
  //     throw new Error('Unable to get RTSP stream URL');
  //   }
  // }
}
