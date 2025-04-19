import { Injectable } from '@angular/core';
import { NewsProvider } from './providers/interfaces/news.provider';
import { NewsFirebaseProviderServiceService } from './providers/firebase/news.firebase.provider.service.service';
import { db } from 'environments/firebase.config';
import { UserProvider } from './providers/interfaces/user.provider';
import { UsersFirebaseProviderServiceService } from './providers/firebase/users.firebase.provider.service.service';
import { CommentProvider } from './providers/interfaces/comment.provider';
import { CommentsFirebaseProviderServiceService } from './providers/firebase/comments.firebase.provider.service.service';
import { FullNews } from '@models/fullNews';
import { Comment } from '@models/comment';
import { User } from '@models/user';
import { News } from '@models/news';
import { AuthProvider } from './providers/interfaces/auth.provider';
import { AuthFirebaseProviderService } from './providers/firebase/auth.firebase.provider.service';

@Injectable({
  providedIn: 'root'
})
export class ProviderServiceService {
  
  //public newsProvider: NewsProvider = new NewsFirebaseProviderServiceService(db);
  public newsProvider: NewsProvider = new NewsFirebaseProviderServiceService(db);

  public usersProvider: UserProvider = new UsersFirebaseProviderServiceService(db);
  
  public commentsProvider: CommentProvider = new CommentsFirebaseProviderServiceService(db);

  public authProvider: AuthProvider = new AuthFirebaseProviderService(db);

  public async getFullNewsById(id: string): Promise<FullNews> {
    const news : News = await this.newsProvider.getNewsById(id);
    const author : User = await this.usersProvider.getUserById(news.authorID);
    const comments : Comment[] = [];
    for (let i = 0; i < news.usersCommentsID.length; i++) {
      const comment : Comment = await this.commentsProvider.getCommentById(news.usersCommentsID[i]);
      comments.push(comment);
    }
    return {
      news: news,
      author: author,
      comments: comments,
    } as FullNews;
  }
}
