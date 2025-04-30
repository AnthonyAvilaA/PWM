import {
  addDoc,
  collection,
  CollectionReference,
  doc,
  DocumentSnapshot,
  Firestore,
  FirestoreDataConverter,
  getDoc,
  getDocs,
  SnapshotOptions,
  query,
  where,
  limit,
  orderBy,
  updateDoc,
  deleteDoc,
  startAfter
} from 'firebase/firestore';
import { News } from '@models/news';
import { Category } from '@models/types/categories';
import { NewsProvider } from '../interfaces/news.provider';
import { FullNews } from '@models/fullNews';
import { Injectable } from '@angular/core';
import { Observable, from, map, of, catchError, throwError, lastValueFrom } from 'rxjs';
import { User } from '@models/user';

interface FirestoreNews {
  title: string;
  authorID: string;
  description: string;
  content: string;
  image: string;
  categories: string[];
  usersCommentsID: string[];
  createdAt: Date;
  updatedAt: Date;
}

export const newsConverter: FirestoreDataConverter<News, FirestoreNews> = {
  toFirestore: (news: News) => {
    return {
      title: news.title,
      authorID: news.authorID,
      description: news.description,
      content: news.content,
      image: news.image,
      categories: news.categories,
      usersCommentsID: news.usersCommentsID,
      createdAt: news.createdAt,
      updatedAt: news.updatedAt,
    } as FirestoreNews;
  },
  fromFirestore: (snapshot: DocumentSnapshot, options: SnapshotOptions) => {
    const data = snapshot.data(options)! as FirestoreNews;
    return {
      ID: snapshot.id,
      title: data.title,
      authorID: data.authorID,
      description: data.description,
      content: data.content,
      image: data.image,
      categories: data.categories,
      usersCommentsID: data.usersCommentsID,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    } as News;
  },
};

@Injectable({
  providedIn: 'root'
})
export class NewsFirebaseProviderServiceService implements NewsProvider {
  private readonly newsCollection = 'news';
  private readonly db: Firestore;
  private readonly posts: CollectionReference<News>;

  // Last document for pagination
  private lastVisibleDoc: any = null;

  constructor(db: Firestore) {
    this.db = db;
    this.posts = collection(this.db, this.newsCollection).withConverter(newsConverter);
  }

  /**
   * Add a new news article to Firestore
   * @param news News object to create
   * @returns Promise with the ID of the created news
   */
  async addNews(news: News): Promise<string> {
    return (await addDoc(this.posts, news)).id;
  }

  /**
   * Get all news articles
   * @returns Promise with array of News objects
   */
  async getAllNews(): Promise<News[]> {
    const q = query(this.posts, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const news: News[] = snapshot.docs.map((doc) => doc.data());
    return news;
  }

  /**
   * Get news by category
   * @param category Category to filter by
   * @returns Promise with array of News objects matching the category
   */
  async getNewsByCategory(category: Category): Promise<News[]> {
    const q = query(
      this.posts,
      where('categories', 'array-contains', category.toLowerCase()),
    );

    const snapshot = await getDocs(q);
    const news: News[] = snapshot.docs.map((doc) => doc.data());
    return news;
  }

  /**
   * Get news by ID
   * @param id News ID
   * @returns Promise with the News object
   */
  async getNewsById(id: string): Promise<News> {
    const docRef = doc(this.posts, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error(`News with ID ${id} not found`);
    }

    return docSnap.data() as News;
  }


  /**
   * Get latest news articles
   * @param count Number of articles to fetch
   * @param resetPagination
   * @returns Promise with array of News objects
   */
  async getLatestNews(count: number = 6, resetPagination: boolean = false): Promise<News[]> {

    let q;
    if (this.lastVisibleDoc && !resetPagination) {
      // Continue from last document
      q = query(
        this.posts,
        orderBy('createdAt', 'desc'),
        startAfter(this.lastVisibleDoc),
        limit(count)
      );
    } else {
      // Start from the beginning
      q = query(
        this.posts,
        orderBy('createdAt', 'desc'),
        limit(count)
      );
    }

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return [];
    }

    // Store the last visible document for next pagination
    this.lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];

    return snapshot.docs.map((doc) => doc.data());
  }

  /**
   * Get related news articles
   * @param currentNewsId ID of current news to exclude
   * @param categories Categories to match against
   * @param count Number of related articles to fetch
   * @returns Promise with array of News objects
   */
  async getRelatedNews(currentNewsId: string, categories: string[], count: number = 3): Promise<News[]> {
    if (!categories || categories.length === 0) {
      return [];
    }

    const q = query(
      this.posts,
      where('categories', 'array-contains-any', categories.map(c => c.toLowerCase())),
      orderBy('createdAt', 'desc'),
      limit(count + 1) // Fetch one extra to account for potential current article
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return [];
    }

    // Filter out the current article and limit to requested count
    return snapshot.docs
      .filter(doc => doc.id !== currentNewsId)
      .slice(0, count)
      .map(doc => doc.data());
  }

  /**
   * Update an existing news article
   * @param id News ID
   * @param news Updated news data
   * @returns Promise indicating success
   */
  async updateNews(id: string, news: Partial<News>): Promise<void> {
    const docRef = doc(this.posts, id);

    // Update the timestamp
    const newsData = {
      ...news,
      updatedAt: new Date()
    };

    await updateDoc(docRef, newsData);
  }

  /**
   * Delete a news article
   * @param id News ID to delete
   * @returns Promise indicating success
   */
  async deleteNews(id: string): Promise<void> {
    const docRef = doc(this.posts, id);
    await deleteDoc(docRef);
  }

  // Observable wrapper methods for integration with Angular components

  /**
   * Observable wrapper for getAllNews
   * @returns Observable with array of News objects
   */
  getAllNewsObservable(): Observable<News[]> {
    return from(this.getAllNews());
  }

  /**
   * Observable wrapper for getNewsByCategory
   * @param category Category to filter by
   * @returns Observable with array of News objects
   */
  getNewsByCategoryObservable(category: Category): Observable<News[]> {
    return from(this.getNewsByCategory(category));
  }

  /**
   * Observable wrapper for getNewsById
   * @param id News ID
   * @returns Observable with the News object
   */
  getNewsByIdObservable(id: string): Observable<News> {
    return from(this.getNewsById(id));
  }


  /**
   * Observable wrapper for getLatestNews
   * @param count Number of articles to fetch
   * @param resetPagination Whether to reset pagination
   * @returns Observable with array of News objects
   */
  getLatestNewsObservable(count: number = 6, resetPagination: boolean = false): Observable<News[]> {
    return from(this.getLatestNews(count, resetPagination));
  }

  /**
   * Observable wrapper for getRelatedNews
   * @param currentNewsId ID of current news to exclude
   * @param categories Categories to match against
   * @param count Number of related articles to fetch
   * @returns Observable with array of News objects
   */
  getRelatedNewsObservable(currentNewsId: string, categories: string[], count: number = 3): Observable<News[]> {
    return from(this.getRelatedNews(currentNewsId, categories, count));
  }
}
