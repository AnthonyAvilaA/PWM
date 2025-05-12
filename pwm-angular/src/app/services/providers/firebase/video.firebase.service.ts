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
import { VideoData } from '../../../models/video.model';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { VideoFirebaseServiceInterface } from './interfaces/video-firebase-service.interface';

/**
 * Interface representing video data structure in Firestore
 * This closely matches VideoData but with field names that match the database
 */
interface FirestoreVideo {
  documentId: string;
  title: string;
  author: {
    documentId: string;
    username: string;
    email?: string;
  };
  description: string;
  video_url: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date | null;
}

/**
 * Data converter for VideoData to/from Firestore
 */
export const videoConverter: FirestoreDataConverter<VideoData, FirestoreVideo> = {
  toFirestore: (video: VideoData) => {
    return {
      documentId: video.documentId || '',
      title: video.Title,
      author: {
        documentId: video.author.documentId || '',
        username: video.author.username,
        email: video.author.email || ''
      },
      description: video.description,
      video_url: video.video_url,
      category: video.category,
      createdAt: video.createdAt || new Date(),
      updatedAt: video.updatedAt || new Date(),
      publishedAt: video.publishedAt || null
    } as FirestoreVideo;
  },
  fromFirestore: (snapshot: DocumentSnapshot, options: SnapshotOptions) => {
    const data = snapshot.data(options) as FirestoreVideo;
    
    // Convert Firestore document to VideoData format
    // Using type assertion to bridge the gap between the model and Firestore
    return {
      id: snapshot.id,
      documentId: data.documentId || snapshot.id,
      Title: data.title,
      author: {
        documentId: data.author.documentId || '',
        username: data.author.username,
        email: data.author.email || ''
      },
      description: data.description,
      video_url: data.video_url,
      category: data.category,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      publishedAt: data.publishedAt || null
    } as VideoData;
  },
};

/**
 * Service for interacting with video data in Firebase Firestore
 */
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
   * Get all videos sorted by creation date (newest first)
   * @returns Promise with array of VideoData objects
   */
  async getAllVideos(): Promise<VideoData[]> {
    const q = query(this.videos, orderBy('createdAt', 'desc'));
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
