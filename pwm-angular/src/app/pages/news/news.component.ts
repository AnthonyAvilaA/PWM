import { Component } from '@angular/core';
import { NewsModel } from '@models/news.model';
import { ProviderService } from '@services/providers/provider.service';
import { NewsFirebaseServiceInterface } from '@services/providers/firebase/interfaces/news-firebase-service.interface';
import { UserFirebaseServiceInterface } from '@services/providers/firebase/interfaces/user-firebase-service.interface';
import { CommentFirebaseServiceInterface } from '@services/providers/firebase/interfaces/comment-firebase-service.interface';
import { ActivatedRoute } from '@angular/router';
import { FullNewsModel } from '@models/fullNews.model';
import { Timestamp } from 'firebase/firestore';
import { CommentModel } from '@models/comment.model';
import { UserModel } from '@models/user.model';

@Component({
  selector: 'app-news',
  imports: [],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css'
})
export class NewsComponent {

  private newsService: NewsFirebaseServiceInterface;
  private usersService: UserFirebaseServiceInterface;
  private commentsService: CommentFirebaseServiceInterface;
  public principalNews: FullNewsModel | undefined;
  public relatedNews: NewsModel[] = [];
  public otherNews: NewsModel[] = [];
  public commentUsers= new Map<string, UserModel>();

  constructor(private providerService: ProviderService, private route: ActivatedRoute) {
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
      const user: UserModel = await this.usersService.getUserById(comment.userID);
      this.commentUsers.set(comment.userID, user);
    }
  }

  public getUser(userId: string): UserModel {
    console.log(this.commentUsers.get(userId));
    return this.commentUsers.get(userId)!;
  }
}
