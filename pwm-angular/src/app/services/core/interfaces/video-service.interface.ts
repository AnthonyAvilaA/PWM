import { Observable } from 'rxjs';
import { VideoData } from '../../../models/video.model';

/**
 * Response interface for video data
 */
export interface VideoResponse {
  data: VideoData[];
}

/**
 * Interface defining the contract for video services
 */
export interface IVideoService {
  /**
   * Get all videos from the data source
   * @returns Observable with VideoResponse object containing video data
   */
  getVideos(): Observable<VideoResponse>;
}
