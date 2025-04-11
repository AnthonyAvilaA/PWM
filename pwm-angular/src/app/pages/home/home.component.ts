import { Component, Inject } from '@angular/core';
import { ArticleComponent } from "@components/article/article.component";
import { NewsProviderServiceService } from '@services/news-provider-service.service';
import { NewsFirebaseProviderServiceService } from '@services/providers/firebase/news.firebase.provider.service.service';
import { NewsProvider } from '@services/providers/interfaces/news.provider';
import { NewsJsonProviderService } from '@services/providers/json/news.json.provider.service';
import { db } from 'environments/firebase.config';

@Component({
  selector: 'app-home',
  imports: [ArticleComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private newsProvider: NewsProvider; // leer Json
  private jsonProviderTEMP: NewsJsonProviderService //  escribir a Firebase
  // En realidad solo deberíamos usar news provider conectado a fb
  // pero lo hice de esta forma para leer los json y escribir a firebase

  constructor(private providerService: NewsProviderServiceService) {
    this.newsProvider = providerService.newsProvider;
    this.jsonProviderTEMP = new NewsJsonProviderService();
  }

  async ngOnInit(): Promise<void> {  
    /*
    const added = await this.newsProvider.addNews({
      title: "string",
      authorID: "string",
      description: "string",
      content: "string",
      image: "string",
      categories: ["string[]"],
      usersCommentsID: ["string[]"],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    let news = await this.jsonProviderTEMP.getAllNews();
    console.log(news.length);
    news = await this.newsProvider.getAllNews();
    console.log(news.length); 

    for (const article of news) {
        await this.newsProvider.addNews(article); 
    }
    */
  }
}
