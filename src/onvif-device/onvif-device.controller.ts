import { Controller, Post, Body } from '@nestjs/common';
import { OnvifDeviceService } from './onvif-device.service';

@Controller('onvif')
export class OnvifDeviceController {
  constructor(private readonly onvifDeviceService: OnvifDeviceService) {}

  @Post('connect')
  async connectToDevice(
    @Body('ip') ip: string,
    @Body('name') name: string,
    @Body('port') port: number = 80,
    @Body('user') user: string = 'admin',
    @Body('pass') pass: string = 'password'
  ) {
    if (!ip) {
      return { error: 'IP address is required' };
    }
    try {
      const device = await this.onvifDeviceService.connectToDevice(ip, name, port, user, pass);
      return device;
    } catch (error) {
      return { error: `Failed to connect to ONVIF device at ${ip}`, details: error.message };
    }
  }

  @Post('devices')
  getConnectedDevices() {
    return this.onvifDeviceService.getConnectedDevices();
  }
}
