import { Test, TestingModule } from '@nestjs/testing';
import { VideoSourceController } from './video_source.controller';
import { VideoSourceCreateService } from './video_source-create/video_source-create.service';
import { CreateVideoSourceDto } from './dto/create-video-source.dto';
import { Response } from 'express';
describe('OnvifDeviceController', () => {
  let controller: VideoSourceController;
  let service: VideoSourceCreateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideoSourceController],
      providers: [
        {
          provide: VideoSourceCreateService,
          useValue: {
            connectToDevice: jest.fn(),
            getConnectedDevices: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<VideoSourceController>(VideoSourceController);
    service = module.get<VideoSourceCreateService>(VideoSourceCreateService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('connectToDevice', () => {
    it('should call OnvifDeviceService.connectToDevice with correct parameters', async () => {
      const connectToDeviceSpy = jest.spyOn(service, 'createVideoSource').mockResolvedValue({
        id: 1,
        onvif: '192.168.0.143:80',
        name: 'test',
        rtsp: 'rtsp://192.168.0.143:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif',
      });
      // const createVideoSourceDto = new CreateVideoSourceDto
      // const res = new Response()
      // const result = await controller.connectToDevice(createVideoSourceDto, res);
      // expect(connectToDeviceSpy).toHaveBeenCalledWith('192.168.0.143', 'test', 80, 'admin', 'password');
      // expect(result).toEqual({
      //   id: 1,
      //   onvif: '192.168.0.143:80',
      //   name: 'test',
      //   rtsp: 'rtsp://192.168.0.143:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif',
      // });
    });
  });
});
