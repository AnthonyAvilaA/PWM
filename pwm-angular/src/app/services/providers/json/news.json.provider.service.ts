import { Injectable } from '@angular/core';
import { News } from '../../../models/news';
import { Category } from '../../../models/types/categories';
import { NewsProvider } from '../interfaces/news.provider';
import { DocumentReference, DocumentData } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class NewsJsonProviderService implements NewsProvider {

  constructor() { }
  addNews(news: News): Promise<DocumentReference<News, DocumentData>> {
    throw new Error('Method not implemented.');
  }
  
  getAllNews(): Promise<News[]> {
    return fetch('assets/data.json')
      .then(response => response.json())
      .then(data => {
        // Validate that the data property is an array
        if (!Array.isArray(data.data)) {
          throw new Error('The data format is not an array.');
        }
  
        return data.data.map((item: any) => {
          // Process the content
          let news_content = "";
          if (Array.isArray(item.Content)) {
            for (const content of item.Content) {
              const paragraph = content.children?.[0]?.text || "";
              if (paragraph === "") continue;
              news_content += `<p>${paragraph}</p>`;
            }
          }
  
          // Process the usersCommentsID
          const usersCommentsID = Array.isArray(item.comments)
            ? item.comments.map((comment: any) => comment.id)
            : [];
  
          // Return the mapped News object
          return {
            title: item.Title || "",
            authorID: item.user?.id || "",
            description: item.short_description || "",
            content: news_content,
            image: item.image_url || "",
            categories: [item.category1, item.category2, item.category3].filter(
              (category: string | null) => category !== null
            ),
            usersCommentsID: usersCommentsID,
            createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
            updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(),
          } as News;
        });
      })
      .catch(error => {
        console.error('Error fetching news:', error);
        throw error;
      });
  }
  
  getNewsByCategory(category: Category): Promise<News[]> {
    throw new Error('Method not implemented.');
  }
  getNewsById(id: string): Promise<News> {
    throw new Error('Method not implemented.');
  }
}
