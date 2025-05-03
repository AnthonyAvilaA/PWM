import { DocumentData, DocumentReference } from "firebase/firestore";
import { NewsModel } from "@models/news.model";
import { Category } from "@models/types/categories.type";
import { Observable } from "rxjs";

/**
 * Interface defining the contract for news provider implementations
 */
export interface NewsFirebaseServiceInterface {
    /**
     * Get related news articles
     * @param currentNewsId ID of current news to exclude
     * @param categories Categories to match against
     * @param count Number of related articles to fetch
     * @returns Promise with array of NewsModel objects
     */
    getRelatedNews(currentNewsId: string, categories: string[], count: number): Promise<NewsModel[]>;

    /**
     * Get all news articles
     * @returns Promise with array of NewsModel objects
     */
    getAllNews(): Promise<NewsModel[]>;

    /**
     * Get news by category
     * @param category Category to filter by
     * @returns Promise with array of NewsModel objects
     */
    getNewsByCategory(category: Category): Promise<NewsModel[]>;

    /**
     * Get news by ID
     * @param id NewsModel ID
     * @returns Promise with the NewsModel object
     */
    getNewsById(id: string): Promise<NewsModel>;

    /**
     * Create a new news article
     * @param news NewsModel object to create
     * @returns Promise with the ID of the created news
     */
    addNews(news: NewsModel): Promise<string>;

    /**
     * Update an existing news article
     * @param id NewsModel ID
     * @param news Updated news data
     * @returns Promise indicating success
     */
    updateNews(id: string, news: Partial<NewsModel>): Promise<void>;

    /**
     * Delete a news article
     * @param id NewsModel ID to delete
     * @returns Promise indicating success
     */
    deleteNews(id: string): Promise<void>;

    /**
     * Get latest news articles
     * @param count Number of articles to fetch
     * @param resetPagination Whether to reset pagination
     * @returns Promise with array of NewsModel objects
     */
    getLatestNews(count?: number, resetPagination?: boolean): Promise<NewsModel[]>;

    /**
     * Observable wrapper for getAllNews
     * @returns Observable with array of NewsModel objects
     */
    getAllNewsObservable(): Observable<NewsModel[]>;

    /**
     * Observable wrapper for getNewsByCategory
     * @param category Category to filter by
     * @returns Observable with array of NewsModel objects
     */
    getNewsByCategoryObservable(category: Category): Observable<NewsModel[]>;

    /**
     * Observable wrapper for getNewsById
     * @param id NewsModel ID
     * @returns Observable with the NewsModel object
     */
    getNewsByIdObservable(id: string): Observable<NewsModel>;

    /**
     * Observable wrapper for getLatestNews
     * @param count Number of articles to fetch
     * @param resetPagination Whether to reset pagination
     * @returns Observable with array of NewsModel objects
     */
    getLatestNewsObservable(count?: number, resetPagination?: boolean): Observable<NewsModel[]>;

    /**
     * Observable wrapper for getRelatedNews
     * @param currentNewsId ID of current news to exclude
     * @param categories Categories to match against
     * @param count Number of related articles to fetch
     * @returns Observable with array of NewsModel objects
     */
    getRelatedNewsObservable(currentNewsId: string, categories: string[], count?: number): Observable<NewsModel[]>;
}
