import {
  collection,
  CollectionReference,
  DocumentSnapshot,
  Firestore,
  FirestoreDataConverter,
  getDocs,
  orderBy,
  query,
  SnapshotOptions,
  where
} from 'firebase/firestore';
import { VideoData } from '@models/video.model';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { VideoFirebaseServiceInterface } from './interfaces/video-firebase-service.interface';

interface FirestoreVideo {
  title: string;
  author: {
    username: string;
  };
  description: string;
  video_url: string;
  category: string;
}

export const videoConverter: FirestoreDataConverter<VideoData, FirestoreVideo> = {
  toFirestore: (video: VideoData) => {
    return {
      title: video.Title,
      author: {
        username: video.author.username
      },
      description: video.description,
      video_url: video.video_url,
      category: video.category
    } as FirestoreVideo;
  },
  fromFirestore: (snapshot: DocumentSnapshot, options: SnapshotOptions) => {
    const data = snapshot.data(options)! as FirestoreVideo;
    return {
      Title: data.title,
      author: {
        username: data.author.username
      },
      description: data.description,
      video_url: data.video_url,
      category: data.category
    } as VideoData;
  },
};

@Injectable({
  providedIn: 'root'
})
export class VideoFirebaseService implements VideoFirebaseServiceInterface {
  private readonly videosCollection = 'videos';
  private readonly db: Firestore;
  private readonly videos: CollectionReference<VideoData>;

  constructor(db: Firestore) {
    this.db = db;
    this.videos = collection(this.db, this.videosCollection).withConverter(videoConverter);
  }

  /**
   * Get all videos
   * @returns Promise with array of VideoData objects
   */
  async getAllVideos(): Promise<VideoData[]> {
    const q = query(this.videos, orderBy('title'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data());
  }

  /**
   * Get videos by category
   * @param category Category to filter by
   * @returns Promise with array of VideoData objects matching the category
   */
  async getVideosByCategory(category: string): Promise<VideoData[]> {
    const q = query(
      this.videos,
      where('category', '==', category.toLowerCase())
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data());
  }

  /**
   * Observable wrapper for getAllVideos
   * @returns Observable with array of VideoData objects
   */
  getAllVideosObservable(): Observable<VideoData[]> {
    return from(this.getAllVideos());
  }

  /**
   * Observable wrapper for getVideosByCategory
   * @param category Category to filter by
   * @returns Observable with array of VideoData objects
   */
  getVideosByCategoryObservable(category: string): Observable<VideoData[]> {
    return from(this.getVideosByCategory(category));
  }
}
