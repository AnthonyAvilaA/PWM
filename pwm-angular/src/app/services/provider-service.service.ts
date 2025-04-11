import { Injectable } from '@angular/core';
import { NewsProvider } from './providers/interfaces/news.provider';
import { NewsFirebaseProviderServiceService } from './providers/firebase/news.firebase.provider.service.service';
import { db } from 'environments/firebase.config';
import { UserProvider } from './providers/interfaces/user.provider';
import { UsersFirebaseProviderServiceService } from './providers/firebase/users.firebase.provider.service.service';
import { CommentProvider } from './providers/interfaces/comment.provider';
import { CommentsFirebaseProviderServiceService } from './providers/firebase/comments.firebase.provider.service.service';

@Injectable({
  providedIn: 'root'
})
export class ProviderServiceService {
  
  //public newsProvider: NewsProvider = new NewsFirebaseProviderServiceService(db);
  public newsProvider: NewsProvider = new NewsFirebaseProviderServiceService(db);

  public usersProvider: UserProvider = new UsersFirebaseProviderServiceService(db);
  
  public commentsProvider: CommentProvider = new CommentsFirebaseProviderServiceService(db);
}
