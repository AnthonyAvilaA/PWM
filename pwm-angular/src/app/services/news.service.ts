import { Injectable } from '@angular/core';
import { News } from '../models/news';
import { Observable, concatMap, from } from 'rxjs';
import { FullNews } from '../models/fullNews';
import { Category } from '../models/types/categories';
import { NewsFirebaseProviderServiceService } from './providers/firebase/news.firebase.provider.service.service';
import { db } from '../../environments/firebase.config';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private provider: NewsFirebaseProviderServiceService;

  constructor() {
    // Initialize the provider with Firestore database
    this.provider = new NewsFirebaseProviderServiceService(db);
  }

  /**
   * Get all news articles
   * @returns Observable with array of News objects
   */
  getAllNews(): Observable<News[]> {
    return this.provider.getAllNewsObservable();
  }

  /**
   * Get news by ID
   * @param id News ID
   * @returns Observable with the News object
   */
  getNewsById(id: string): Observable<FullNews | null> {
    return this.provider.getFullNewsByIdObservable(id);
  }

  /**
   * Get news by category
   * @param category Category name
   * @returns Observable with array of News objects
   */
  getNewsByCategory(category: string): Observable<News[]> {
    return this.provider.getNewsByCategoryObservable(category as Category);
  }

  /**
   * Get related news (excluding the current article)
   * @param currentNewsId ID of the current news article to exclude
   * @param categories Categories to match against
   * @param count Number of related articles to fetch
   * @returns Observable with array of News objects
   */
  getRelatedNews(currentNewsId: string, categories: string[], count: number = 3): Observable<News[]> {
    return this.provider.getRelatedNewsObservable(currentNewsId, categories, count);
  }

  /**
   * Get latest news articles
   * @param count Number of articles to fetch
   * @param resetPagination Whether to reset pagination and start from the beginning
   * @returns Observable with array of News objects
   */
  getLatestNews(count: number = 6, resetPagination: boolean = false): Observable<News[]> {
    return this.provider.getLatestNewsObservable(count, resetPagination);
  }

  /**
   * Create a new news article
   * @param news News object to create
   * @returns Observable with the ID of the created news
   */
  createNews(news: Omit<News, 'ID'>): Observable<string> {
    const newsWithId = { ...news, ID: '' } as News;
    return this.provider.getAllNewsObservable().pipe(
      // Using the first response as a trigger to call addNews
      // This is a workaround since addNews returns a Promise<string> and we need an Observable<string>
      concatMap(() => from(this.provider.addNews(newsWithId)))
    );
  }

  /**
   * Update an existing news article
   * @param id News ID
   * @param news Updated news data
   * @returns Observable indicating success
   */
  updateNews(id: string, news: Partial<News>): Observable<void> {
    return from(this.provider.updateNews(id, news));
  }

  /**
   * Delete a news article
   * @param id News ID to delete
   * @returns Observable indicating success
   */
  deleteNews(id: string): Observable<void> {
    return from(this.provider.deleteNews(id));
  }
}






