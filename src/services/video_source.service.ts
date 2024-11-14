import { Injectable, Logger } from '@nestjs/common';
import { CreateVideoSourceDto } from 'src/dto/create/create-videoSource.dto';
import { PrismaService } from './prisma.service';
import { OnvifDevice } from 'node-onvif-ts';
import {
  OnvifAuthenticationException,
  OnvifConnectionException,
} from 'src/exceptions/video_source.exception';
import { VideoSourceDto } from 'src/dto/videoSource.dto';
import { Subject } from 'rxjs';
import { handleDatabaseException } from 'src/exceptions/database.exception';
import { UpdateVideoSourceDto } from 'src/dto/update/update-videoSource.dto';
import { DeleteVideoSourceDto } from 'src/dto/delete/delete-videoSource';

@Injectable()
export class VideoSourceService {
  constructor(private prisma: PrismaService) {}

  private videoSourceEvents$ = new Subject<VideoSourceDto[]>();
  private readonly logger = new Logger(VideoSourceService.name);

  async createVideoSource(
    createVideoSourceDto: CreateVideoSourceDto,
  ): Promise<VideoSourceDto> {
    const device = new OnvifDevice({
      xaddr: `http://${createVideoSourceDto.onvif}/onvif/device_service`, // ONVIF 장치의 서비스 주소
      user: createVideoSourceDto.user,
      pass: createVideoSourceDto.pass,
    });
    this.logger.debug(JSON.stringify(createVideoSourceDto));
    try {
      await device.init();
      try {
        const rtspUrl = device.getUdpStreamUrl();
        this.logger.log(device.getInformation());
        const deviceInfo = {
          onvif: `${createVideoSourceDto.onvif}`,
          name: createVideoSourceDto.name || 'Unknown Model',
          rtsp: rtspUrl.replace(
            'rtsp://',
            `rtsp://${createVideoSourceDto.user}:${createVideoSourceDto.pass}@`,
          ),
        };
        try {
          const createdVideoSource = await this.prisma.videoSource.upsert({
            where: { onvif: deviceInfo.onvif },
            update: deviceInfo,
            create: deviceInfo,
          });
          const allVideoSource = await this.readVideoSource();
          this.emitEvent(allVideoSource);
          return createdVideoSource;
        } catch (error) {
          this.logger.error(error);
          handleDatabaseException(error);
        }
      } catch (error) {
        this.logger.error(error);
        throw new OnvifAuthenticationException();
      }
    } catch (error) {
      this.logger.error(error);
      throw new OnvifConnectionException();
    }
  }

  async readVideoSource(): Promise<VideoSourceDto[]> {
    try {
      const videoSourceInfo = await this.prisma.videoSource.findMany();
      return videoSourceInfo;
    } catch (error) {
      handleDatabaseException(error);
    }
  }

  async updateVideoSource(
    updateVideoSourceDto: UpdateVideoSourceDto,
  ): Promise<VideoSourceDto> {
    try {
      const { id, ...fieldsToUpdate } = updateVideoSourceDto;
      const data = Object.fromEntries(
        Object.entries(fieldsToUpdate).filter(
          ([_, value]) => value !== undefined,
        ),
      );
      const videoSourceInfo = await this.prisma.videoSource.update({
        where: { id },
        data,
      });
      return videoSourceInfo;
    } catch (error) {
      handleDatabaseException(error);
    }
  }

  async deleteVideoSource(deleteVideoSource: DeleteVideoSourceDto) {
    const { id } = deleteVideoSource;
    try {
      const videoSourceInfo = await this.prisma.videoSource.delete({
        where: { id },
      });
      return videoSourceInfo;
    } catch (error) {
      handleDatabaseException(error);
    }
  }

  subscribeEvent() {
    return this.videoSourceEvents$.asObservable();
  }

  emitEvent(allDevice: VideoSourceDto[]) {
    this.videoSourceEvents$.next(allDevice);
  }
}
