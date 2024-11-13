// video_source-sse.service.ts
import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

@Injectable()
export class VideoSourceSseService {
  private videoSourceEvents$ = new Subject();

  getVideoSourceEvents() {
    return this.videoSourceEvents$.asObservable();
  }

  emitEvent(event: any) {
    this.videoSourceEvents$.next(event);
  }
}
