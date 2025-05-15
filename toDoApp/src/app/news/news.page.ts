import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { News } from '../models/news';
import { NewsService } from '../services/firebase/news.service';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom, Observable, of } from 'rxjs';
import { HeaderComponent } from "../components/header/header.component";
import { UserService } from '../services/firebase/user.service';
import { CommentService } from '../services/firebase/comment.service';
import { Comment } from '../models/comment';
import { User } from '../models/user';
import { IonicModule, IonIcon } from '@ionic/angular';
import { DbService } from '../services/db.service';
import { addIcons } from 'ionicons';

import { bookmark } from 'ionicons/icons';
import { bookmarkOutline } from 'ionicons/icons';

addIcons({
  'bookmark': bookmark,
  'bookmark-outline': bookmarkOutline
})


@Component({
  selector: 'ionic-app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HeaderComponent],
})
export class NewsPage implements OnInit {
  newsId: string = '';
  news!: Observable<News>;
  author!: Observable<User>;
  comments: Comment[] | null = null; 
  saveState: boolean = false;

  constructor(
    private newsService: NewsService,
    private userService: UserService,
    private commentService: CommentService,
    private dbService: DbService,
    private route: ActivatedRoute,
  ) { }

async ngOnInit() {
  this.newsId = this.route.snapshot.paramMap.get('id') || '';
  this.news = this.newsService.getNewsById(this.newsId);
  const newsSaved = await this.dbService.getAllNews();
  this.saveState = newsSaved.some((save) => save.newsID === this.newsId);

  this.news.subscribe(async (news) => {
    if (news) {

      news.authorID = String(news.authorID);

      // Fetch author details
      if (typeof news.authorID === 'string') {
        this.author = this.userService.getUserbyId(news.authorID);
      } else {
        console.error('Invalid authorID:', news.authorID);
      }

      // Fetch comments
      var comments: Comment[] = []
      for (let commentID of news.usersCommentsID) {
        const comment: Comment = await firstValueFrom(this.commentService.getCommentById(String(commentID)))
        const user: User = await firstValueFrom(this.userService.getUserbyId(String(comment.userID)));
        comments.push({
          ...comment,
          user: user
          } as Comment
        )
      }
      this.comments = comments;
    }
  });
}

  getContent(content: string): string {
    return content.replace(/<p>/g, '') // Eliminar todas las etiquetas <p>
      .replace(/<\/p>/g, '\n\n'); // Reemplazar </p> con un salto de línea
  }

  async getUser(userId: string): Promise<User> {
    if (typeof userId !== 'string') {
      return {} as User; // Retornar un objeto vacío o manejar el error según sea necesario
    }
    return await firstValueFrom(this.userService.getUserbyId(userId));
  }

  saveNews() {
    this.dbService.addNews(this.newsId)
    this.saveState = true;
  }
  unsaveNews() {
    this.dbService.deleteNews(this.newsId)
    this.saveState = false;
  }
}