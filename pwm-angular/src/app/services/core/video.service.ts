import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { VideoData } from '../../models/video.model';
import { IVideoService, VideoResponse } from './interfaces/video-service.interface';
import { VideoFirebaseService } from '../providers/firebase/video.firebase.service';
import { db } from '../../../environments/firebase.config';

@Injectable({
  providedIn: 'root'
})
export class VideoService implements IVideoService {
  private provider: VideoFirebaseService;

  constructor() {
    this.provider = new VideoFirebaseService(db);
  }

  /**
   * Get all videos from the data source
   */
  getVideos(): Observable<VideoResponse> {
    return this.provider.getAllVideosObservable().pipe(
      map(videos => ({ data: videos }))
    );
  }
}
