import { Component } from '@angular/core';
import { ArticleComponent } from "@components/article/article.component";
import { ProviderServiceService } from '@services/provider-service.service';
import { NewsProvider } from '@services/providers/interfaces/news.provider';
import { UserProvider } from '@services/providers/interfaces/user.provider';
import { CommentProvider } from '@services/providers/interfaces/comment.provider';
import { News } from '@models/news';

@Component({
  selector: 'app-home',
  imports: [ArticleComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private firebaseProvider: ProviderServiceService;
  private newsProvider: NewsProvider;
  private userProvider: UserProvider;
  private commentProvider: CommentProvider;

  constructor(private providerService: ProviderServiceService) {
    this.firebaseProvider = providerService;
    this.newsProvider = providerService.newsProvider;
    this.userProvider = providerService.usersProvider;
    this.commentProvider = providerService.commentsProvider;
  }

  async ngOnInit(): Promise<void> {  
    const news: News[] = await this.newsProvider.getAllNews();
    console.log(await this.firebaseProvider.getFullNewsById(news[0].ID));
  }
}
