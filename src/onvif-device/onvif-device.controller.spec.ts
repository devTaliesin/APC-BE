import { Test, TestingModule } from '@nestjs/testing';
import { OnvifDeviceController } from './onvif-device.controller';
import { OnvifDeviceService } from './onvif-device.service';

describe('OnvifDeviceController', () => {
  let controller: OnvifDeviceController;
  let service: OnvifDeviceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OnvifDeviceController],
      providers: [
        {
          provide: OnvifDeviceService,
          useValue: {
            connectToDevice: jest.fn(),
            getConnectedDevices: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<OnvifDeviceController>(OnvifDeviceController);
    service = module.get<OnvifDeviceService>(OnvifDeviceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('connectToDevice', () => {
    it('should call OnvifDeviceService.connectToDevice with correct parameters', async () => {
      const connectToDeviceSpy = jest.spyOn(service, 'connectToDevice').mockResolvedValue({
        id: 1,
        onvif: '192.168.0.143:80',
        name: 'test',
        rtsp: 'rtsp://192.168.0.143:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif',
      });

      const result = await controller.connectToDevice('192.168.0.143', 'test', 80, 'admin', 'password');
      expect(connectToDeviceSpy).toHaveBeenCalledWith('192.168.0.143', 'test', 80, 'admin', 'password');
      expect(result).toEqual({
        id: 1,
        onvif: '192.168.0.143:80',
        name: 'test',
        rtsp: 'rtsp://192.168.0.143:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif',
      });
    });
  });

  describe('getConnectedDevices', () => {
    it('should return the connected devices from OnvifDeviceService', () => {
      const mockDevices = [
        { id: 1, onvif: '192.168.0.143:80', name: 'test', rtsp: 'rtsp://192.168.0.143:554/stream' },
      ];

      jest.spyOn(service, 'getConnectedDevices').mockReturnValue(mockDevices);

      expect(controller.getConnectedDevices()).toEqual(mockDevices);
    });
  });
});
