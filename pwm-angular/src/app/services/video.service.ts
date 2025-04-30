import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { VideoData } from '@models/video';


interface VideoResponse {
  data: VideoData[];
}

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  constructor(private http: HttpClient) { }

  /**
   * Get all videos from the data source
   */
  getVideos(): Observable<VideoResponse> {
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
