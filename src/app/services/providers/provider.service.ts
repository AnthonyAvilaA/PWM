import { Injectable } from '@angular/core';
import { NewsFirebaseServiceInterface } from '@services/providers/firebase/interfaces/news-firebase-service.interface';
import { NewsFirebaseService } from './firebase/news.firebase.service';
import { db } from '../../../environments/firebase.config';
import { UserFirebaseServiceInterface } from '@services/providers/firebase/interfaces/user-firebase-service.interface';
import { UserFirebaseService } from './firebase/user.firebase.service';
import { CommentFirebaseServiceInterface } from '@services/providers/firebase/interfaces/comment-firebase-service.interface';
import { CommentsFirebaseService } from './firebase/comments.firebase.service';
import { FullNewsModel } from '@models/full-news.model';
import { CommentModel } from '@models/comment.model';
import { UserModel } from '@models/user.model';
import { NewsModel } from '@models/news.model';
import { AuthFirebaseServiceInterface } from '@services/providers/firebase/interfaces/auth-firebase-service.interface';
import { AuthFirebaseService } from './firebase/auth.firebase.service';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {

  //public newsProvider: NewsFirebaseServiceInterface = new NewsFirebaseService(db);
  public newsProvider: NewsFirebaseServiceInterface = new NewsFirebaseService(db);

  public usersProvider: UserFirebaseServiceInterface = new UserFirebaseService(db);

  public commentsProvider: CommentFirebaseServiceInterface = new CommentsFirebaseService(db);

  public authProvider: AuthFirebaseServiceInterface = new AuthFirebaseService(db);

  public async getFullNewsById(id: string): Promise<FullNewsModel> {
    const news : NewsModel = await this.newsProvider.getNewsById(id);
    const author : UserModel = await this.usersProvider.getUserById(news.authorID);
    const comments : CommentModel[] = [];
    for (let i = 0; i < news.usersCommentsID.length; i++) {
      const comment : CommentModel = await this.commentsProvider.getCommentById(news.usersCommentsID[i]);
      comments.push(comment);
    }
    return {
      news: news,
      author: author,
      comments: comments,
    } as FullNewsModel;
  }
}
