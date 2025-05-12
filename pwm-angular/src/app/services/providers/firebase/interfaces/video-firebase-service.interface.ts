import { VideoData } from "../../../../models/video.model";
import { Observable } from "rxjs";

/**
 * Interface defining the contract for video provider implementations
 */
export interface VideoFirebaseServiceInterface {
  /**
   * Get all videos
   * @returns Promise with array of VideoData objects
   */
  getAllVideos(): Promise<VideoData[]>;

  /**
   * Get videos by category
   * @param category Category to filter by
   * @returns Promise with array of VideoData objects matching the category
   */
  getVideosByCategory(category: string): Promise<VideoData[]>;

  /**
   * Observable wrapper for getAllVideos
   * @returns Observable with array of VideoData objects
   */
  getAllVideosObservable(): Observable<VideoData[]>;

  /**
   * Observable wrapper for getVideosByCategory
   * @param category Category to filter by
   * @returns Observable with array of VideoData objects
   */
  getVideosByCategoryObservable(category: string): Observable<VideoData[]>;
}
