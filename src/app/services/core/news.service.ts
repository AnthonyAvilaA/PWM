import { Injectable } from '@angular/core';
import { NewsModel } from '@models/news.model';
import { Observable, from, map } from 'rxjs';
import { Category } from '@models/types/categories.type';
import { NewsFirebaseService } from '../providers/firebase/news.firebase.service';
import { db } from '../../../environments/firebase.config';
import { INewsService } from '@services/core/interfaces/news-service.interface';
import {LiveNewsModel} from '@models/live-news.model';

@Injectable({
  providedIn: 'root'
})
export class NewsService implements INewsService {
  private provider: NewsFirebaseService;

  constructor() {
    this.provider = new NewsFirebaseService(db);
  }

  /**
   * Get all news articles
   * @returns Observable with array of NewsModel objects
   */
  getAllNews(): Observable<NewsModel[]> {
    return this.provider.getAllNewsObservable();
  }

  /**
   * Get news by ID
   * @param id NewsModel ID
   * @returns Observable with the NewsModel object
   */
  getNewsById(id: string): Observable<NewsModel | null> {
    return this.provider.getNewsByIdObservable(id);
  }

  /**
   * Get news by category
   * @param category Category name
   * @returns Observable with array of NewsModel objects
   */
  getNewsByCategory(category: Category): Observable<NewsModel[]> {

    return this.provider.getNewsByCategoryObservable(category)
      .pipe(
        //sort in descending order by createdAt date
        map(news => news.sort((a, b) => {
          const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
          const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime();
        }))
      );
  }

  /**
   * Get related news (excluding the current article)
   * @param currentNewsId ID of the current news article to exclude
   * @param categories Categories to match against
   * @param count Number of related articles to fetch
   * @returns Observable with array of NewsModel objects
   */
  getRelatedNews(currentNewsId: string, categories: string[], count: number = 3): Observable<NewsModel[]> {
    return this.provider.getRelatedNewsObservable(currentNewsId, categories, count);
  }

  /**
   * Get latest news articles
   * @param count Number of articles to fetch
   * @param resetPagination Whether to reset pagination and start from the beginning
   * @returns Observable with array of NewsModel objects
   */
  getLatestNews(count: number = 6, resetPagination: boolean = false): Observable<NewsModel[]> {
    return this.provider.getLatestNewsObservable(count, resetPagination);
  }

  /**
   * Get live news articles
   * @returns Observable with array of LiveNewsModel objects
   */
  getLiveNews(): Observable<LiveNewsModel[]> {
    return this.provider.getLiveNewsObservable();
  }

  /**
   * Create a new news article
   * @param news NewsModel object to create
   * @returns Promise with the ID of the created news
   */
  async createNews(news: NewsModel): Promise<string> {
    return await this.provider.addNews(news);
  }



  /**
   * Update an existing news article
   * @param id NewsModel ID
   * @param news Updated news data
   * @returns Observable indicating success
   */
  updateNews(id: string, news: Partial<NewsModel>): Observable<void> {
    return from(this.provider.updateNews(id, news));
  }

  /**
   * Delete a news article
   * @param id NewsModel ID to delete
   * @returns Observable indicating success
   */
  deleteNews(id: string): Observable<void> {
    return from(this.provider.deleteNews(id));
  }

}
