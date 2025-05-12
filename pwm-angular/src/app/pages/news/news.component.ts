import { Component, OnInit } from '@angular/core';
import { NewsModel } from '../../models/news.model';
import { ProviderService } from '../../services/providers/provider.service';
import { NewsFirebaseServiceInterface } from '../../services/providers/firebase/interfaces/news-firebase-service.interface';
import { UserFirebaseServiceInterface } from '../../services/providers/firebase/interfaces/user-firebase-service.interface';
import { CommentFirebaseServiceInterface } from '../../services/providers/firebase/interfaces/comment-firebase-service.interface';
import { ActivatedRoute } from '@angular/router';
import { FullNewsModel } from '../../models/full-news.model';
import { Timestamp } from 'firebase/firestore';
import { CommentModel } from '../../models/comment.model';
import { UserModel } from '../../models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-news',
  imports: [CommonModule],
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css'],
  standalone: true
})
export class NewsComponent implements OnInit {

  private newsService: NewsFirebaseServiceInterface;
  private usersService: UserFirebaseServiceInterface;
  private commentsService: CommentFirebaseServiceInterface;
  public principalNews: FullNewsModel | undefined;
  public relatedNews: NewsModel[] = [];
  public otherNews: NewsModel[] = [];
  public commentUsers= new Map<string, UserModel>();
  public loading: boolean = true;
  public error: string | null = null;
  public newsId: string = "";

  constructor(private providerService: ProviderService, private route: ActivatedRoute) {
    this.newsService = providerService.newsProvider;
    this.usersService = providerService.usersProvider;
    this.commentsService = providerService.commentsProvider;
  }

  ngOnInit() {
    this.initPrincipalNews();
  }

  async initPrincipalNews() {
    this.loading = true;
    this.error = null;

    try {
      this.route.paramMap.subscribe(params => {
        this.newsId = params.get('newsID') as string;
      });

      if (!this.newsId) {
        throw new Error('ID de noticia no encontrado');
      }

      this.principalNews = await this.providerService.getFullNewsById(this.newsId);

      if (!this.principalNews || !this.principalNews.news) {
        throw new Error('No se pudo cargar la noticia');
      }

      try {
        this.principalNews.news.content = this.principalNews.news.content
        .replace(/<p>/g, '') // Eliminar todas las etiquetas <p>
        .replace(/<\/p>/g, '\n\n'); // Reemplazar </p> con un salto de línea
      } catch (error) {
        console.error('Error al procesar el contenido de la noticia:', error);
      }

      const news = await this.newsService.getRelatedNews(this.principalNews.news.ID, this.principalNews.news.categories, 6);
      this.relatedNews = news.filter(n => n.ID !== this.principalNews!.news!.ID);

      this.otherNews = await this.newsService.getLatestNews(3);
      this.otherNews = this.otherNews.filter(n => n.ID !== this.principalNews!.news!.ID);

      // Load comment users
      if (this.principalNews.comments) {
        for (const comment of this.principalNews.comments) {
          this.loadUserFromComment(comment);
        }
      }

      this.loading = false;
    } catch (err) {
      console.error('Error loading news:', err);
      this.error = err instanceof Error ? err.message : 'Error al cargar la noticia';
      this.loading = false;
    }
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

  async loadUserFromComment(comment: CommentModel) {
    const user: UserModel = await this.usersService.getUserById(comment.userID);
    this.commentUsers.set(comment.userID, user);
  }

  public getUser(userId: string): UserModel {
    console.log(this.commentUsers.get(userId));
    return this.commentUsers.get(userId)!;
  }
}
