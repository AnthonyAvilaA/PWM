import { Component } from '@angular/core';
import { ArticleComponent } from "@components/article/article.component";
import { ProviderServiceService } from '@services/provider-service.service';
import { NewsProvider } from '@services/providers/interfaces/news.provider';
import { UserProvider } from '@services/providers/interfaces/user.provider';
import { collection, CollectionReference, doc, Firestore, setDoc } from 'firebase/firestore';
import { Comment } from '@models/comment';
import { db } from 'environments/firebase.config';
import { CommentProvider } from '@services/providers/interfaces/comment.provider';

@Component({
  selector: 'app-home',
  imports: [ArticleComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private newsProvider: NewsProvider;
  private userProvider: UserProvider;
  private commentProvider: CommentProvider;
  private db: Firestore;

  constructor(private providerService: ProviderServiceService) {
    this.newsProvider = providerService.newsProvider;
    this.userProvider = providerService.usersProvider;
    this.commentProvider = providerService.commentsProvider;
    this.db = db;
  }

  async ngOnInit(): Promise<void> {  
    /*
    try {
      // Fetch data.json
      const response = await fetch('assets/data.json');
      const data = await response.json();

      // Extract comments from data.json
      data.data.forEach((newsItem: any) => {
        if (Array.isArray(newsItem.comments)) {
          newsItem.comments.forEach((comment: any) => {
            if (comment.id && comment.Content && comment.createdAt) {
              const commentToAdd = ({
                userID: comment.User.id,
                content: comment.Content,
                createdAt: comment.createdAt
              }) as Comment;
              this.commentProvider.addCommentByID(commentToAdd, `${comment.id}`);
            }
          });
        }
      });

      console.log('Comments uploaded successfully!');
    } catch (error) {
      console.error('Error uploading comments:', error);
    }
    */
  }
}
