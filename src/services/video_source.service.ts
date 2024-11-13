import { Injectable, Logger } from '@nestjs/common';
import { CreateVideoSourceDto } from 'src/dto/create/create-videoSource.dto';
import { PrismaService } from './prisma.service';
import { OnvifDevice } from 'node-onvif-ts';
import { OnvifAuthenticationException, OnvifConnectionException } from 'src/exceptions/video_source.exception';
import { VideoSourceDto } from 'src/dto/videoSource.dto';
import { Subject } from 'rxjs';
import { handleDatabaseException } from 'src/exceptions/databse.exception';

@Injectable()
export class VideoSourceService {
  constructor(
    private prisma: PrismaService,
  ) {}
  
  private videoSourceEvents$ = new Subject();
  private readonly logger = new Logger(VideoSourceService.name);

  async createVideoSource(createVideoSourceDto: CreateVideoSourceDto): Promise<VideoSourceDto[]> {
    const device = new OnvifDevice({
      xaddr: `http://${createVideoSourceDto.onvif}/onvif/device_service`,  // ONVIF 장치의 서비스 주소
      user : createVideoSourceDto.user,
      pass : createVideoSourceDto.pass
    });
    try {
      await device.init()
      try {
        const rtspUrl = device.getUdpStreamUrl();
        this.logger.log(device.getInformation())
        const deviceInfo = {
          onvif: `${createVideoSourceDto.onvif}`,
          name: createVideoSourceDto.name || 'Unknown Model',
          rtsp: rtspUrl.replace('rtsp://', `rtsp://${createVideoSourceDto.user}:${createVideoSourceDto.pass}@`),
        };
        try {
          const allDevice = await this.prisma.$transaction( async (prisma) => {
            await prisma.videoSource.
            upsert({
              where: { onvif: deviceInfo.onvif },
              update: deviceInfo,
              create: deviceInfo,
            });

            return await prisma.videoSource.findMany()
          })
          this.emitEvent(allDevice);
          return allDevice;
        } catch (error) {
          this.logger.error(error)
          handleDatabaseException(error);
        }
      } catch (error) {
        this.logger.error(error)
        throw new OnvifAuthenticationException();
      }
    } catch (error) {
      this.logger.error(error)
      throw new OnvifConnectionException();
    }
  }

  async readVideoSource (): Promise<VideoSourceDto[]> {
    try {
      const videoSourceInfo = await this.prisma.videoSource.findMany()
      return videoSourceInfo
    } catch (error) {
      handleDatabaseException(error);
    }
  }

  async subscribeEvent() {
    return this.videoSourceEvents$.asObservable();
  }

  async emitEvent(allDevice: VideoSourceDto[]) {
    this.videoSourceEvents$.next(allDevice);
  }
}