import { Observable } from 'rxjs';
import { NewsModel } from '../../../models/news.model';
import { LiveNewsModel } from '../../../models/live-news.model';
import { Category } from '../../../models/types/categories.type';

/**
 * Interface defining the contract for news services
 */
export interface INewsService {
  /**
   * Get all news articles
   * @returns Observable with array of NewsModel objects
   */
  getAllNews(): Observable<NewsModel[]>;

  /**
   * Get news by ID
   * @param id News ID
   * @returns Observable with the NewsModel object
   */
  getNewsById(id: string): Observable<NewsModel | null>;

  /**
   * Get news by category
   * @param category Category name
   * @returns Observable with array of NewsModel objects
   */
  getNewsByCategory(category: Category): Observable<NewsModel[]>;

  /**
   * Get related news (excluding the current article)
   * @param currentNewsId ID of the current news article to exclude
   * @param categories Categories to match against
   * @param count Number of related articles to fetch
   * @returns Observable with array of NewsModel objects
   */
  getRelatedNews(currentNewsId: string, categories: string[], count?: number): Observable<NewsModel[]>;

  /**
   * Get latest news articles
   * @param count Number of articles to fetch
   * @param resetPagination Whether to reset pagination and start from the beginning
   * @returns Observable with array of NewsModel objects
   */
  getLatestNews(count?: number, resetPagination?: boolean): Observable<NewsModel[]>;

  /**
   * Get live news articles
   * @returns Observable with array of LiveNewsModel objects
   */
  getLiveNews(): Observable<LiveNewsModel[]>;

  /**
   * Create a new news article
   * @param news NewsModel object to create
   * @returns Promise with the ID of the created news
   */
  createNews(news: NewsModel): Promise<string>;

  /**
   * Update an existing news article
   * @param id NewsModel ID
   * @param news Updated news data
   * @returns Observable indicating success
   */
  updateNews(id: string, news: Partial<NewsModel>): Observable<void>;

  /**
   * Delete a news article
   * @param id NewsModel ID to delete
   * @returns Observable indicating success
   */
  deleteNews(id: string): Observable<void>;
}
