import { DocumentData, DocumentReference } from "firebase/firestore";
import { News } from "@models/news";
import { Category as Category } from "@models/types/categories";

export interface NewsProvider {
    getRelatedNews(currentNewsId: string, categories: string[], count: number): Promise<News[]>;
    
    getAllNews(): Promise<News[]>;

    getNewsByCategory(category: Category): Promise<News[]>;

    getNewsById(id: string): Promise<News>;

    addNews(news: News): Promise<string>;
}
