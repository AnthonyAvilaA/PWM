import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ArticleComponent } from '@components/article/article.component';
import { SideArticleComponent } from '@components/side-article/side-article.component';
import { NewsService } from '@services/core/news.service';
import { NewsModel } from '@models/news.model';
import { Title } from '@angular/platform-browser';
import { Category } from '@models/types/categories.type';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterLink, ArticleComponent, SideArticleComponent],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit, OnDestroy {
  categoryName: Category = Category.null;
  displayCategoryName: string = '';
  news: NewsModel[] = [];
  featuredNews: NewsModel | null = null;
  secondaryNews: NewsModel[] = [];
  relatedNews: NewsModel[] = [];

  loading: boolean = true;
  error: string | null = null;

  private routeSubscription?: Subscription;
  private newsSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private newsService: NewsService,
    private titleService: Title
  ) {}

  /**
   * Normalizes text by removing accents
   * @param text Text to normalize
   * @returns Normalized text without accents
   */
  private normalizeText(text: string): string {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  /**
   * Maps a URL parameter (without accents) to the proper display name (with accents)
   */
  private getDisplayCategoryName(urlParam: string): string {
    if (!urlParam) return '';

    // Normalize the input parameter
    const normalizedParam = this.normalizeText(urlParam);

    // Find the matching category enum value
    const matchingCategory = Object.values(Category).find(enumValue =>
      this.normalizeText(enumValue as string) === normalizedParam
    );

    // Return the original enum value (with accents) or fallback to the URL parameter
    return matchingCategory as string || urlParam.charAt(0).toUpperCase() + urlParam.slice(1);
  }

  ngOnInit(): void {
    // Subscribe to route parameter changes
    this.routeSubscription = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.loading = true;
        this.error = null;

        this.categoryName = params.get('categoryName') as Category || Category.null;

        if (this.categoryName === Category.null || this.categoryName === undefined) {
          this.categoryName = Category.null;
        }
        else {
          this.displayCategoryName = this.getDisplayCategoryName(this.categoryName);
          this.updateTitle();
          return this.newsService.getNewsByCategory(this.categoryName);
        }

        return [];
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
    // Use the proper display name with accents
    const formattedCategory = this.displayCategoryName || 'Todas las Categorías';

    this.titleService.setTitle(`Argony News | ${formattedCategory}`);
  }

  /**
   * Distributes news items between featured, secondary, and related news sections
   */
  private distributeNews(newsItems: NewsModel[]): void {
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
