import { Module } from '@nestjs/common';
import { EventController } from 'src/controllers/event.controller';
import { EventService } from 'src/services/event.service';

@Module({
  controllers: [EventController],
  providers: [EventService]
})
export class EventModule {}