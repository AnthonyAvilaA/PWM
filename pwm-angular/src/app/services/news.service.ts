import { Injectable } from '@angular/core';
import { News } from '../models/news';
import { Observable, from, map } from 'rxjs';
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
   * Normalizes text by removing accents
   * @param text Text to normalize
   * @returns Normalized text without accents
   */
  private normalizeText(text: string): string {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  /**
   * Get news by category
   * @param category Category name
   * @returns Observable with array of News objects
   */
  getNewsByCategory(category: string): Observable<News[]> {
    // Find the matching category by normalizing both the input and the enum values
    const normalizedInputCategory = this.normalizeText(category);

    // Find the matching category from the enum
    const matchingCategory = Object.values(Category).find(enumValue =>
      this.normalizeText(enumValue as string) === normalizedInputCategory
    );

    // Use the matched category, or fallback to the original input
    const categoryToUse = matchingCategory as Category || category as Category;

    return this.provider.getNewsByCategoryObservable(categoryToUse)
      .pipe(
        // Sort news by createdAt date on the client side instead of in Firestore
        // to avoid needing a composite index
        map(news => news.sort((a, b) => {
          const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
          const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime(); // Sort in descending order (newest first)
        }))
      );
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
   * @returns Promise with the ID of the created news
   */
  async createNews(news: News): Promise<string> {
    return await this.provider.addNews(news);
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
