import { Component } from '@angular/core';
import { News } from '@models/news';
import { ProviderServiceService } from '@services/provider-service.service';
import { NewsProvider } from '@services/providers/interfaces/news.provider';
import { UserProvider } from '@services/providers/interfaces/user.provider';
import { CommentProvider } from '@services/providers/interfaces/comment.provider';
import { ActivatedRoute } from '@angular/router';
import { FullNews } from '@models/fullNews';
import { Timestamp } from 'firebase/firestore';
import { Comment } from '@models/comment';
import { User } from '@models/user';

@Component({
  selector: 'app-news',
  imports: [],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css'
})
export class NewsComponent {
  
  private newsService: NewsProvider;
  private usersService: UserProvider;
  private commentsService: CommentProvider;
  public principalNews: FullNews | undefined;
  public relatedNews: News[] = [];
  public otherNews: News[] = [];
  public commentUsers= new Map<string, User>();
  
  constructor(private providerService: ProviderServiceService, private route: ActivatedRoute) {
    this.newsService = providerService.newsProvider;
    this.usersService = providerService.usersProvider;
    this.commentsService = providerService.commentsProvider;
    this.initPrincipalNews();
  }
  
  async initPrincipalNews() {
    var newsID: string = "";
    this.route.paramMap.subscribe(params => {
      newsID = params.get('newsID') as string;
    });
    this.principalNews = await this.providerService.getFullNewsById(newsID);
    
    try {
      this.principalNews!.news!.content = this.principalNews.news.content
      .replace(/<p>/g, '') // Eliminar todas las etiquetas <p>
      .replace(/<\/p>/g, '\n\n'); // Reemplazar </p> con un salto de línea
    } catch (error) {
      console.error('Error al procesar el contenido de la noticia:', error);
    }
  
    const news =  await this.newsService.getRelatedNews(this.principalNews!.news!.ID, this.principalNews!.news!.categories, 6);
    this.relatedNews = news.slice(0, 3); 
    this.otherNews = news.slice(3, 6);
    this.initComments();
  }

  public getFirestoreDate(firestoreDate: any): string {
    if (firestoreDate === undefined || firestoreDate === null) {return "0/0/0 0:0:0"}
    const date = new Date((firestoreDate as unknown as Timestamp).seconds * 1000);
    return date.toLocaleDateString() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  }

  public fromStringToDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  }

  async initComments() {
    for (const comment of this.principalNews!.comments) {
      const user: User = await this.usersService.getUserById(comment.userID);
      this.commentUsers.set(comment.userID, user);
    }
  }
  
  public getUser(userId: string): User {
    console.log(this.commentUsers.get(userId));
    return this.commentUsers.get(userId)!;
  }
}
