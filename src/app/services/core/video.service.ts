import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { VideoData } from '@models/video.model';
import { IVideoService, VideoResponse } from '@services/core/interfaces/video-service.interface';
import { VideoFirebaseService } from '../providers/firebase/video.firebase.service';
import { db } from '../../../environments/firebase.config';

@Injectable({
  providedIn: 'root'
})
export class VideoService implements IVideoService {
  private provider: VideoFirebaseService;

  constructor(private http: HttpClient) {
    this.provider = new VideoFirebaseService(db);
  }

  /**
   * Get all videos from the data source
   */
  getVideos(): Observable<VideoResponse> {
    // TODO: Uncomment this code once Firebase data is available
    // return this.provider.getAllVideosObservable().pipe(
    //   map(videos => ({ data: videos }))
    // );

    // Using local JSON data temporarily until Firestore data is ready
    return this.http.get<any>('assets/videos.json').pipe(
      map(response => {
        const transformedData = response.data.map((item: any) => ({
          Title: item.Title,
          author: {
            username: item.author.username
          },
          description: item.description,
          video_url: item.video_url,
          category: item.category
        }));

        return { data: transformedData };
      })
    );
  }
}
