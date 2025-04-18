import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ArticleComponent } from '../../components/article/article.component';
import { SideArticleComponent } from '../../components/side-article/side-article.component';
import { NewsService } from '../../services/news.service';
import { News } from '../../models/news';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterLink, ArticleComponent, SideArticleComponent],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit, OnDestroy {
  categoryName: string = '';
  news: News[] = [];
  featuredNews: News | null = null;
  secondaryNews: News[] = [];
  relatedNews: News[] = [];
  
  loading: boolean = true;
  error: string | null = null;
  
  private routeSubscription?: Subscription;
  private newsSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private newsService: NewsService,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    // Subscribe to route parameter changes
    this.routeSubscription = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.loading = true;
        this.error = null;
        
        // Get category from URL or use default
        this.categoryName = params.get('categoryName') || '';
        
        // Set page title
        this.updateTitle();
        
        // Fetch news for this category
        return this.newsService.getNewsByCategory(this.categoryName);
      })
    ).subscribe({
      next: (newsItems) => {
        this.news = newsItems;
        this.distributeNews(newsItems);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading category news:', err);
        this.error = 'No se pudieron cargar las noticias para esta categoría.';
        this.loading = false;
      }
    });
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    if (this.newsSubscription) {
      this.newsSubscription.unsubscribe();
    }
  }

  private updateTitle(): void {
    // Format category name for display (capitalize first letter)
    const formattedCategory = this.categoryName 
      ? this.categoryName.charAt(0).toUpperCase() + this.categoryName.slice(1) 
      : 'Todas las Categorías';
    
    this.titleService.setTitle(`Argony News | ${formattedCategory}`);
  }

  /**
   * Distributes news items between featured, secondary, and related news sections
   */
  private distributeNews(newsItems: News[]): void {
    // Reset news arrays
    this.featuredNews = null;
    this.secondaryNews = [];
    this.relatedNews = [];
    
    if (newsItems.length === 0) {
      return;
    }
    
    // First item is featured news
    this.featuredNews = newsItems[0];
    
    // Next 2 items are secondary news
    for (let i = 1; i < 3 && i < newsItems.length; i++) {
      this.secondaryNews.push(newsItems[i]);
    }
    
    // Remaining items are related news
    for (let i = 3; i < newsItems.length; i++) {
      this.relatedNews.push(newsItems[i]);
    }
  }
}
