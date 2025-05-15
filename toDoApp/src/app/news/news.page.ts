import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { News } from '../models/news';
import { NewsService } from '../services/firebase/news.service';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { HeaderComponent } from "../components/header/header.component";
import { UserService } from '../services/firebase/user.service';
import { CommentService } from '../services/firebase/comment.service';
import { Comment } from '../models/comment';
import { User } from '../models/user';
import { IonicModule } from '@ionic/angular';
import { DbService, NewsInterface } from '../services/db.service';
import { addIcons } from 'ionicons';

import { bookmark } from 'ionicons/icons';
import { bookmarkOutline } from 'ionicons/icons';
import { AuthService } from '../services/firebase/auth.service';

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
  newsID: string = '';
  news!: Observable<News>;
  author!: Observable<User>;
  comments: Comment[] | null = null;
  saveState: boolean = false;
  newsSaved: NewsInterface[] = [];

  constructor(
    private newsService: NewsService,
    private userService: UserService,
    private commentService: CommentService,
    private dbService: DbService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
  ) { }

  async ngOnInit() {
    this.newsID = this.route.snapshot.paramMap.get('id') || '';
    this.news = this.newsService.getNewsById(this.newsID);
    this.newsSaved = await this.dbService.getAllNews();
    console.log('newsSaved:', this.newsSaved);
    this.saveState = this.newsSaved.some((save) => save.newsID === this.newsID);

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
    
    this.authService.currentUser$.subscribe(async user => {
      if (user == null) {
        this.saveState = false;
      } else {
        this.newsSaved = await this.dbService.getAllNews();
        this.saveState = this.newsSaved.some((save) => save.newsID === this.newsID);
      }
    })
  }
    
  async ionViewWillEnter() {
    this.newsSaved = await this.dbService.getAllNews();
    this.saveState = this.newsSaved.some((save) => save.newsID === this.newsID);
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
    if (this.authService.getCurrentUser() == null) {
      this.router.navigate(['/login']);
      return;
    }
    this.dbService.addNews(this.newsID)
    this.saveState = true;
  }
  unsaveNews() {
    this.dbService.deleteNews(this.newsID)
    this.saveState = false;
  }
}